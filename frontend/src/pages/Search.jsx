import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import StarRating from '../components/StarRating'
import Pagination from '../components/Pagination'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function Search() {
  const [filters, setFilters] = useState({ keyword: '', rating: '', min_rating: '', max_rating: '', program_name: '' })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const handleChange = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))

  const search = async (p = 1) => {
    setLoading(true)
    setError('')
    const params = { page: p, page_size: 10 }
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.rating) params.rating = filters.rating
    if (filters.min_rating) params.min_rating = filters.min_rating
    if (filters.max_rating) params.max_rating = filters.max_rating
    if (filters.program_name) params.program_name = filters.program_name

    try {
      const res = await feedbackService.search(params)
      setResults(res.data)
      setPage(p)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFilters({ keyword: '', rating: '', min_rating: '', max_rating: '', program_name: '' })
    setResults(null)
    setPage(1)
  }

  const totalPages = results ? Math.ceil(results.total / results.page_size) : 0

  return (
    <div>
      <div className="page-header">
        <h1>Search & Filter</h1>
        <p>Search feedback by keyword, rating, or program</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-grid">
          <div className="form-group full">
            <label>Keyword</label>
            <input name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Search in names, programs, comments…" onKeyDown={e => e.key === 'Enter' && search(1)} />
          </div>
          <div className="form-group">
            <label>Program / Event</label>
            <input name="program_name" value={filters.program_name} onChange={handleChange} placeholder="e.g. Python Bootcamp" />
          </div>
          <div className="form-group">
            <label>Exact Rating</label>
            <select name="rating" value={filters.rating} onChange={handleChange}>
              <option value="">Any</option>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★ — {RATING_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Min Rating</label>
            <select name="min_rating" value={filters.min_rating} onChange={handleChange} disabled={!!filters.rating}>
              <option value="">—</option>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Max Rating</label>
            <select name="max_rating" value={filters.max_rating} onChange={handleChange} disabled={!!filters.rating}>
              <option value="">—</option>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => search(1)} disabled={loading}>
            {loading ? 'Searching…' : '🔍 Search'}
          </button>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {results && (
        <div className="card">
          <div className="section-title">
            {results.total} result{results.total !== 1 ? 's' : ''} found
          </div>

          {results.data.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>No feedback matched your search criteria.</p>
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
                    {results.data.map(f => (
                      <tr key={f.feedback_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/feedback/${f.feedback_id}`)}>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.feedback_id}</td>
                        <td style={{ fontWeight: 600 }}>{f.participant_name}</td>
                        <td>{f.program_name}</td>
                        <td>
                          <span className={`badge badge-${f.rating}`}>
                            {'★'.repeat(f.rating)} {RATING_LABELS[f.rating]}
                          </span>
                        </td>
                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 13 }}>
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
              <Pagination page={page} totalPages={totalPages} onChange={(p) => search(p)} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
