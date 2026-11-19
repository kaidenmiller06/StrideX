type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'default' | 'grey' | 'danger' | 'outline';
};

const VARIANTS = {
  default: 'bg-stridex-black hover:bg-stridex-black-hover active:bg-stridex-black-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stridex-green',
  primary: 'bg-stridex-green hover:bg-stridex-green-hover active:bg-stridex-green-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stridex-green',
  grey: 'bg-stridex-grey hover:bg-stridex-grey-hover active:bg-stridex-grey-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500',
  outline: 'border border-stridex-lightgrey hover:bg-stridex-grey-hover active:bg-stridex-grey-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
};

/**
 * A reusable button component that supports different variants, loading state, and disabled state.
 * @param variant - The visual style of the button. Can be 'primary', 'default', 'danger', or 'outline'.
 * @param loading - If true, shows a loading spinner and disables the button.
 * @param disabled - If true, disables the button.
 * @param className - Additional CSS classes to apply to the button.
 * @param children - The content of the button.
 */
function Button({ variant = 'default', loading=false, disabled=false, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`group relative px-4 py-2 text-white rounded-full font-semibold cursor-pointer select-none
        transform-gpu will-change-transform
        transition-all duration-200 motion-reduce:transition-none
        active:scale-95 motion-reduce:active:scale-100
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant]} ${className}`}
    >
      <span className={`transition-opacity duration-150 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading">
          <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </span>
      )}
    </button>
  );
}

export default Button;