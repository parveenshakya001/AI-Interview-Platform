import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.unverified) {
        // Account exists but isn't verified yet — send to OTP page
        navigate('/verify-otp', { state: { email: data.email } });
      } else {
        setError(data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⬡ InterviewAI</div>

        <div className="auth-tabs">
          <span className="tab active">Login</span>
          <Link to="/register" className="tab">Register</Link>
        </div>

        <h2>Welcome Back!</h2>
        <p className="auth-subtitle">Login to continue your journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-wrap">
            <span className="icon">✉️</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="label-row">
            <label>Password</label>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>
          <div className="input-wrap">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">or continue with</div>

        <div className="social-row">
          <button type="button" className="social-btn">🔵 Google</button>
          <button type="button" className="social-btn">⚫ GitHub</button>
          <button type="button" className="social-btn">🟦 Microsoft</button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;