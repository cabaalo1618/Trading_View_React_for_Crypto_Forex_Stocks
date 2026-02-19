// services/binance.service.js

const BASE_URL = "https://api.binance.com/api/v3/klines";

export async function fetchKlines(symbol, interval, limit = 100) {
  try {
    const url = `${BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da Binance");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erro no Binance Service:", error.message);
    throw error;
  }
}

