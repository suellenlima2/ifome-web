import { useMemo } from 'react';
import type { DemandDay } from '@/types';

export function DemandChart({ data }: { data: DemandDay[] }) {
  const max = useMemo(() => Math.max(...data.flatMap(d => [d.almoco, d.jantar])) || 1, [data]);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 160, padding: '8px 0' }}>
      {data.map(d => (
        <div key={d.d} className="col gap-6" style={{ flex: 1, alignItems: 'center' }}>
          <div className="row gap-4" style={{ alignItems: 'flex-end', height: 130 }}>
            <span style={{ width: 14, height: (d.almoco / max) * 130, background: 'var(--brand)', borderRadius: '3px 3px 0 0', minHeight: d.almoco ? 4 : 0 }} />
            <span style={{ width: 14, height: (d.jantar / max) * 130, background: 'var(--green-200)', borderRadius: '3px 3px 0 0', minHeight: d.jantar ? 4 : 0 }} />
          </div>
          <span className="text-xs muted" style={{ fontWeight: 500 }}>{d.d}</span>
        </div>
      ))}
    </div>
  );
}
