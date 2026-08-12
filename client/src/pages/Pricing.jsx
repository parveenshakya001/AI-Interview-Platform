import './InfoPage.css';

const plans = [
  { name: 'Free', price: '$0', features: ['5 practice interviews/month', 'Basic AI feedback', 'Community support'] },
  { name: 'Pro', price: '$12/mo', features: ['Unlimited interviews', 'Advanced AI feedback', 'Resume analyzer', 'Priority support'] },
  { name: 'Team', price: 'Contact us', features: ['Everything in Pro', 'Team dashboards', 'Recruiter connect', 'Custom onboarding'] },
];

const Pricing = () => (
  <div className="info-page">
    <h1>Pricing</h1>
    <p className="subtitle">Simple plans that grow with you.</p>
    <div className="info-grid">
      {plans.map((p) => (
        <div key={p.name} className="info-card">
          <h3>{p.name}</h3>
          <p className="price">{p.price}</p>
          <ul>
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Pricing;