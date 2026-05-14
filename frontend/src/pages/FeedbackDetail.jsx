import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import StarRating from '../components/StarRating'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [alert, setAlert] = useState(null)

  useEffect(() => {
    feedbackService.getById(id)
      .then(r => { setFeedback(r.data); setEditForm(r.data) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(f => ({ ...f, [name]: value }))
    if (editErrors[name]) setEditErrors(e => ({ ...e, [name]: '' }))
  }

  const validateEdit = () => {
    const e = {}
    if (!editForm.participant_name?.trim()) e.participant_name = 'Required'
    if (!editForm.program_name?.trim()) e.program_name = 'Required'
    if (!editForm.rating) e.rating = 'Required'
    return e
  }

  const handleSave = async () => {
    const errs = validateEdit()
    if (Object.keys(errs).length) { setEditErrors(errs); return }
    setSaving(true)
    try {
      const res = await feedbackService.update(id, {
        participant_name: editForm.participant_name,
        program_name: editForm.program_name,
        rating: Number(editForm.rating),
        comments: editForm.comments || null,
      })
      setFeedback(res.data)
      setEditOpen(false)
      setAlert({ type: 'success', msg: 'Feedback updated successfully.' })
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await feedbackService.remove(id)
      navigate('/feedback', { state: { deleted: true } })
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
      setDeleteOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (error) return <div className="alert alert-error">⚠ {error}</div>

  return (
    <div>
      <Link to="/feedback" className="back-link">← Back to All Feedback</Link>

      <div className="page-header">
        <h1>Feedback Details</h1>
        <p>Submission #{feedback.feedback_id}</p>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="card">
        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">Participant Name</span>
            <span className="detail-value" style={{ fontWeight: 600 }}>{feedback.participant_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Program / Event</span>
            <span className="detail-value">{feedback.program_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Rating</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StarRating value={feedback.rating} readonly />
              <span className={`badge badge-${feedback.rating}`}>{RATING_LABELS[feedback.rating]}</span>
            </div>
          </div>
          <div className="detail-field">
            <span className="detail-label">Submitted At</span>
            <span className="detail-value">
              {new Date(feedback.submitted_at).toLocaleString()}
            </span>
          </div>
          <div className="detail-field full">
            <span className="detail-label">Comments</span>
            <span className="detail-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {feedback.comments || <em style={{ color: 'var(--text-muted)' }}>No comments provided.</em>}
            </span>
          </div>
        </div>

        <div className="action-bar">
          <button className="btn btn-primary" onClick={() => { setEditForm(feedback); setEditErrors({}); setEditOpen(true) }}>
            ✏ Edit
          </button>
          <button className="btn btn-danger" onClick={() => setDeleteOpen(true)}>
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Feedback</h3>
              <button className="modal-close" onClick={() => setEditOpen(false)}>×</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Participant Name *</label>
                <input name="participant_name" value={editForm.participant_name || ''} onChange={handleEditChange} className={editErrors.participant_name ? 'error' : ''} />
                {editErrors.participant_name && <span className="field-error">{editErrors.participant_name}</span>}
              </div>
              <div className="form-group">
                <label>Program / Event *</label>
                <input name="program_name" value={editForm.program_name || ''} onChange={handleEditChange} className={editErrors.program_name ? 'error' : ''} />
                {editErrors.program_name && <span className="field-error">{editErrors.program_name}</span>}
              </div>
              <div className="form-group full">
                <label>Rating *</label>
                <StarRating value={Number(editForm.rating)} onChange={v => { setEditForm(f => ({ ...f, rating: v })); if (editErrors.rating) setEditErrors(e => ({ ...e, rating: '' })) }} />
                {editErrors.rating && <span className="field-error">{editErrors.rating}</span>}
              </div>
              <div className="form-group full">
                <label>Comments</label>
                <textarea name="comments" value={editForm.comments || ''} onChange={handleEditChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="modal-overlay" onClick={() => setDeleteOpen(false)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteOpen(false)}>×</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Are you sure you want to delete feedback from <strong>{feedback.participant_name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Yes, Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
