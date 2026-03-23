export function formatISOToCustom(isoDate: string): string {
  const date: Date = new Date(isoDate);

  // Get components
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day: string = String(date.getDate()).padStart(2, "0");
  const hours: string = String(date.getHours()).padStart(2, "0");
  const minutes: string = String(date.getMinutes()).padStart(2, "0");

  // Format as YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
