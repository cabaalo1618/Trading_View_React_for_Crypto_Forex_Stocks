//chart.jsx

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  CrosshairMode
} from "lightweight-charts";

import { fetchKlines } from "../api/binance";
import { useApp } from "../state/AppContext";
import { useIndicators } from "../state/IndicatorContext";

import { calculateFibonacciLevels } from "../indicators/fibonacci";
import { calculateRSI } from "../indicators/rsi";
import { calculateMA } from "../indicators/movingAverage";

export default function Chart() {

  // REFS

  const containerRef = useRef(null);
  const rsiContainerRef = useRef(null);

  const chartRef = useRef(null);
  const rsiChartRef = useRef(null);

  const candleSeriesRef = useRef(null);
  const rsiSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);

  const fibLinesRef = useRef([]);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  // GLOBAL STATE

  const { symbol, timeframe } = useApp();
  const { indicators } = useIndicators();

  // HELPERS

  function clearFib() {
    if (!candleSeriesRef.current) return;
    fibLinesRef.current.forEach(line =>
      candleSeriesRef.current.removePriceLine(line)
    );
    fibLinesRef.current = [];
  }


  // CREATE CHARTS (RUN ONCE)

  useEffect(() => {
    if (!containerRef.current || !rsiContainerRef.current) return;

    // -------- MAIN PRICE CHART --------
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
      crosshair: {
        mode: CrosshairMode.Normal
      }
    });

    candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350"
    });

    // Moving Average
    maSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: "#ffd54f",
      lineWidth: 2
    });

    // -------- RSI CHART --------
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

    // RSI Levels
    rsiSeriesRef.current.createPriceLine({ price: 70, color: "#ff5252", lineStyle: 2 });
    rsiSeriesRef.current.createPriceLine({ price: 30, color: "#4caf50", lineStyle: 2 });
    rsiSeriesRef.current.createPriceLine({ price: 50, color: "rgba(255,255,255,0.3)" });


    // -------- RESIZE --------
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


  // LOAD DATA + INDICATORS

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchKlines(symbol, timeframe);

        candleSeriesRef.current.setData(data);

       
        // MA
        if (indicators.ma.enabled) {
          maSeriesRef.current.setData(
            calculateMA(data, indicators.ma.period)
          );

          //  Atualiza cor e largura dinamicamente
          maSeriesRef.current.applyOptions({
            color: indicators.ma.color,
            lineWidth: indicators.ma.lineWidth || 2
          });

        } else {
          maSeriesRef.current.setData([]);
        }
        // RSI
        if (indicators.rsi.enabled) {
          rsiSeriesRef.current.setData(
            calculateRSI(data, indicators.rsi.period)
          );

          //  Atualiza cor dinamicamente
          rsiSeriesRef.current.applyOptions({
            color: indicators.rsi.color,
            lineWidth: indicators.rsi.lineWidth || 2
          });

        } else {
          rsiSeriesRef.current.setData([]);
        }

      } catch (err) {
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [symbol, timeframe, indicators]);


  // FIBONACCI

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    clearFib();

    const fib = indicators.fibonacci;
    if (!fib.enabled || fib.high === null || fib.low === null) return;

    const levels = calculateFibonacciLevels(
      fib.high,
      fib.low,
      fib.levels
    );

    levels.forEach(l => {
      const line = candleSeriesRef.current.createPriceLine({
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


  // UI

  // UI

  return (
    <div style={{ position: "relative" }}>

      {/* Rótulo */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "12px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "monospace",
          zIndex: 5,
          pointerEvents: "none"
        }}
      >
        {symbol} · {timeframe}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "400px",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            color: "#fff"
          }}
        >
          <div className="spinner" />
          <p style={{ marginTop: "10px" }}>Carregando dados...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "12px",
            color: "#ff5252",
            zIndex: 6
          }}
        >
          ⚠ {error}
        </div>
      )}

      <div ref={containerRef} style={{ width: "100%", height: "400px" }} />
      <div ref={rsiContainerRef} style={{ width: "100%", height: "150px" }} />
    </div>
  );
}



