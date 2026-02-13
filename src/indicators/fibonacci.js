export function calculateFibonacciLevels(high, low, levels) {
  const range = high - low;

  return levels.map(level => ({
    level,
    price: high - range * level
  }));
}
