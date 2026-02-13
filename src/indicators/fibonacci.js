export function calculateFibonacciLevels(high, low, levels) {
  if (high === null || low === null) return [];

  const range = high - low;

  return levels.map(level => ({
    level,
    price: high - range * level
  }));
}
