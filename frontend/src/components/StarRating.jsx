export default function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className={`stars${size === 'sm' ? ' stars-sm' : ''}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`star${value >= n ? ' filled' : ''}${readonly ? ' readonly' : ''}`}
            onClick={() => !readonly && onChange && onChange(n)}
            title={labels[n]}
          >
            ★
          </span>
        ))}
      </div>
      {!readonly && value > 0 && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{labels[value]}</span>
      )}
    </div>
  )
}
