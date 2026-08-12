import './InfoPage.css';

const posts = [
  { title: 'How AI is Changing Interview Prep', date: 'July 2026', excerpt: 'A look at how AI-powered tools are reshaping how candidates prepare.' },
  { title: '5 Common DSA Mistakes to Avoid', date: 'June 2026', excerpt: 'Practical tips to avoid common pitfalls in coding interviews.' },
  { title: 'From Rejection to Offer: A Success Story', date: 'May 2026', excerpt: 'How one candidate turned repeated rejections into an offer.' },
];

const Blog = () => (
  <div className="info-page">
    <h1>Blog</h1>
    <p className="subtitle">Tips, stories, and updates from the InterviewAI team.</p>
    <div className="info-grid">
      {posts.map((p) => (
        <div key={p.title} className="info-card">
          <h3>{p.title}</h3>
          <p className="date">{p.date}</p>
          <p>{p.excerpt}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Blog;