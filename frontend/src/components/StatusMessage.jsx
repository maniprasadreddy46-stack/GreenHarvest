export function Loading({ label = "Loading…" }) {
  return (
    <div className="status" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="status status--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="status status--empty">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
