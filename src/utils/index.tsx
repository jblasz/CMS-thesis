export function formatDate(date: Date, withHourMinute = false) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    ...(withHourMinute ? {
      hour: '2-digit',
      minute: '2-digit',
    } : {}),
  }).format(date);
}
