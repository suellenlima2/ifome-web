import { useMemo } from 'react';
import type { DemandDay } from '@/types';

export function DemandChart({ data = [] }: { data: any }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).data)) return (data as any).data;
    return [];
  }, [data]);

  const max = useMemo(() => {
    if (chartData.length === 0) return 1;
    
    const values = chartData.flatMap((d: any) => [
      d.lunch ?? d.almoco ?? 0, 
      d.dinner ?? d.jantar ?? 0
    ]);
    
    return values.length > 0 ? Math.max(...values) || 1 : 1;
  }, [chartData]);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 160, padding: '8px 0' }}>
      {chartData.map((item: any, index: number) => {
        const lunchValue = item.lunch ?? item.almoco ?? 0;
        const dinnerValue = item.dinner ?? item.jantar ?? 0;
        const label = item.day || item.d || '';

        return (
          <div key={label || index} className="col gap-6" style={{ flex: 1, alignItems: 'center' }}>
            <div className="row gap-4" style={{ alignItems: 'flex-end', height: 130 }}>
              <span 
                style={{ 
                  width: 14, 
                  height: (lunchValue / max) * 130, 
                  background: 'var(--brand)', 
                  borderRadius: '3px 3px 0 0', 
                  minHeight: lunchValue ? 4 : 0 
                }} 
                title={`Almoço: ${lunchValue}`}
              />
              <span 
                style={{ 
                  width: 14, 
                  height: (dinnerValue / max) * 130, 
                  background: 'var(--green-200)', 
                  borderRadius: '3px 3px 0 0', 
                  minHeight: dinnerValue ? 4 : 0 
                }} 
                title={`Jantar: ${dinnerValue}`}
              />
            </div>
            <span className="text-xs muted" style={{ fontWeight: 500 }}>{label}</span>
          </div>
        );
      })}

      {chartData.length === 0 && (
        <span className="text-xs muted text-center flex-1" style={{ paddingBottom: 60 }}>
          Nenhum dado de demanda registrado nos últimos 7 dias.
        </span>
      )}
    </div>
  );
}