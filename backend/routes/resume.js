const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

// Extract text from file buffer
async function extractText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimetype === 'text/plain') {
      return buffer.toString('utf-8');
    }
    throw new Error('Unsupported file type');
  } catch (err) {
    throw new Error(`Text extraction failed: ${err.message}`);
  }
}

// POST /api/resume/upload
router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype, size } = req.file;
    
    // Extract text
    let extractedText;
    try {
      extractedText = await extractText(buffer, mimetype);
    } catch (err) {
      return res.status(422).json({ error: err.message });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({ error: 'Could not extract meaningful text from file. Please ensure the file contains readable text.' });
    }

    const resumeId = uuidv4();
    const fileName = `${req.user.id}/${resumeId}_${originalname}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('resumes')
      .upload(fileName, buffer, {
        contentType: mimetype,
        upsert: false
      });

    if (storageError) {
      console.error('Storage error:', storageError);
      // Continue without storage - just save text
    }

    // Save resume metadata to DB
    const { data: resume, error: dbError } = await supabase
      .from('resumes')
      .insert({
        id: resumeId,
        user_id: req.user.id,
        file_name: originalname,
        file_size: size,
        file_type: mimetype,
        storage_path: storageError ? null : fileName,
        extracted_text: extractedText.substring(0, 50000), // limit stored text
        word_count: extractedText.split(/\s+/).length,
        status: 'uploaded'
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      return res.status(500).json({ error: 'Failed to save resume' });
    }

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume.id,
        file_name: resume.file_name,
        file_size: resume.file_size,
        word_count: resume.word_count,
        status: resume.status,
        created_at: resume.created_at
      }
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// GET /api/resume/list
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('id, file_name, file_size, word_count, status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json({ resumes: resumes || [] });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// GET /api/resume/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// DELETE /api/resume/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: resume } = await supabase
      .from('resumes')
      .select('storage_path')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Delete from storage
    if (resume.storage_path) {
      await supabase.storage.from('resumes').remove([resume.storage_path]);
    }

    // Delete from DB (analyses will cascade)
    await supabase.from('resumes').delete().eq('id', req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;
