import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const navLinks = [
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Resources', path: '/resources' },
  { label: 'Blog', path: '/blog' },
];

const tools = [
  { icon: '🎤', label: 'AI Mock Interviews' },
  { icon: '🎥', label: 'Live Video Simulation' },
  { icon: '👁️', label: 'Emotion & Eye Tracking' },
  { icon: '📄', label: 'Resume Analyzer' },
  { icon: '🤝', label: 'Recruiter Connect' },
  { icon: '📱', label: 'Mobile App' },
];

const Home = () => {
  const navigate = useNavigate();

  const handleWatchDemo = () => {
    alert('Demo video coming soon!');
  };

  const handleToolClick = () => {
    navigate('/register');
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo">⬡ InterviewAI</div>
        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.path} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>
            Crack Your Dream Job <br />
            with <span className="highlight">AI-Powered</span> <br />
            Interview Preparation
          </h1>
          <p>All-in-one platform to practice, improve and get hired with confidence.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary large">Get Started Free</Link>
            <button className="btn-outline large" onClick={handleWatchDemo}>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-orb" />
          <div className="badge badge-1">💬 Real-time Feedback</div>
          <div className="badge badge-2">🎯 Practice Like a Pro</div>
          <div className="avatar-placeholder">🧑‍💻🤖</div>
        </div>
      </section>

      <section className="tools-row" id="features">
        {tools.map((t) => (
          <button key={t.label} className="tool-chip" onClick={handleToolClick}>
            <span className="tool-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Home;