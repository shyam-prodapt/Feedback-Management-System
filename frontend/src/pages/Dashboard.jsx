import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import StarRating from '../components/StarRating'

const RATING_LABELS = { Poor: 1, Fair: 2, Good: 3, 'Very Good': 4, Excellent: 5 }

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    feedbackService.getDashboard()
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />
  if (error) return <div className="alert alert-error">⚠ {error}</div>

  const maxCount = stats.total_feedback || 1

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of all collected feedback</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📝</div>
          <div>
            <div className="stat-value">{stats.total_feedback}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">⭐</div>
          <div>
            <div className="stat-value">{stats.average_rating.toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{stats.rating_distribution?.Excellent ?? 0}</div>
            <div className="stat-label">Excellent Ratings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📈</div>
          <div>
            <div className="stat-value">{stats.recent_feedback.length}</div>
            <div className="stat-label">Recent Entries</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="section-title">Rating Distribution</div>
          <div className="dist-grid">
            {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map(label => {
              const count = stats.rating_distribution?.[label] ?? 0
              return (
                <div className="dist-row" key={label}>
                  <span className="dist-label">{label}</span>
                  <div className="dist-bar-wrap">
                    <div className="dist-bar" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                  <span className="dist-count">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Recent Feedback</div>
          {stats.recent_feedback.length === 0 ? (
            <div className="empty"><p>No feedback yet.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recent_feedback.map(f => (
                <Link key={f.feedback_id} to={`/feedback/${f.feedback_id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{f.participant_name}</span>
                      <StarRating value={f.rating} readonly size="sm" />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{f.program_name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
