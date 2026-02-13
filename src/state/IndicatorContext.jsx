import { createContext, useContext, useState } from "react";

const IndicatorContext = createContext();

export function IndicatorProvider({ children }) {
  const [indicators, setIndicators] = useState({
    rsi: {
      enabled: false,
      period: 14,
      color: "#f5c542",
      pane: "separate"
    },
    ema: {
      enabled: false,
      period: 20,
      color: "#00ffcc",
      pane: "overlay"
    },
    bollinger: {
      enabled: false,
      period: 20,
      stdDev: 2,
      color: "#8884d8",
      pane: "overlay"
    },
fibonacci: {
  enabled: false,
  mode: "manual",
  high: null,
  low: null,
  levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
  color: "#f5b642",
  lineStyle: "dashed",
  lineWidth: 1
}


  });

  function updateIndicator(name, newConfig) {
    setIndicators(prev => ({
      ...prev,
      [name]: { ...prev[name], ...newConfig }
    }));
  }

  return (
    <IndicatorContext.Provider value={{ indicators, updateIndicator }}>
      {children}
    </IndicatorContext.Provider>
  );
}

export function useIndicators() {
  return useContext(IndicatorContext);
}
