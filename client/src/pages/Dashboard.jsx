import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import './Dashboard.css';

const navItems = [
  { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { label: 'Mock Interview', icon: '🎤', path: '/categories' },
  { label: 'Resume Analyzer', icon: '📄', path: '/resume' },
  { label: 'Coding Tests', icon: '💻', path: '/coding' },
  { label: 'Live Video Practice', icon: '🎥', path: '/video-practice' },
  { label: 'Interview History', icon: '🕒', path: '/history' },
  { label: 'Learning Roadmap', icon: '🗺️', path: '/roadmap' },
  { label: 'Leaderboard', icon: '🏆', path: '/leaderboard' },
  { label: 'Recruiter Portal', icon: '🧑‍💼', path: '/recruiter' },
  { label: 'Achievements', icon: '⭐', path: '/achievements' },
  { label: 'Settings', icon: '⚙️', path: '/settings' },
];

const tracks = [
  { label: 'DSA Track', path: 'dsa' },
  { label: 'Python Track', path: 'python' },
  { label: 'Java Track', path: 'java' },
  { label: 'AI/ML Track', path: 'ai-ml' },
  { label: 'Web Development Track', path: 'web-development' },
  { label: 'System Design Track', path: 'system-design' },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [track, setTrack] = useState(tracks[0].path);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/dashboard/stats?category=${track}`);
        setData(res.data);
      } catch (err) {
        console.error('Dashboard stats error:', err);
        setError('Could not load your stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [track]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d2-shell">
      <aside className="d2-sidebar">
        <div className="d2-logo">⬡ InterviewAI</div>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.label}
              className={item.label === 'Dashboard' ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              <span className="d2-nav-icon">{item.icon}</span> {item.label}
            </a>
          ))}
        </nav>
        <a className="d2-logout-link" onClick={handleLogout}>
          🚪 Logout
        </a>
      </aside>

      <main className="d2-main">
        <header className="d2-topbar">
          <div>
            <h1>Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋</h1>
            <p>Keep practicing and achieve your goals.</p>
          </div>
          <div className="d2-topbar-right">
            <select
              className="d2-track-select"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            >
              {tracks.map((t) => (
                <option key={t.path} value={t.path}>
                  {t.label}
                </option>
              ))}
            </select>
            <span className="d2-bell">🔔</span>
            <div className="d2-avatar">{user?.fullName?.[0] || 'S'}</div>
          </div>
        </header>

        {loading && <p style={{ color: '#6b7280' }}>Loading your stats...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        {!loading && !error && data && (
          <>
            <section className="d2-stat-row">
              <div className="d2-stat-card">
                <p className="d2-stat-value blue">{data.stats.interviews}</p>
                <p className="d2-stat-label">Mock Interviews</p>
              </div>
              <div className="d2-stat-card">
                <p className="d2-stat-value green">{data.stats.avgScore}</p>
                <p className="d2-stat-label">Average Score</p>
              </div>
              <div className="d2-stat-card">
                <p className="d2-stat-value purple">{data.stats.tests}</p>
                <p className="d2-stat-label">Coding Tests</p>
              </div>
              <div className="d2-stat-card">
                <p className="d2-stat-value red">{data.stats.streak}</p>
                <p className="d2-stat-label">Streak</p>
              </div>
            </section>

            <section className="d2-grid-row">
              <div className="d2-panel d2-chart-panel">
                <p className="d2-panel-title">
                  Performance Overview — {tracks.find((t) => t.path === track)?.label}
                </p>
                {data.chart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="day" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: 13 }}>
                    No attempts yet in this track. Start one to see your progress here.
                  </p>
                )}
              </div>

              <div className="d2-panel">
                <p className="d2-panel-title">Quick Actions</p>
                <button className="d2-action primary" onClick={() => navigate(`/interview/${track}`)}>
                  🎤 Start Mock Interview
                </button>
                <button className="d2-action" onClick={() => navigate('/resume')}>
                  📄 Upload Resume
                </button>
                <button className="d2-action" onClick={() => navigate('/coding')}>
                  💻 Take Coding Test
                </button>
                <button className="d2-action" onClick={() => navigate('/video-practice')}>
                  🎥 Video Practice
                </button>
              </div>

              <div className="d2-panel">
                <p className="d2-panel-title">Recent Activity</p>
                {data.activity.length > 0 ? (
                  data.activity.map((a, i) => (
                    <div key={i} className="d2-activity-row">
                      <span className="d2-activity-icon purple">📊</span>
                      <div>
                        <p className="d2-activity-title">{a.title}</p>
                        <p className="d2-activity-detail">{a.detail}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: 12 }}>No activity yet.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;