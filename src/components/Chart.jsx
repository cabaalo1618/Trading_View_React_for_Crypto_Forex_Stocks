import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import { fetchKlines } from "../api/binance";
import { useApp } from "../state/AppContext";
import { useIndicators } from "../state/IndicatorContext";
import { calculateFibonacciLevels } from "../indicators/fibonacci";

export default function Chart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const fibLinesRef = useRef([]);

  const { symbol, timeframe } = useApp();
  const { indicators } = useIndicators();

  // Remove linhas de fib anteriores
  function clearFib() {
    if (!seriesRef.current) return;
    fibLinesRef.current.forEach(line => {
      seriesRef.current.removePriceLine(line);
    });
    fibLinesRef.current = [];
  }

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
      crosshair: { mode: 1 },
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

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

  // Fibonacci
  useEffect(() => {
    if (!seriesRef.current) return;

    clearFib();

    const fib = indicators.fibonacci;
    if (!fib.enabled) return;
    if (fib.high === null || fib.low === null) return;

    const levels = calculateFibonacciLevels(
      fib.high,
      fib.low,
      fib.levels
    );

    levels.forEach(l => {
      const line = seriesRef.current.createPriceLine({
        price: l.price,
        color: fib.color,
        lineWidth: fib.lineWidth,
        lineStyle: fib.lineStyle === "solid" ? 0 : 2,
        axisLabelVisible: true,
        title: `${Math.round(l.level * 100)}%`
      });


      fibLinesRef.current.push(line);
    });

  }, [indicators.fibonacci]);

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
