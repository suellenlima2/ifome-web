import { forwardRef } from 'react';
import { type LucideIcon } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onTrailingIconClick?: () => void;
  trailingIconAriaLabel?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ icon: Icon, trailingIcon: TrailingIcon, onTrailingIconClick, trailingIconAriaLabel, className, ...rest }, ref) => {
    if (Icon || TrailingIcon) {
      return (
        <div className="input row gap-8" style={{ padding: '0 12px', height: 40 }}>
          {Icon && <Icon size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
          <input
            ref={ref}
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 14, color: 'var(--text)', height: '100%' }}
            {...rest}
          />
          {TrailingIcon && (
            <button
              type="button"
              onClick={onTrailingIconClick}
              aria-label={trailingIconAriaLabel}
              tabIndex={-1}
              style={{ 
                padding: 4, 
                marginRight: -4,
                background: 'none', 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: onTrailingIconClick ? 'pointer' : 'default',
                color: 'var(--text-3)',
                borderRadius: 'var(--r-sm)',
                transition: 'background .1s ease, color .1s ease'
              }}
              className="trailing-icon-btn"
            >
              <TrailingIcon size={16} />
            </button>
          )}
        </div>
      );
    }
    return <input ref={ref} className={`input ${className ?? ''}`} {...rest} />;
  }
);

TextInput.displayName = 'TextInput';
