import { forwardRef } from 'react';
import { type LucideIcon } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ icon: Icon, className, ...rest }, ref) => {
    if (Icon) {
      return (
        <div className="input row gap-8" style={{ padding: '0 12px', height: 40 }}>
          <Icon size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            ref={ref}
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 14, color: 'var(--text)', height: '100%' }}
            {...rest}
          />
        </div>
      );
    }
    return <input ref={ref} className={`input ${className ?? ''}`} {...rest} />;
  }
);

TextInput.displayName = 'TextInput';
