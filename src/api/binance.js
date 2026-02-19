const BASE_URL = "https://api.binance.com/api/v3";

async function safeFetch(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Erro na requisição Binance:", err.message);
    return null;
  }
}

export async function getBinanceSymbols() {
  const data = await safeFetch(`${BASE_URL}/exchangeInfo`);
  if (!data) return [];

  return data.symbols
    .filter(s => s.status === "TRADING")
    .map(s => ({
      symbol: s.symbol,
      base: s.baseAsset,
      quote: s.quoteAsset
    }));
}

export async function fetchKlines(symbol, interval) {
  const data = await safeFetch(
    `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=500`
  );

  if (!data) return [];

  return data.map(candle => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4])
  }));
}
