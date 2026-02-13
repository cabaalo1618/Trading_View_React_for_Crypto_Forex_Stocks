import { useApp } from "../state/AppContext";
import SymbolSelect from "./SymbolSelect";
import IndicatorsPanel from "./IndicatorPanel";

export default function Controls() {
  const { market, setMarket, symbol, setSymbol, timeframe, setTimeframe } = useApp();

  return (
    <div style={{
      display: "flex",
      background: "#111",
      color: "#fff",
      borderBottom: "1px solid #333",
      flexWrap: "wrap",
      gap: "1rem",
      padding: "1rem",
      alignItems: "center"
    }}>

      {/* MARKET */}
      <select value={market} onChange={e => setMarket(e.target.value)}>
        <option value="crypto">Crypto</option>
        <option value="forex">Forex</option>
        <option value="stocks">Stocks</option>
      </select>

      {/* SYMBOL */}
      <SymbolSelect />

      {/* TIMEFRAME */}
      <select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
        <option value="1m">1m</option>
        <option value="5m">5m</option>
        <option value="15m">15m</option>
        <option value="1h">1h</option>
        <option value="4h">4h</option>
        <option value="1d">1D</option>
      </select>

      {/* INDICATORS */}
      <IndicatorsPanel />

    </div>
  );
}
