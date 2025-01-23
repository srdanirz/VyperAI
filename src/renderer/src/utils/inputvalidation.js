export const isValidInput = (value, regex) => {
  const pattern = new RegExp(regex);
  return pattern.test(value);
};

