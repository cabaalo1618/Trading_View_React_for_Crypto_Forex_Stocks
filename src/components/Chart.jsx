import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, LineSeries } from "lightweight-charts";
import { fetchKlines } from "../api/binance";
import { useApp } from "../state/AppContext";
import { useIndicators } from "../state/IndicatorContext";
import { calculateFibonacciLevels } from "../indicators/fibonacci";
import { calculateRSI } from "../indicators/rsi";

export default function Chart() {
  const containerRef = useRef(null);
  const rsiContainerRef = useRef(null);

  const chartRef = useRef(null);
  const rsiChartRef = useRef(null);

  const seriesRef = useRef(null);
  const rsiSeriesRef = useRef(null);

  const fibLinesRef = useRef([]);

  const { symbol, timeframe } = useApp();
  const { indicators } = useIndicators();

  // Remove linhas de Fibonacci antigas
  function clearFib() {
    if (!seriesRef.current) return;
    fibLinesRef.current.forEach(line => {
      seriesRef.current.removePriceLine(line);
    });
    fibLinesRef.current = [];
  }

  // Criação dos gráficos
  useEffect(() => {
    if (!containerRef.current || !rsiContainerRef.current) return;

    // Main chart
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#0b0e11" },
        textColor: "#d1d4dc"
      },
      grid: {
        vertLines: { color: "rgba(42,46,57,0.3)" },
        horzLines: { color: "rgba(42,46,57,0.3)" }
      },
      crosshair: { mode: 1 }
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350"
    });

    // RSI chart
    rsiChartRef.current = createChart(rsiContainerRef.current, {
      width: rsiContainerRef.current.clientWidth,
      height: 150,
      layout: {
        background: { color: "#0b0e11" },
        textColor: "#d1d4dc"
      },
      grid: {
        vertLines: { color: "rgba(42,46,57,0.3)" },
        horzLines: { color: "rgba(42,46,57,0.3)" }
      },
      timeScale: { visible: false }
    });

    rsiSeriesRef.current = rsiChartRef.current.addSeries(LineSeries, {
  color: indicators.rsi.color,
  lineWidth: 2
});

    // Resize
    const resize = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      chartRef.current.applyOptions({ width });
      rsiChartRef.current.applyOptions({ width });
    });

    resize.observe(containerRef.current);

    return () => {
      resize.disconnect();
      chartRef.current.remove();
      rsiChartRef.current.remove();
    };
  }, []);

  // Buscar candles e calcular RSI
  useEffect(() => {
    if (!seriesRef.current || !rsiSeriesRef.current) return;

    fetchKlines(symbol, timeframe).then(data => {
      seriesRef.current.setData(data);

      if (indicators.rsi.enabled) {
        const rsiData = calculateRSI(data, indicators.rsi.period);
        rsiSeriesRef.current.setData(rsiData);
      } else {
        rsiSeriesRef.current.setData([]);
      }
    });
  }, [symbol, timeframe, indicators.rsi.enabled, indicators.rsi.period]);

  // Fibonacci
  useEffect(() => {
    if (!seriesRef.current) return;

    clearFib();

    const fib = indicators.fibonacci;
    if (!fib.enabled || fib.high === null || fib.low === null) return;

    const levels = calculateFibonacciLevels(
      fib.high,
      fib.low,
      fib.levels
    );

    levels.forEach(l => {
      const line = seriesRef.current.createPriceLine({
        price: l.price,
        color: fib.color,
        lineWidth: fib.lineWidth || 1,
        lineStyle: fib.lineStyle === "dashed" ? 2 : 0,
        axisLabelVisible: true,
        title: `${Math.round(l.level * 100)}%`
      });

      fibLinesRef.current.push(line);
    });
  }, [indicators.fibonacci]);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "400px" }} />
      <div ref={rsiContainerRef} style={{ width: "100%", height: "150px" }} />
    </>
  );
}
