interface BrandMarkProps {
  size?: number;
  sub?: boolean;
  color?: string;
}

export function BrandMark({ size = 28, sub = false, color }: BrandMarkProps) {
  return (
    <div className="row gap-8" style={{ alignItems: 'baseline' }}>
      <span className="brand-mark" style={{ fontSize: size, ...(color && { color }) }}>
        IFome
      </span>
      {sub && (
        <small style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Web
        </small>
      )}
    </div>
  );
}
