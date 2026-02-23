// binance.js

const BASE_URL = "https://api.binance.com/api/v3";

async function safeFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Timeout: requisição demorou demais");
    }

    throw new Error(err.message || "Erro desconhecido na API");
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

  return data.map(candle => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4])
  }));
}
