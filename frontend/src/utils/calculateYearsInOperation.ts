export const calculateYearsInOperation = (dateEstablished: string) => {
  const today = new Date();
  const establishedDate = new Date(dateEstablished);

  const getHalfYearStart = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    return new Date(year, month < 6 ? 0 : 6, 1); // Jan 1 or Jul 1
  };

  const startEstablished = getHalfYearStart(establishedDate);
  const startToday = getHalfYearStart(today);

  const diffInMs = startToday.getTime() - startEstablished.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  const yearsInOperation = Math.round((diffInDays / 365) * 2) / 2;
  return Number(yearsInOperation.toFixed(1));
};
