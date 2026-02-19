// controllers/market.controller.js

import { fetchKlines } from "../services/binance.service.js";

export async function getKlines(req, res) {
    console.log("Chamou rota klines");
  try {
    const { symbol, interval, limit } = req.query;

    if (!symbol || !interval) {
      return res.status(400).json({
        error: "Parâmetros 'symbol' e 'interval' são obrigatórios",
      });
    }

    const klines = await fetchKlines(symbol, interval, limit);

    res.json(klines);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar klines",
    });
  }
}
