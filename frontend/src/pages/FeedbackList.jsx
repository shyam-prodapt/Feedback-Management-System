import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import StarRating from '../components/StarRating'
import Pagination from '../components/Pagination'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function FeedbackList() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, page_size: 10 })
  const [filters, setFilters] = useState({ rating: '', program_name: '' })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, page_size: 10 }
    if (filters.rating) params.rating = filters.rating
    if (filters.program_name) params.program_name = filters.program_name

    feedbackService.getAll(params)
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [page, filters])

  useEffect(() => { load() }, [load])

  const applyFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }))
    setPage(1)
  }

  const totalPages = Math.ceil(data.total / data.page_size)

  return (
    <div>
      <div className="page-header">
        <h1>All Feedback</h1>
        <p>{data.total} total record{data.total !== 1 ? 's' : ''}</p>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="form-group" style={{ margin: 0 }}>
            <label>Filter by Rating</label>
            <select value={filters.rating} onChange={e => applyFilter('rating', e.target.value)} style={{ minWidth: 140 }}>
              <option value="">All Ratings</option>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★ — {RATING_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: 1 }}>
            <label>Filter by Program</label>
            <input
              placeholder="Program / Event name…"
              value={filters.program_name}
              onChange={e => applyFilter('program_name', e.target.value)}
            />
          </div>
          {(filters.rating || filters.program_name) && (
            <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }}
              onClick={() => { setFilters({ rating: '', program_name: '' }); setPage(1) }}>
              ✕ Clear
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {loading ? <div className="spinner" /> : data.data.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>No feedback found for the selected filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Participant</th>
                    <th>Program / Event</th>
                    <th>Rating</th>
                    <th>Comments</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(f => (
                    <tr key={f.feedback_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/feedback/${f.feedback_id}`)}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.feedback_id}</td>
                      <td style={{ fontWeight: 600 }}>{f.participant_name}</td>
                      <td>{f.program_name}</td>
                      <td>
                        <span className={`badge badge-${f.rating}`}>
                          {'★'.repeat(f.rating)} {RATING_LABELS[f.rating]}
                        </span>
                      </td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 13 }}>
                        {f.comments || '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {new Date(f.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
