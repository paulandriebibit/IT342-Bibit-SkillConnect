import React, { useState } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [testMetric, setTestMetric] = useState(500);
  const [questionText, setQuestionText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSimulateSwap = () => {
    setTestMetric(prev => prev + 1);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setFeedbackMsg('Inquiry logged successfully. Our systems administration matrix has been notified.');
    setQuestionText('');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const faqs = [
    {
      q: "How does a skill swap work on SkillConnect?",
      a: "It's a direct peer-to-peer barter handshake. You post a skill you are willing to teach. When you find a skill you want to learn from another student, you send a swap request and select which of your active skills you want to offer them in return."
    },
    {
      q: "Is there any monetary cost or credit system involved?",
      a: "No money or artificial credits are used. The platform runs entirely on mutual knowledge exchange—one student helps another, and both grow their capabilities together."
    },
    {
      q: "Can I request a swap with myself or cancel a pending request?",
      a: "The system strictly prevents self-swaps to protect platform integrity. You can monitor all your outgoing proposals and incoming offers directly from your Bookings dashboard."
    }
  ];

  return (
    <div className="corporate-about-container">
      
      <header className="corp-hero-banner">
        <div className="corp-hero-content">
          <span className="corp-badge">Enterprise P2P Network</span>
          <h1 className="corp-hero-title">SkillConnect Architecture</h1>
          <p className="corp-hero-subtitle">
            Decentralized knowledge barter systems optimized for institutional peer networks.
          </p>
        </div>
      </header>

      <div className="corp-grid-layout">
        
        <main className="corp-main-column">
          
          <section className="corp-card">
            <div className="corp-card-header">
              <h2 className="corp-card-title">Corporate Profile</h2>
            </div>
            <div className="about-description-block">
              <p>
                <strong>SkillConnect</strong> is an automated student service exchange booking platform engineered specifically for the Cebu Institute of Technology – University community. Operating as a decentralized, peer-to-peer knowledge ledger, the platform establishes an architecture where students trade practical skills and programmatic expertise directly with one another.
              </p>
              <p>
                By translating traditional academic collaboration into a structured barter ecosystem, SkillConnect removes monetary barriers to supplemental learning. Whether optimizing a new software framework, refining a design methodology, or deploying targeted academic tutoring, the platform secures a reciprocal handshake where both participants act simultaneously as teachers and learners.
              </p>
            </div>
          </section>

          <section className="corp-card">
            <div className="corp-card-header">
              <h2 className="corp-card-title">Core Value Architecture</h2>
            </div>
            <div className="interactive-tabs">
              <button className={`tab-choice ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
                For Students
              </button>
              <button className={`tab-choice ${activeTab === 'economy' ? 'active' : ''}`} onClick={() => setActiveTab('economy')}>
                The Economy
              </button>
              <button className={`tab-choice ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>
                The Network
              </button>
            </div>
            <div className="tab-pane-view">
              {activeTab === 'students' && (
                <div className="pane-content">
                  <h3>By CIT-U Students, For Students</h3>
                  <p>Tailored specifically for our campus community to break down academic barriers and connect departments seamlessly.</p>
                </div>
              )}
              {activeTab === 'economy' && (
                <div className="pane-content">
                  <h3>True Barter Economy</h3>
                  <p>No credits, tokens, or hidden transaction fees. Just pure knowledge sharing where everyone’s skills hold real value.</p>
                </div>
              )}
              {activeTab === 'network' && (
                <div className="pane-content">
                  <h3>Real-Time Matching</h3>
                  <p>Integrated server-sent events keep you notified instantly when a match request lands or a peer drops you a message.</p>
                </div>
              )}
            </div>
          </section>

          <section className="corp-card">
            <div className="corp-card-header">
              <h2 className="corp-card-title">Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button onClick={() => toggleFaq(index)} className={`faq-trigger ${openFaq === index ? 'active' : ''}`}>
                    <span className="faq-question-text">{faq.q}</span>
                    <span className="faq-toggle-icon">{openFaq === index ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === index && <div className="faq-content">{faq.a}</div>}
                </div>
              ))}
            </div>

            <div className="interactive-faq-form">
              <h3>Corporate & Operational Inquiries</h3>
              <form onSubmit={handleQuestionSubmit}>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    className="faq-input" 
                    placeholder="Submit an inquiry regarding platform workspace mechanics..." 
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="faq-submit-btn">Submit Inquiry</button>
              </form>
              {feedbackMsg && <div className="faq-feedback">{feedbackMsg}</div>}
            </div>
          </section>
        </main>

        <aside className="corp-sidebar-column">
          
          <section className="corp-card sidebar-stat-card">
            <div className="corp-card-header">
              <h2 className="corp-card-title">Network Metrics</h2>
            </div>
            <p className="about-subtitle">Live ledger simulator metrics loop.</p>
            <div className="simulator-box">
              <div className="sim-metric">
                <span className="sim-number">{testMetric}</span>
                <span className="sim-label">Active Verified Nodes</span>
              </div>
              <button className="sim-btn" onClick={handleSimulateSwap}>
                Execute Mock Handshake
              </button>
            </div>
          </section>

          <section className="corp-card executive-profile-card">
            <div className="corp-card-header">
              <h2 className="corp-card-title">Executive Profile</h2>
            </div>
            <div className="bio-wrapper">
              <div className="bio-avatar">PB</div>
              <div className="bio-details">
                <h3>Paul Andrie Bibit</h3>
                <span className="bio-role">Full Stack Developer</span>
                <p>
                  Paul is a 3rd-year Information Technology student at the Cebu Institute of Technology – University. He designed and engineered <strong>SkillConnect</strong> as a foundational project framework, deploying a frictionless, automated matching platform across student enterprise environments.
                </p>
              </div>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
};

export default AboutUs;