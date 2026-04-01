export const calculateStrength = (password: string): number => {
  let size = 0;

  if (/[a-z]/.test(password)) size += 26; // has lowercase
  if (/[A-Z]/.test(password)) size += 26; // has uppercase
  if (/[0-9]/.test(password)) size += 10; // has numbers
  if (/[^a-zA-Z0-9]/.test(password)) size += 32; // has special chars

  if (size === 0) return 0;

  const score = password.length * Math.log2(size);
  return Math.min(100, score);
};

export const getStrengthLabel = (score: number): string => {
  if (score < 40) return "Weak";
  if (score < 70) return "Fair";
  return "Strong";
};

export const getStrengthColor = (score: number): string => {
  if (score < 40) return "#ef4444"; // red
  if (score < 70) return "#f59e0b"; // amber
  return "#22c55e"; // green
};
