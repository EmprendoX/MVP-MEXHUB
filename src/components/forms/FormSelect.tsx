'use client';

import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ 
    label, 
    name, 
    value, 
    onChange, 
    options,
    placeholder = 'Selecciona una opción',
    required = false, 
    disabled = false,
    error,
    helpText,
    className = ''
  }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <label htmlFor={name} className="block text-text-light font-medium text-sm">
          {label}
          {required && <span className="text-alert ml-1">*</span>}
        </label>
        
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`select-field ${error ? 'border-alert focus:ring-alert' : ''}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-alert text-xs">{error}</p>
        )}
        
        {helpText && !error && (
          <p className="text-text-soft text-xs">{helpText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
