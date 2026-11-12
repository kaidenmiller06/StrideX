import { toast } from 'react-hot-toast';

/**
 * Shows the first failed native validation as a toast instead of the browser bubble.
 * Attach to a form with onInvalidCapture (invalid events don't bubble).
 */
export function handleInvalid(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  toast.error(input.validationMessage, { id: 'form-invalid' });
  input.focus();
}