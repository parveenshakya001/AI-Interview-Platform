import { useNavigate } from 'react-router-dom';
import './Categories.css';

const categories = [
  {
    name: 'DSA',
    icon: '🧩',
    path: 'dsa',
    desc: 'Arrays, trees, graphs, dynamic programming, and more.',
  },
  {
    name: 'Python',
    icon: '🐍',
    path: 'python',
    desc: 'Core Python concepts, OOP, and common interview questions.',
  },
  {
    name: 'Java',
    icon: '☕',
    path: 'java',
    desc: 'Java fundamentals, collections, and multithreading.',
  },
  {
    name: 'AI/ML',
    icon: '🤖',
    path: 'ai-ml',
    desc: 'Machine learning concepts, model evaluation, and case studies.',
  },
  {
    name: 'Web Development',
    icon: '🌐',
    path: 'web-development',
    desc: 'HTML, CSS, JavaScript, React, and system design basics.',
  },
  {
    name: 'System Design',
    icon: '🏗️',
    path: 'system-design',
    desc: 'Scalability, databases, caching, and architecture trade-offs.',
  },
];

const levelColor = {
  Easy: 'green',
  Medium: 'amber',
};

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h1>Mock Interview Categories</h1>
        <p>Choose a category to start practicing with AI-generated questions.</p>
      </div>

      <div className="cat-grid">
        {categories.map((cat) => (
          <div key={cat.name} className="cat-card">
            <div className="cat-icon">{cat.icon}</div>
            <div className="cat-top-row">
              <h3>{cat.name}</h3>
              <span className={`cat-level ${levelColor[cat.level]}`}>{cat.level}</span>
            </div>
            <p className="cat-desc">{cat.desc}</p>
            <button onClick={() => navigate(`/interview/${cat.path}`)}>
              Start Interview →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;