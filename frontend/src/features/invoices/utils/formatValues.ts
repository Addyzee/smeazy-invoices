export const formatNumber = (num: number, precision: number = 1): string => {
  const absNum = Math.abs(num);

  if (absNum < 10000) {
    return num.toLocaleString();
  }

  const suffixes = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  for (const { value: threshold, suffix } of suffixes) {
    if (absNum >= threshold) {
      const formatted = num / threshold;
      // Round to specified precision and remove unnecessary decimals
      const rounded =
        Math.round(formatted * Math.pow(10, precision)) /
        Math.pow(10, precision);
      return `${rounded}${suffix}`;
    }
  }

  return num.toLocaleString();
};