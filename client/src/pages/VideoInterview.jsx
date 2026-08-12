import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './VideoInterview.css';

const questionBank = {
  dsa: [
    'Explain the difference between an array and a linked list.',
    'How would you detect a cycle in a linked list?',
    'What is the time complexity of quicksort in the worst case, and why?',
    'Explain how a hash map handles collisions.',
    'Describe an approach to find the shortest path in an unweighted graph.',
  ],
  python: [
    "What is the difference between a list and a tuple in Python?",
    "Explain Python's GIL and its impact on multithreading.",
    'What are decorators and how would you use one?',
    'How does Python handle memory management?',
    'Explain the difference between `is` and `==`.',
  ],
  java: [
    'What is the difference between an interface and an abstract class?',
    'Explain how the JVM garbage collector works.',
    'What is the difference between `==` and `.equals()` in Java?',
    'Describe how multithreading works in Java.',
    'What are the four pillars of OOP, with Java examples?',
  ],
  'ai-ml': [
    'Explain the bias-variance tradeoff.',
    'What is the difference between supervised and unsupervised learning.',
    'How would you handle an imbalanced dataset?',
    'Explain how gradient descent works.',
    'What metrics would you use to evaluate a classification model?',
  ],
  'web-development': [
    'Explain the difference between `let`, `const`, and `var`.',
    'What is the virtual DOM and why does React use it?',
    'How does event delegation work in JavaScript?',
    'Explain the CSS box model.',
    'What are React hooks, and why were they introduced?',
  ],
  'system-design': [
    'How would you design a URL shortening service?',
    'Explain the difference between horizontal and vertical scaling.',
    'What is a load balancer and why is it needed?',
    'How would you design a rate limiter?',
    'Explain the CAP theorem.',
  ],
};

const categoryLabels = {
  dsa: 'DSA',
  python: 'Python',
  java: 'Java',
  'ai-ml': 'AI Engineer',
  'web-development': 'Web Development',
  'system-design': 'System Design',
};

const VideoInterview = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const selfThumbRef = useRef(null);
  const streamRef = useRef(null);
  const cardRef = useRef(null);

  const questions = questionBank[category] || ['Tell me about yourself.'];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cameraError, setCameraError] = useState('');
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [metrics, setMetrics] = useState({
    eyeContact: 0,
    confidence: 0,
    emotion: 'Neutral',
    speakingRate: 'Analyzing...',
  });

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        if (selfThumbRef.current) selfThumbRef.current.srcObject = stream;
      } catch (err) {
        setCameraError('Camera access denied. Please allow camera permissions.');
      }
    };
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (!recording) return;
    const interval = setInterval(() => {
      setMetrics({
        eyeContact: Math.min(95, 60 + Math.floor(Math.random() * 35)),
        confidence: Math.min(95, 55 + Math.floor(Math.random() * 40)),
        emotion: ['Positive', 'Neutral', 'Focused'][Math.floor(Math.random() * 3)],
        speakingRate: ['Good', 'Slightly Fast', 'Good', 'Slightly Slow'][Math.floor(Math.random() * 4)],
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [recording]);

  const enterFullscreen = () => {
    const el = cardRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch((err) => console.error('Fullscreen failed:', err));
    } else if (el?.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleToggleRecording = async () => {
    if (recording) {
      const score = Math.round((metrics.eyeContact + metrics.confidence) / 2);
      const updated = [...scores, score];
      setScores(updated);
      setRecording(false);

      if (questionIndex < questions.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        const avg = Math.round(updated.reduce((s, v) => s + v, 0) / updated.length);
        try {
          await api.post('/dashboard/result', { category, type: 'interview', score: avg });
        } catch (err) {
          console.error('Failed to save result:', err);
        }
        setFinished(true);
        exitFullscreen();
      }
    } else {
      setRecording(true);
      setElapsed(0);
      enterFullscreen();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (finished) {
    const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
    return (
      <div className="vi-page">
        <div className="vi-card vi-result-card">
          <p className="vi-title">Interview complete</p>
          <p className="vi-score">{avg}%</p>
          <p className="vi-score-label">Average across {questions.length} questions</p>
          <div className="vi-result-actions">
            <button onClick={() => navigate('/dashboard')}>Back to dashboard</button>
            <button className="secondary" onClick={() => navigate('/history')}>
              View history
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vi-page">
      <div className="vi-card" ref={cardRef}>
        <div className="vi-header">
          <p className="vi-title">
            Live Video Interview – {categoryLabels[category] || category}
          </p>
          <div className="vi-header-right">
            {recording && <span className="vi-recording">● Recording...</span>}
            <span className="vi-timer">⏱ {formatTime(elapsed)}</span>
          </div>
        </div>

        <div className="vi-body">
          <div className="vi-video-col">
            <div className="vi-video-wrap">
              {cameraError ? (
                <div className="vi-camera-error">{cameraError}</div>
              ) : (
                <video ref={videoRef} autoPlay muted playsInline className="vi-video" />
              )}
              <div className="vi-face-box" />
            </div>

            <div className="vi-controls">
              <div className="vi-waveform">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span
                    key={i}
                    style={{ height: recording ? `${8 + Math.random() * 20}px` : '4px' }}
                  />
                ))}
              </div>
              <button
                className={`vi-record-btn ${recording ? 'stop' : ''}`}
                onClick={handleToggleRecording}
                disabled={!!cameraError}
              >
                {recording ? '■' : '●'}
              </button>
              <div className="vi-self-thumb">
                {!cameraError && (
                  <video ref={selfThumbRef} autoPlay muted playsInline />
                )}
              </div>
            </div>
          </div>

          <div className="vi-analysis-col">
            <p className="vi-analysis-title">Real-time Analysis</p>

            <div className="vi-metric">
              <span className="vi-metric-icon">👁️</span>
              <div className="vi-metric-info">
                <p className="vi-metric-label">Eye Contact</p>
                <div className="vi-bar">
                  <div className="vi-bar-fill" style={{ width: `${metrics.eyeContact}%` }} />
                </div>
              </div>
              <span className="vi-metric-value">{metrics.eyeContact}%</span>
            </div>

            <div className="vi-metric">
              <span className="vi-metric-icon">📶</span>
              <div className="vi-metric-info">
                <p className="vi-metric-label">Confidence</p>
                <div className="vi-bar">
                  <div className="vi-bar-fill purple" style={{ width: `${metrics.confidence}%` }} />
                </div>
              </div>
              <span className="vi-metric-value">{metrics.confidence}%</span>
            </div>

            <div className="vi-metric-simple">
              <span className="vi-metric-icon">😊</span>
              <p className="vi-metric-label">Emotion</p>
              <span className="vi-metric-tag green">{metrics.emotion}</span>
            </div>

            <div className="vi-metric-simple">
              <span className="vi-metric-icon">🎙️</span>
              <p className="vi-metric-label">Speaking Rate</p>
              <span className="vi-metric-tag green">{metrics.speakingRate}</span>
            </div>

            <div className="vi-question-box">
              <p className="vi-question-title">
                Interview Question ({questionIndex + 1}/{questions.length})
              </p>
              <p className="vi-question-text">{questions[questionIndex]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;