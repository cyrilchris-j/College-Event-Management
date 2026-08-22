/**
 * dateFormatter.ts
 * Date / time formatting utilities for CampusConnect.
 */

/**
 * Format: "May 28, 2024"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format: "May 28 – 29, 2024" (multi-day) or "May 28, 2024" (single day)
 */
export function formatEventDateRange(start: string, end?: string): string {
  const startDate = new Date(start);
  if (!end) return formatDate(start);

  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();
  if (sameDay) return formatDate(start);

  const sameMonth = startDate.getMonth() === endDate.getMonth()
    && startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    return `${startDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })} – ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}

/**
 * Format: "10:00 AM"
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
}

/**
 * Format: "10:00 AM – 01:00 PM"
 */
export function formatTimeRange(start: string, end?: string): string {
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/**
 * Format: "Mon, 28 May 2024, 10:00 AM"
 */
export function formatFull(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ', ' + formatTime(isoString);
}

/**
 * Returns "2 days left", "Closed", "1 hour left", etc.
 */
export function getDeadlineLabel(deadlineIso?: string): string {
  if (!deadlineIso) return '';
  const now = new Date();
  const deadline = new Date(deadlineIso);
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) return 'Registration Closed';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Less than 1 hour left';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} left`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} left`;
}

/**
 * Returns "Registered on May 28, 2024"
 */
export function formatRegisteredAt(isoString: string): string {
  return `Registered on ${formatDate(isoString)}`;
}
