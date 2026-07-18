import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  icon: Icon = null,
}) => {
  // Variant styles
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 bg-transparent',
    ghost: 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200',
  };

  // Size styles
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3 px-8 text-lg',
  };

  // Combine classes
  const baseClasses = `${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
  const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${disabledClasses} flex items-center justify-center gap-2`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
