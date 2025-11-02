// Date formatting utilities to prevent hydration mismatches

export function formatDate(dateString: string): string {
  // Use a consistent format that works on both server and client
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${month}/${day}/${year}`;
}

export function formatDateLong(dateString: string): string {
  // Use a consistent format for longer dates
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export function formatDateShort(dateString: string): string {
  // Simple format for display
  return dateString; // Since our dates are already in YYYY-MM-DD format
}