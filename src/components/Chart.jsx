import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import { fetchKlines } from "../api/binance";
import { useApp } from "../state/AppContext";



export default function Chart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const { symbol, timeframe } = useApp();

  // Criação do gráfico
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#0b0e11" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "rgba(42,46,57,0.3)" },
        horzLines: { color: "rgba(42,46,57,0.3)" },
      },
      crosshair: {
        mode: 1,
      },
    });

    // Série de candles (API NOVA)
    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Resize automático
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chartRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current.remove();
    };
  }, []);

  // Atualiza candles 
  useEffect(() => {
    if (!seriesRef.current) return;

    fetchKlines(symbol, timeframe).then(data => {
      seriesRef.current.setData(data);
    });
  }, [symbol, timeframe]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
      }}
    />
  );
}

