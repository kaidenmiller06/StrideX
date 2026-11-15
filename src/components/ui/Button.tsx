type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'danger' | 'outline';
};

const variants = {
  default: 'bg-stridex-black hover:bg-stridex-black-hover active:bg-stridex-black-active',
  primary: 'bg-stridex-green hover:bg-stridex-green-hover active:bg-stridex-green-active',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  outline: 'border border-white hover:bg-stridex-lightgrey active:bg-white',
};

function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-3 py-2 text-white rounded-full transition-colors duration-300 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;