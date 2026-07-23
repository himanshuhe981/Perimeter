// Always pass an explicit locale/timeZone so server and client render the
// exact same string — omitting them uses the OS/browser's locale, which
// differs between the server and a visitor's browser and causes React
// hydration mismatches.
const LOCALE = "en-US";

export function formatDateTime(date: Date): string {
  return date.toLocaleString(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
  });
}
