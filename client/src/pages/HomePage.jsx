import './HomePage.css'
import { useState } from 'react';
import { getRepo } from '../services/auth.api';
import { Link, useNavigate } from 'react-router-dom';
function HomePage() {

  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    try {
      setLoading(true);
      const response = await getRepo(repo);
      const id = response.audit._id;
      
      // Save ID to localStorage for history tracking
      const history = JSON.parse(localStorage.getItem('audit_history') || '[]');
      if (!history.includes(id)) {
        history.push(id);
        localStorage.setItem('audit_history', JSON.stringify(history));
      }

      setLoading(false);
      navigate(`/report/${id}`);
    } catch (err) {
      setLoading(false);
      console.error("Error submitting audit:", err);
    }
  }




  return (

    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow" />
        <h1 className="hero-title">
          AI Code <span className="hero-gradient">Auditor</span>
        </h1>
        <p className="hero-subtitle">
          Analyze your GitHub repositories with AI-powered insights for
          security, architecture, performance, and documentation.
        </p>

        <div className="hero-input-group">
          <div className="hero-input-wrapper">
            <span className="hero-input-icon">🔗</span>
            <input onChange={(e) => setRepo(e.target.value)}
              type="text"
              className="hero-input"
              placeholder="Enter GitHub repository URL..."
              id="repo-url-input"
            />
          </div>
          <button className="hero-btn" id="audit-btn" onClick={handlesubmit}>
            Audit Repository
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon feature-icon-security">🛡️</div>
          <h3 className="feature-title">Security Analysis</h3>
          <p className="feature-desc">
            Identify vulnerabilities, insecure patterns, and OWASP Top 10 risks
            in your codebase.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-architecture">🏗️</div>
          <h3 className="feature-title">Architecture Review</h3>
          <p className="feature-desc">
            Evaluate code structure, modularity, separation of concerns, and
            design patterns.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-performance">⚡</div>
          <h3 className="feature-title">Performance Audit</h3>
          <p className="feature-desc">
            Detect bottlenecks, inefficient algorithms, and scalability issues
            in your code.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-docs">📄</div>
          <h3 className="feature-title">Documentation Check</h3>
          <p className="feature-desc">
            Assess README quality, code comments, API docs, and developer
            onboarding experience.
          </p>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="loading-section" id="loading-section">
          <div className="loading-card">
            <div className="loading-spinner" />
            <h3 className="loading-title">Analyzing Repository...</h3>
            <p className="loading-subtitle">
              Our AI agents are reviewing your code. This will take just 5-10 seconds.
            </p>
            <div className="loading-steps">
              <div className="loading-step completed">
                <span className="step-dot" />
                <span>Fetching repository files</span>
              </div>
              <div className="loading-step active">
                <span className="step-dot" />
                <span>Running AI analysis</span>
              </div>
              <div className="loading-step">
                <span className="step-dot" />
                <span>Generating report</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
