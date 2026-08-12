import './InfoPage.css';

const resources = [
  { title: 'DSA Interview Guide', desc: 'A complete roadmap for cracking data structures & algorithms rounds.' },
  { title: 'System Design Basics', desc: 'Learn the fundamentals of designing scalable systems.' },
  { title: 'Behavioral Interview Tips', desc: 'How to answer common behavioral questions with confidence.' },
  { title: 'Resume Templates', desc: 'ATS-friendly resume templates for tech roles.' },
];

const Resources = () => (
  <div className="info-page">
    <h1>Resources</h1>
    <p className="subtitle">Guides and tools to help you prepare smarter.</p>
    <div className="info-grid">
      {resources.map((r) => (
        <div key={r.title} className="info-card">
          <h3>{r.title}</h3>
          <p>{r.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Resources;