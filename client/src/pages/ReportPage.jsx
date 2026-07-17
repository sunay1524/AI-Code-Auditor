import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing'
import { fetchRepobyId } from '../services/auth.api';
import './ReportPage.css'

function ReportPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        setLoading(true);
        const data = await fetchRepobyId(id);
        if (data && data.result) {
          // Flatten the response so we merge repoName with the result fields (scores, etc.)
          setReport({
            repoName: data.repoName,
            ...data.result
          });
        }
      } catch (error) {
        console.error("Error loading report:", error);
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, [id]);

  if (loading) return <div className="report-page">Loading...</div>;
  if (!report) return <div className="report-page">Report not found.</div>;

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header">
        <div className="report-header-left">
          <span className="report-repo-badge">📦 {report.repoName}</span>
          <h1 className="report-title">Audit Report</h1>
          <p className="report-summary">{report.summary}</p>
        </div>
        <div className="report-header-right">
          <ScoreRing score={report.overallScore} size={120} label="Overall Score" />
        </div>
      </div>

      {/* Score Overview */}
      <div className="report-scores">
        <ScoreRing score={report.security?.score} size={80} label="Security" />
        <ScoreRing score={report.architecture?.score} size={80} label="Architecture" />
        <ScoreRing score={report.performance?.score} size={80} label="Performance" />
        <ScoreRing score={report.documentation?.score} size={80} label="Documentation" />
      </div>

      {/* Executive Key Findings */}
      <div className="report-executive-summary">
        {report.strongestAspects?.length > 0 && (
          <div className="summary-section success">
            <h3>🌟 Strongest Aspects</h3>
            <ul>
              {report.strongestAspects.map((aspect, i) => (
                <li key={i}>{aspect}</li>
              ))}
            </ul>
          </div>
        )}

        {report.criticalWeaknesses?.length > 0 && (
          <div className="summary-section danger">
            <h3>⚠️ Critical Weaknesses</h3>
            <ul>
              {report.criticalWeaknesses.map((weakness, i) => (
                <li key={i}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}

        {report.recommendations?.length > 0 && (
          <div className="summary-section warning">
            <h3>💡 Prioritized Recommendations</h3>
            <ul>
              {report.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detail Cards */}
      <div className="report-details">
        {/* Security */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-card-icon">🛡️</span>
            <h2 className="report-card-title">Security Analysis</h2>
            <span className="report-card-score" style={{ color: report.security.score >= 60 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {report.security.score}/100
            </span>
          </div>
          <p className="report-card-summary">{report.security?.summary}</p>
          {report.security?.issues?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">⚠️ Issues</h4>
              <ul className="report-card-list">
                {report.security?.issues?.map((issue, i) => (
                  <li key={i} className="report-card-list-item issue">
                    <strong>[{issue.severity || 'Medium'}]</strong> {issue.title || issue.evidence || issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.security?.recommendations?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">💡 Recommendations</h4>
              <ul className="report-card-list">
                {report.security?.recommendations?.map((rec, i) => (
                  <li key={i} className="report-card-list-item recommendation">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Architecture */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-card-icon">🏗️</span>
            <h2 className="report-card-title">Architecture Review</h2>
            <span className="report-card-score" style={{ color: report.architecture?.score >= 60 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {report.architecture?.score}/100
            </span>
          </div>
          <p className="report-card-summary">{report.architecture?.summary}</p>
          {report.architecture?.strengths?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">✅ Strengths</h4>
              <ul className="report-card-list">
                {report.architecture?.strengths?.map((s, i) => (
                  <li key={i} className="report-card-list-item strength">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {report.architecture?.weaknesses?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">⚠️ Weaknesses</h4>
              <ul className="report-card-list">
                {report.architecture?.weaknesses?.map((w, i) => (
                  <li key={i} className="report-card-list-item issue">{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Performance */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-card-icon">⚡</span>
            <h2 className="report-card-title">Performance Audit</h2>
            <span className="report-card-score" style={{ color: report.performance?.score >= 60 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {report.performance?.score}/100
            </span>
          </div>
          <p className="report-card-summary">{report.performance?.summary}</p>
          {report.performance?.issues?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">⚠️ Issues</h4>
              <ul className="report-card-list">
                {report.performance?.issues?.map((issue, i) => (
                  <li key={i} className="report-card-list-item issue">
                    <strong>[{issue.severity || 'Medium'}]</strong> {issue.title || issue.evidence || issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.performance?.recommendations?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">💡 Recommendations</h4>
              <ul className="report-card-list">
                {report.performance?.recommendations?.map((rec, i) => (
                  <li key={i} className="report-card-list-item recommendation">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-card-icon">📄</span>
            <h2 className="report-card-title">Documentation Check</h2>
            <span className="report-card-score" style={{ color: report.documentation?.score >= 60 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {report.documentation?.score}/100
            </span>
          </div>
          <p className="report-card-summary">{report.documentation?.summary}</p>
          {report.documentation?.issues?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">⚠️ Issues</h4>
              <ul className="report-card-list">
                {report.documentation?.issues?.map((issue, i) => (
                  <li key={i} className="report-card-list-item issue">
                    <strong>[{issue.severity || 'Medium'}]</strong> {issue.title || issue.evidence || issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.documentation?.recommendations?.length > 0 && (
            <div className="report-card-section">
              <h4 className="report-card-section-title">💡 Recommendations</h4>
              <ul className="report-card-list">
                {report.documentation?.recommendations?.map((rec, i) => (
                  <li key={i} className="report-card-list-item recommendation">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportPage
