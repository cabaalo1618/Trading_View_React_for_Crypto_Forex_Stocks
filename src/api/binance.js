export async function getBinanceSymbols() {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data = await res.json();

  return data.symbols
    .filter(s => s.status === "TRADING")
    .map(s => ({
      symbol: s.symbol,
      base: s.baseAsset,
      quote: s.quoteAsset
    }));
}

export async function fetchKlines(symbol, interval) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`;

  const res = await fetch(url);
  const data = await res.json();

  return data.map(candle => ({
    time: candle[0] / 1000,        // timestamp em segundos
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4])
  }));
}
