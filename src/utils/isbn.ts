const ISBN_FORMAT = /^(?:\d-?)*[\dXx]$/;

export const isValidIsbn = (value: string) => {
  if (!ISBN_FORMAT.test(value)) return false;
  const digits = value.replaceAll("-", "").toUpperCase();

  if (digits.length === 10) {
    const sum = [...digits].reduce(
      (total, char, index) =>
        total + (char === "X" ? 10 : Number(char)) * (10 - index),
      0,
    );
    return sum % 11 === 0;
  }

  if (digits.length === 13) {
    if (digits.includes("X") || !/^97[89]/.test(digits)) return false;
    const sum = [...digits].reduce(
      (total, char, index) => total + Number(char) * (index % 2 ? 3 : 1),
      0,
    );
    return sum % 10 === 0;
  }

  return false;
};
