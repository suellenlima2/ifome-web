import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import type { RecentConfirmation } from '@/types';

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
          {confirmations.map(r => (
            <tr key={r.id}>
              <td>
                <div className="row gap-12">
                  <Avatar name={r.name} size="sm" />
                  <span className="weight-600">{r.name}</span>
                </div>
              </td>
              <td className="mono muted">{r.mat}</td>
              <td>{r.meal}</td>
              <td><Tag tone={r.type === 'Adaptada' ? 'purple' : 'gray'}>{r.type}</Tag></td>
              <td className="mono muted">{r.at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
