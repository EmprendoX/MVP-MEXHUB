'use client';

import { forwardRef } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
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
        
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`input-field ${error ? 'border-alert focus:ring-alert' : ''}`}
        />
        
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

FormField.displayName = 'FormField';

export default FormField;
