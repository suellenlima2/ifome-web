import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar'
};

export function ConfirmationTable({ confirmations }: { confirmations: any[] }) {
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
          {confirmations.map(r => (
            <tr key={r.id}>
              <td>
                <div className="row gap-12">
                  <Avatar name={r.studentName} size="sm" />
                  <span className="weight-600">{r.studentName}</span>
                </div>
              </td>
              <td className="mono muted">{r.studentId}</td>
              <td>{MEAL_LABELS[r.period] || r.period}</td>
              <td>
                <Tag tone={r.type === 'adapted' ? 'purple' : 'gray'}>
                  {r.type === 'adapted' ? 'Adaptada' : 'Padrão'}
                </Tag>
              </td>
              <td className="mono muted">{r.confirmedAt}</td>
            </tr>
          ))}
          {confirmations.length === 0 && (
            <tr>
              <td colSpan={5} className="muted text-center" style={{ padding: 16 }}>
                Nenhuma confirmação recente realizada hoje.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}