import { cn } from '@/utils/cn';

interface ToggleProps {
  on: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
}

export function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <div className={cn('toggle', on && 'toggle--on')} onClick={() => onChange?.(!on)}>
      <span className="toggle__track">
        <span className="toggle__thumb" />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
