import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import type { RecentConfirmation } from '@/types';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
};

export function ConfirmationTable({ confirmations }: { confirmations: RecentConfirmation[] }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Matrícula</th>
            <th>Refeição</th>
            <th>Tipo</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {confirmations.map(r => {
            const name = r.userName ?? (r as any).studentName ?? '—';
            const enrollment = r.userEnrollment ?? (r as any).studentId ?? '—';
            const confirmedAt = r.confirmedAt
              ? r.confirmedAt.includes('T')
                ? r.confirmedAt.split('T')[1].substring(0, 5)
                : r.confirmedAt
              : '—';

            return (
              <tr key={r.id}>
                <td>
                  <div className="row gap-12">
                    <Avatar name={name} size="sm" />
                    <span className="weight-600">{name}</span>
                  </div>
                </td>
                <td className="mono muted">{enrollment}</td>
                <td>{MEAL_LABELS[r.mealPeriod] ?? (r as any).period ?? '—'}</td>
                <td>
                  <Tag tone={r.type === 'adapted' ? 'purple' : 'gray'}>
                    {r.type === 'adapted' ? 'Adaptada' : 'Padrão'}
                  </Tag>
                </td>
                <td className="mono muted">{confirmedAt}</td>
              </tr>
            );
          })}
          {confirmations.length === 0 && (
            <tr>
              <td colSpan={5} className="muted text-center" style={{ padding: 16 }}>
                Nenhuma confirmação recente registrada hoje.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
