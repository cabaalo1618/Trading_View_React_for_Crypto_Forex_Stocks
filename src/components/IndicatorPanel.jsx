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
        <IndicatorButton name="ma" label="MA" />
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
              type="text"
              value={indicators.fibonacci.high ?? ""}
              onChange={e => {
                const v = e.target.value.replace(",", ".");
                if (!isNaN(v) || v === "") {
                  updateIndicator("fibonacci", { high: v === "" ? null : parseFloat(v) });
                }
              }}
            />

            <input
              placeholder="Low"
              type="text"
              value={indicators.fibonacci.low ?? ""}
              onChange={e => {
                const v = e.target.value.replace(",", ".");
                if (!isNaN(v) || v === "") {
                  updateIndicator("fibonacci", { low: v === "" ? null : parseFloat(v) });
                }
              }}
            />

            <div style={{ marginTop: "0.5rem" }}>
              <label>Tipo de linha</label>
              <select
                value={indicators.fibonacci.lineStyle}
                onChange={e =>
                  updateIndicator("fibonacci", { lineStyle: e.target.value })
                }
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Tracejada</option>
              </select>
            </div>

            <div>
              <label>Espessura</label>
              <input
                type="range"
                min="1"
                max="4"
                value={indicators.fibonacci.lineWidth}
                onChange={e =>
                  updateIndicator("fibonacci", { lineWidth: Number(e.target.value) })
                }
              />
            </div>



          </div>

        )}
      </div>
    </div>
  );
}
