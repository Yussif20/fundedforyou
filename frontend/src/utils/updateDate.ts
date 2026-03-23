type UpdateDateInput = {
  date?: string;
  year?: string;
  month?: string;
};

export function updateDate({
  date,
  year,
  month,
}: UpdateDateInput): string | null {
  const currentYear = new Date().getFullYear();
  // If date is NOT available
  if (!date) {
    if (year) {
      return `${year}-01-01`;
    }

    if (month) {
      return `${currentYear}-${month}-01`;
    }

    return null;
  }

  // If date IS available
  let [y, m] = date.split("-");

  if (year) {
    y = year;
  }

  if (month) {
    m = month;
  }

  return `${y}-${m}-01`;
}
