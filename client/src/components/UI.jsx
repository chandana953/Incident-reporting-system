/**
 * Returns a styled badge element for incident status or priority.
 */
export const StatusBadge = ({ status }) => {
  const statusMap = {
    open: 'badge-open',
    'in-progress': 'badge-in-progress',
    resolved: 'badge-resolved',
    closed: 'badge-closed',
  };
  return (
    <span className={`badge ${statusMap[status] || 'badge-closed'}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const priorityMap = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    critical: 'badge-critical',
  };
  return (
    <span className={`badge ${priorityMap[priority] || 'badge-medium'}`}>
      {priority}
    </span>
  );
};

/**
 * Full-page loading spinner
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{
    minHeight: '60vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'
  }}>
    <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} />
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{message}</p>
  </div>
);

/**
 * Empty state placeholder
 */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div style={{
    textAlign: 'center', padding: '4rem 2rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
  }}>
    {Icon && (
      <div style={{
        width: '80px', height: '80px',
        background: 'rgba(99,102,241,0.1)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '0.5rem'
      }}>
        <Icon size={36} color="#6366f1" strokeWidth={1.5} />
      </div>
    )}
    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h3>
    {description && <p style={{ color: 'var(--color-text-muted)', maxWidth: '360px', lineHeight: 1.6 }}>{description}</p>}
    {action}
  </div>
);

/**
 * Error message box
 */
export const ErrorBox = ({ message }) => (
  <div style={{
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '0.75rem',
    padding: '0.875rem 1.25rem',
    color: '#f87171',
    fontSize: '0.875rem',
    fontWeight: 500
  }}>
    ⚠️ {message}
  </div>
);

/**
 * Format a date to a readable string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/**
 * Capitalize first letter
 */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
