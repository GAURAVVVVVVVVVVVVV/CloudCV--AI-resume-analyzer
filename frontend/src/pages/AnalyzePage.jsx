import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumeAPI, analysisAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, FileText, X, Sparkles, Briefcase, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const STEPS = ['Upload Resume', 'Add Job Description (Optional)', 'Analyzing...'];

function FilePreview({ file, onRemove }) {
  const sizeKB = (file.size / 1024).toFixed(1);
  const ext = file.name.split('.').pop().toUpperCase();
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-violet-300"
        style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
        {ext}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{file.name}</p>
        <p className="text-gray-500 text-xs">{sizeKB} KB</p>
      </div>
      <button onClick={onRemove} className="text-gray-600 hover:text-rose-400 transition-colors p-1">
        <X size={16} />
      </button>
    </div>
  );
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      if (err.code === 'file-too-large') toast.error('File too large. Max size is 5MB.');
      else if (err.code === 'file-invalid-type') toast.error('Only PDF, DOCX, and TXT files are supported.');
      else toast.error('Invalid file.');
      return;
    }
    if (accepted.length > 0) {
      setFile(accepted[0]);
      toast.success('File ready to analyze!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a resume first.');
    setLoading(true);
    setStep(2);

    try {
      // Step 1: Upload resume
      setStatusMsg('Uploading your resume...');
      const formData = new FormData();
      formData.append('resume', file);
      const { data: uploadData } = await resumeAPI.upload(formData);
      const resumeId = uploadData.resume.id;

      // Step 2: Analyze
      setStatusMsg('AI is reading your resume...');
      await new Promise(r => setTimeout(r, 800)); // small UX delay
      setStatusMsg('Generating insights and recommendations...');
      const { data: analysisData } = await analysisAPI.analyze({
        resume_id: resumeId,
        job_description: jobDesc.trim() || undefined,
      });

      toast.success('Analysis complete! 🎉');
      navigate(`/results/${analysisData.analysis_id}`, {
        state: { result: analysisData.result, fileName: file.name }
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Analysis failed. Please try again.';
      toast.error(msg);
      setStep(0);
      setLoading(false);
      setStatusMsg('');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-12 w-full">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-2"
              style={{ background: 'rgba(139, 92, 246, 0.15)', border: '2px solid rgba(139, 92, 246, 0.3)' }}>
              <Sparkles size={36} className="text-violet-400" style={{ animation: 'spin 2s linear infinite' }} />
            </div>
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-3">Analyzing your resume...</h2>
          <p className="text-gray-400 mb-8 text-sm">{statusMsg}</p>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
          <p className="text-gray-600 text-xs mt-4">This typically takes 15–30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Analyze Resume</h1>
        <p className="text-gray-400">Upload your resume and get instant AI feedback</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {['Upload', 'Job Match (Optional)', 'Analyze'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${step === i ? 'bg-violet-600 text-white' : step > i ? 'bg-jade-600/20 text-jade-400' : 'bg-white/5 text-gray-500'}`}>
              {step > i ? <CheckCircle size={12} /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < 2 && <div className="w-6 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div className="glass-card p-8">
        <h2 className="font-display font-semibold text-white text-xl mb-6 flex items-center gap-2">
          <FileText size={20} className="text-violet-400" />
          Upload Your Resume
        </h2>

        {!file ? (
          <div {...getRootProps()} className={`dropzone p-12 text-center ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Upload size={28} className="text-violet-400" />
            </div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">
              {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {['PDF', 'DOCX', 'TXT'].map(t => (
                <span key={t} className="tag tag-purple">{t}</span>
              ))}
              <span className="tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)' }}>
                Max 5MB
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <FilePreview file={file} onRemove={() => setFile(null)} />
            <div className="flex items-center gap-2 text-jade-400 text-sm">
              <CheckCircle size={16} />
              <span>File ready for analysis</span>
            </div>
          </div>
        )}
      </div>

      {/* Job description */}
      <div className="glass-card p-8">
        <h2 className="font-display font-semibold text-white text-xl mb-2 flex items-center gap-2">
          <Briefcase size={20} className="text-amber-400" />
          Job Description
          <span className="text-xs font-normal text-gray-500 ml-1">(optional but recommended)</span>
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Paste the job description to get a tailored compatibility score and keyword analysis.
        </p>
        <textarea
          className="input-field resize-none"
          rows={7}
          placeholder="Paste the job description here... e.g. 'We are looking for a Software Engineer with 3+ years of experience in React, Node.js...'"
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
          maxLength={3000}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-600">{jobDesc.length}/3000 characters</p>
          {jobDesc.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <AlertCircle size={12} />
              Job match scoring enabled
            </div>
          )}
        </div>
      </div>

      {/* Analyze button */}
      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="btn-primary px-10 py-4 rounded-xl font-semibold text-base flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={20} />
          Analyze Resume with AI
        </button>
      </div>
    </div>
  );
}
