import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  icon: Icon = null,
  options = [], // for select dropdown
  rows = 4, // for textarea
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon (left side) */}
        {Icon && !isTextarea && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Textarea */}
        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
              Icon ? 'pl-10' : ''
            }`}
          />
        ) : isSelect ? (
          /* Select Dropdown */
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`input-field appearance-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
              Icon ? 'pl-10' : ''
            }`}
          >
            <option value="" disabled>
              {placeholder || 'Select an option'}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          /* Regular Input */
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
              Icon ? 'pl-10' : ''
            } ${isPassword ? 'pr-10' : ''}`}
          />
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputField;