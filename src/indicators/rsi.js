export function calculateRSI(candles, period = 14) {
  let gains = [];
  let losses = [];
  let rsi = [];

  for (let i = 1; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = period; i < gains.length; i++) {
    const avgGain =
      gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const avgLoss =
      losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const value = 100 - 100 / (1 + rs);

    rsi.push({
      time: candles[i + 1].time,
      value
    });
  }

  return rsi;
}
