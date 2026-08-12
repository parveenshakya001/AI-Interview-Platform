import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './History.css';

const categoryLabels = {
  dsa: 'DSA',
  python: 'Python',
  java: 'Java',
  'ai-ml': 'AI/ML',
  'web-development': 'Web Development',
  'system-design': 'System Design',
};

const categoryIcons = {
  dsa: '🧩',
  python: '🐍',
  java: '☕',
  'ai-ml': '🤖',
  'web-development': '🌐',
  'system-design': '🏗️',
};

const scoreColor = (score) => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'amber';
  return 'red';
};

const History = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/dashboard/history');
        setResults(res.data.results);
      } catch (err) {
        setError('Could not load your interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredResults =
    filter === 'all' ? results : results.filter((r) => r.category === filter);

  const categories = ['all', ...Object.keys(categoryLabels)];

  return (
    <div className="hist-page">
      <div className="hist-header">
        <h1>Interview History</h1>
        <p>Review your past mock interviews and coding tests.</p>
      </div>

      <div className="hist-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {loading && <p className="hist-status">Loading your history...</p>}
      {error && <p className="hist-status error">{error}</p>}

      {!loading && !error && filteredResults.length === 0 && (
        <div className="hist-empty">
          <p>No interviews yet in this category.</p>
          <button onClick={() => navigate('/categories')}>Start an Interview</button>
        </div>
      )}

      {!loading && !error && filteredResults.length > 0 && (
        <div className="hist-list">
          {filteredResults.map((r) => (
            <div key={r.id} className="hist-row">
              <div className="hist-icon">{categoryIcons[r.category] || '📋'}</div>
              <div className="hist-info">
                <p className="hist-title">
                  {categoryLabels[r.category] || r.category}{' '}
                  {r.type === 'interview' ? 'Mock Interview' : 'Coding Test'}
                </p>
                <p className="hist-date">
                  {new Date(r.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className={`hist-score ${scoreColor(r.score)}`}>{r.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;