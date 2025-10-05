'use client';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

const FormRadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  required = false,
  error,
  helpText,
  className = ''
}: FormRadioGroupProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <fieldset>
        <legend className="block text-text-light font-medium text-sm">
          {label}
          {required && <span className="text-alert ml-1">*</span>}
        </legend>
        
        <div className="space-y-3 mt-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={option.disabled}
                className="mt-1 h-4 w-4 text-primary border-gray-light focus:ring-primary"
              />
              <div className="flex-1">
                <label 
                  htmlFor={`${name}-${option.value}`}
                  className={`text-sm font-medium cursor-pointer ${
                    option.disabled ? 'text-text-soft' : 'text-text-light'
                  }`}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-text-soft text-xs mt-1">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      
      {error && (
        <p className="text-alert text-xs">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-text-soft text-xs">{helpText}</p>
      )}
    </div>
  );
};

export default FormRadioGroup;
