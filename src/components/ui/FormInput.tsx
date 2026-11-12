type FormInputProps = {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  title?: string;
};

/**
 * A form input component that renders a label and an input field. It supports various input types and validation attributes.
 * @param {string} id - The id of the input field.
 * @param {string} label - The label text for the input field.
 * @param {string} type - The type of the input field (e.g., "text", "number").
 * @param {string | number} value - The current value of the input field.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - The change handler for the input field.
 * @param {string} [placeholder] - The placeholder text for the input field.
 * @param {boolean} [required] - Whether the input field is required.
 * @param {number} [min] - The minimum value for the input field.
 * @param {number} [max] - The maximum value for the input field.
 * @param {number} [minLength] - The minimum length for the input field.
 * @param {number} [maxLength] - The maximum length for the input field.
 * @param {string} [pattern] - The pattern for the input field.
 * @param {string} [autocomplete] - The autocomplete attribute for the input field.
 * @param {string} [title] - The title for the input field.
 */
function FormInput({ id, label, type, value, onChange, placeholder, required = false, min, max, minLength, maxLength, pattern, autoComplete, title}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input id={id} type={type} min={min} max={max} minLength={minLength} maxLength={maxLength}
        className="w-full rounded-lg bg-stridex-grey mb-2 px-3 py-2 text-white hover:bg-stridex-black-hover focus:outline-none focus:ring-2 focus:ring-stridex-green-hover"
        placeholder={placeholder} value={value}
        onChange={onChange}
        pattern={pattern}
        autoComplete={autoComplete}
        title={title} />
    </div>
  );
}

export default FormInput;