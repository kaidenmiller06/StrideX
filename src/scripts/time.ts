import type { Message } from '../types/connection';

/**
 * Formats a timestamp in ISO format to a more readable format.
 * If the timestamp is from today, it returns the time in "HH:MM AM/PM" format.
 * If it's from a different day, it returns the date in "MMM DD" format.
 * @param iso - The timestamp in ISO format.
 * @returns The formatted timestamp as a string.
 */
export function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export const timeGap = (a: Message, b: Message) =>
  Math.abs(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());