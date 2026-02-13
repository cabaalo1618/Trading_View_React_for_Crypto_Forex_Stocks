import { useIndicators } from "../state/IndicatorContext";
import IndicatorButton from "./IndicatorButton";

export default function IndicatorsPanel() {
  const { indicators, updateIndicator } = useIndicators();
  const fib = indicators.fibonacci;

  return (
    <div
      style={{
        background: "#0f1115",
        borderBottom: "1px solid #222",
        padding: "0.5rem",
        color: "#fff"
      }}
    >
      {/* Botões */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <IndicatorButton name="rsi" label="RSI" />
        <IndicatorButton name="ema" label="EMA" />
        <IndicatorButton name="bollinger" label="Bollinger" />
        <IndicatorButton name="fibonacci" label="Fibonacci" />
      </div>

      {/* CONFIG DO FIBONACCI */}
      <div style={{ borderTop: "1px solid #333", paddingTop: "1rem", marginTop: "1rem" }}>
        <h4>Fibonacci</h4>

        <label>
          <input
            type="checkbox"
            checked={fib.enabled}
            onChange={e => updateIndicator("fibonacci", { enabled: e.target.checked })}
          />
          Ativar
        </label>

        <div style={{ marginTop: "0.5rem" }}>
          <label>
            <input
              type="radio"
              checked={fib.mode === "manual"}
              onChange={() => updateIndicator("fibonacci", { mode: "manual" })}
            />
            Manual
          </label>

          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              checked={fib.mode === "draw"}
              onChange={() => updateIndicator("fibonacci", { mode: "draw" })}
            />
            Desenhar
          </label>
        </div>

        {fib.mode === "manual" && (
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <input
              placeholder="High"
              type="number"
              value={fib.high ?? ""}
              onChange={e => updateIndicator("fibonacci", { high: Number(e.target.value) })}
            />

            <input
              placeholder="Low"
              type="number"
              value={fib.low ?? ""}
              onChange={e => updateIndicator("fibonacci", { low: Number(e.target.value) })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
