export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>← Prev</button>
      {start > 1 && <><button className="page-btn" onClick={() => onChange(1)}>1</button><span style={{color:'var(--text-muted)'}}>…</span></>}
      {pages.map(p => (
        <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      {end < totalPages && <><span style={{color:'var(--text-muted)'}}>…</span><button className="page-btn" onClick={() => onChange(totalPages)}>{totalPages}</button></>}
      <button className="page-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages}>Next →</button>
    </div>
  )
}
