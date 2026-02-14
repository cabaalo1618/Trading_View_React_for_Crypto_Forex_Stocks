export function calculateMA(candles, period) {
  const result = [];

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;

    for (let j = 0; j < period; j++) {
      sum += candles[i - j].close;
    }

    const ma = sum / period;

    result.push({
      time: candles[i].time,
      value: ma
    });
  }

  return result;
}
