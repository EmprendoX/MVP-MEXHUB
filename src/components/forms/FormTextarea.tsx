'use client';

import { forwardRef } from 'react';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    label, 
    name, 
    placeholder, 
    value, 
    onChange, 
    required = false, 
    disabled = false,
    error,
    helpText,
    rows = 4,
    maxLength,
    className = ''
  }, ref) => {
    const remainingChars = maxLength ? maxLength - value.length : null;

    return (
      <div className={`space-y-2 ${className}`}>
        <label htmlFor={name} className="block text-text-light font-medium text-sm">
          {label}
          {required && <span className="text-alert ml-1">*</span>}
        </label>
        
        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`textarea-field ${error ? 'border-alert focus:ring-alert' : ''}`}
        />
        
        <div className="flex justify-between items-center">
          {error && (
            <p className="text-alert text-xs">{error}</p>
          )}
          
          {helpText && !error && (
            <p className="text-text-soft text-xs">{helpText}</p>
          )}
          
          {maxLength && (
            <p className={`text-xs ml-auto ${
              remainingChars && remainingChars < 50 ? 'text-alert' : 'text-text-soft'
            }`}>
              {remainingChars} caracteres restantes
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
