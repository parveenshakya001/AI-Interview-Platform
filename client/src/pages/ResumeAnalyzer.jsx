import { useState } from 'react';
import api from '../services/api';
import './ResumeAnalyzer.css';

const tabs = ['upload', 'analysis', 'suggestions'];

const ResumeAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Max size is 5MB.');
      return;
    }

    setFileName(file.name);
    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      setActiveTab('analysis');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
    e.target.value = '';
  };

  const radius = 54;
  const circumference = Math.PI * radius;
  const atsScore = result?.atsScore || 0;
  const offset = circumference - (atsScore / 100) * circumference;
  const isLocked = (tab) => tab !== 'upload' && !result;

  return (
    <div className="ra-page">
      <h1 className="ra-title">Resume Analyzer</h1>

      <div className="ra-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => !isLocked(tab) && setActiveTab(tab)}
            disabled={isLocked(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {activeTab === 'upload' && (
        <div className="ra-upload-card">
          <div className="ra-upload-icon">☁️</div>
          <p className="ra-upload-title">Upload Your Resume</p>
          <p className="ra-upload-sub">PDF, DOCX (Max 5MB)</p>
          <label className="ra-choose-btn">
            {analyzing ? 'Analyzing with AI...' : 'Choose File'}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              hidden
              disabled={analyzing}
            />
          </label>
          {fileName && <p className="ra-filename">📄 {fileName}</p>}
        </div>
      )}

      {activeTab === 'analysis' && result && (
        <>
          <div className="ra-analysis-grid">
            <div className="ra-panel">
              <p className="ra-panel-title">Analysis Results</p>
              <div className="ra-gauge-wrap">
                <svg viewBox="0 0 120 70" className="ra-gauge">
                  <path d="M 6 64 A 54 54 0 0 1 114 64" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                  <path
                    d="M 6 64 A 54 54 0 0 1 114 64"
                    fill="none"
                    stroke={atsScore >= 70 ? '#16a34a' : atsScore >= 50 ? '#d97706' : '#dc2626'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div className="ra-gauge-label">
                  <span className="ra-gauge-score">{atsScore}</span>
                  <span className="ra-gauge-max">/100</span>
                </div>
              </div>
              <p className="ra-gauge-status">
                {atsScore >= 70 ? '✅ Excellent!' : atsScore >= 50 ? '⚠️ Good, room to improve' : '❌ Needs work'}
              </p>
            </div>

            <div className="ra-panel">
              <p className="ra-panel-title">Suggestions</p>
              <ul className="ra-suggestion-list">
                {result.suggestions?.map((s) => <li key={s}>✅ {s}</li>)}
              </ul>
            </div>
          </div>

          <div className="ra-skills-row">
            <div className="ra-panel">
              <p className="ra-panel-title">Detected Skills</p>
              <div className="ra-tags">
                {result.detectedSkills?.map((s) => <span key={s} className="ra-tag detected">{s}</span>)}
              </div>
            </div>
            <div className="ra-panel">
              <p className="ra-panel-title">Missing Skills</p>
              <div className="ra-tags">
                {result.missingSkills?.map((s) => <span key={s} className="ra-tag missing">{s}</span>)}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'suggestions' && result && (
        <div className="ra-panel">
          <p className="ra-panel-title">Detailed Suggestions</p>
          <ul className="ra-suggestion-list">
            {result.suggestions?.map((s) => <li key={s}>✅ {s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;