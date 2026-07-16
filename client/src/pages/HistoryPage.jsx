import { Link } from 'react-router-dom';
import './HistoryPage.css';
import { useEffect, useState } from 'react';
import { fetchAllRepo } from '../services/auth.api';

function HistoryPage() {
  // State to hold the list of audits and a loading flag
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch audits once when the component mounts
  useEffect(() => {
    const loadAudits = async () => {
      try {
        const localIds = JSON.parse(localStorage.getItem('audit_history') || '[]');
        if (localIds.length === 0) {
          setAudits([]);
          setLoading(false);
          return;
        }
        const data = await fetchAllRepo(localIds); // returns an array or null
        setAudits(data || []);
      } catch (err) {
        console.error('Failed to fetch audits:', err);
        setAudits([]);
      } finally {
        setLoading(false);
      }
    };
    loadAudits();
  }, []);

  // Helper: status badge
  const getStatusBadge = (status) => {
    const map = {
      completed: { label: 'Completed', className: 'badge-completed' },
      pending: { label: 'Pending', className: 'badge-pending' },
      failed: { label: 'Failed', className: 'badge-failed' },
    };
    const badge = map[status] || map.pending;
    return <span className={`status-badge ${badge.className}`}>{badge.label}</span>;
  };

  // Helper: score colour
  const getScoreColor = (score) =>
    score >= 80 ? 'var(--accent-green)' :
    score >= 60 ? 'var(--accent-orange)' :
    'var(--accent-red)';

  // Helper: relative time string
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Loading placeholder
  if (loading) {
    return (
      <div className="history-page">
        <p className="history-loading">Loading audit history…</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1 className="history-title">Audit History</h1>
        <p className="history-subtitle">View all your past repository audits</p>
      </div>

      {audits.length === 0 ? (
        <div className="history-empty">
          <span className="history-empty-icon">📋</span>
          <h3>No audits yet</h3>
          <p>Start by auditing a GitHub repository from the home page.</p>
          <Link to="/" className="history-empty-btn">Audit a Repository</Link>
        </div>
      ) : (
        <div className="history-list">
          {audits.map((audit) => (
            <div key={audit._id} className="history-card">
              <div className="history-card-left">
                <h3 className="history-card-repo">📦 {audit.repoName}</h3>
                <span className="history-card-time">{timeAgo(audit.updatedAt)}</span>
              </div>

              <div className="history-card-center">
                {getStatusBadge(audit.status)}
              </div>

              <div className="history-card-right">
                {audit.status === 'completed' && audit.result ? (
                  <>
                    <span
                      className="history-card-score"
                      style={{ color: getScoreColor(audit.result.overallScore) }}
                    >
                      {audit.result.overallScore}/100
                    </span>
                    <Link to={`/report/${audit._id}`} className="history-card-btn">
                      View Report →
                    </Link>
                  </>
                ) : audit.status === 'failed' ? (
                  <span className="history-card-error">
                    {audit.error || 'Audit failed'}
                  </span>
                ) : (
                  <span className="history-card-pending-text">Processing…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
