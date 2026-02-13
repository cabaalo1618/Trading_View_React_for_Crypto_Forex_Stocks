import { useEffect, useState } from "react";
import { getBinanceSymbols } from "../api/binance";
import { useApp } from "../state/AppContext";

export default function SymbolSelect() {
  const { symbol, setSymbol } = useApp();
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    getBinanceSymbols().then(setSymbols);
  }, []);

  return (
    <select
      value={symbol}
      onChange={e => setSymbol(e.target.value)}
      style={styles.select}
    >
      {symbols.map(s => (
        <option key={s.symbol} value={s.symbol}>
          {s.base}/{s.quote}
        </option>
      ))}
    </select>
  );
}

const styles = {
  select: {
    background: "#0b0e11",
    color: "#fff",
    border: "1px solid #333",
    padding: "0.6rem",
    borderRadius: "6px",
    minWidth: "12rem",
    cursor: "pointer"
  }
};

