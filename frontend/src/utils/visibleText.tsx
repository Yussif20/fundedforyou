export const visibleText = (
  isArabic: boolean,
  enText?: string,
  arText?: string
) => {
  const visibleText =
    enText && arText
      ? isArabic
        ? arText
        : enText
      : enText
      ? enText
      : arText || "-";
  return visibleText;
};
