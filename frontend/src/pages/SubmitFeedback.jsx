import { useState } from 'react'
import { feedbackService } from '../services/feedbackService'
import StarRating from '../components/StarRating'

const EMPTY = { participant_name: '', program_name: '', rating: 0, comments: '' }

export default function SubmitFeedback() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.participant_name.trim()) e.participant_name = 'Name is required'
    if (!form.program_name.trim()) e.program_name = 'Program name is required'
    if (!form.rating) e.rating = 'Please select a rating'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setStatus(null)
    try {
      await feedbackService.create({ ...form, comments: form.comments || null })
      setStatus({ type: 'success', msg: '🎉 Feedback submitted successfully!' })
      setForm(EMPTY)
      setErrors({})
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Submit Feedback</h1>
        <p>Share your experience with a program or event</p>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        {status && (
          <div className={`alert alert-${status.type}`}>{status.msg}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Participant Name *</label>
              <input
                name="participant_name"
                value={form.participant_name}
                onChange={handleChange}
                placeholder="e.g. Alice Johnson"
                className={errors.participant_name ? 'error' : ''}
              />
              {errors.participant_name && <span className="field-error">{errors.participant_name}</span>}
            </div>

            <div className="form-group">
              <label>Program / Event / Product *</label>
              <input
                name="program_name"
                value={form.program_name}
                onChange={handleChange}
                placeholder="e.g. Python Bootcamp 2025"
                className={errors.program_name ? 'error' : ''}
              />
              {errors.program_name && <span className="field-error">{errors.program_name}</span>}
            </div>

            <div className="form-group full">
              <label>Rating *</label>
              <StarRating
                value={form.rating}
                onChange={(v) => {
                  setForm(f => ({ ...f, rating: v }))
                  if (errors.rating) setErrors(e => ({ ...e, rating: '' }))
                }}
              />
              {errors.rating && <span className="field-error">{errors.rating}</span>}
            </div>

            <div className="form-group full">
              <label>Comments</label>
              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                placeholder="Share your thoughts, suggestions, or observations..."
              />
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting…' : '✓ Submit Feedback'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setForm(EMPTY); setErrors({}); setStatus(null) }}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
