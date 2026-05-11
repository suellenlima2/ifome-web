interface DonutProps {
  value: number;
  max: number;
  size?: number;
  sublabel?: string;
}

export function Donut({ value, max, size = 120, sublabel }: DonutProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--gray-100)" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="var(--brand)" strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .4s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="mono" style={{ fontSize: size > 100 ? 22 : 16, fontWeight: 700 }}>
          {Math.round(pct * 100)}%
        </span>
        {sublabel && <span className="text-xs muted">{sublabel}</span>}
      </div>
    </div>
  );
}
