interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && !error && <span className="text-xs muted">{hint}</span>}
      {error && <span className="text-xs" style={{ color: 'var(--error)' }}>{error}</span>}
    </div>
  );
}
