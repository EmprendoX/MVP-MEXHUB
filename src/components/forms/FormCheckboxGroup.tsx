'use client';

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface FormCheckboxGroupProps {
  label: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: CheckboxOption[];
  required?: boolean;
  error?: string;
  helpText?: string;
  maxSelections?: number;
  className?: string;
}

const FormCheckboxGroup = ({ 
  label, 
  name, 
  values, 
  onChange, 
  options,
  required = false,
  error,
  helpText,
  maxSelections,
  className = ''
}: FormCheckboxGroupProps) => {
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (maxSelections && values.length >= maxSelections) {
        return; // Don't add if max selections reached
      }
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter(v => v !== optionValue));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <fieldset>
        <legend className="block text-text-light font-medium text-sm">
          {label}
          {required && <span className="text-alert ml-1">*</span>}
          {maxSelections && (
            <span className="text-text-soft text-xs ml-2">
              (Máximo {maxSelections} opciones)
            </span>
          )}
        </legend>
        
        <div className="space-y-3 mt-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="checkbox"
                value={option.value}
                checked={values.includes(option.value)}
                onChange={(e) => handleOptionChange(option.value, e.target.checked)}
                disabled={option.disabled || (!!maxSelections && values.length >= maxSelections && !values.includes(option.value))}
                className="mt-1 h-4 w-4 text-primary border-gray-light rounded focus:ring-primary"
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

export default FormCheckboxGroup;
