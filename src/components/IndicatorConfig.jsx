import { useIndicators } from "../state/IndicatorContext";

export default function IndicatorConfig({ name, indicator, onClose }) {
  const { updateIndicator } = useIndicators();

  return (
    <div style={{
      position: "absolute",
      top: "110%",
      left: 0,
      background: "#111",
      border: "1px solid #333",
      padding: "1rem",
      borderRadius: "6px",
      minWidth: "200px",
      zIndex: 10
    }}>
      <div style={{ marginBottom: "0.5rem", color: "#fff" }}>
        <strong>{name.toUpperCase()}</strong>
      </div>

      {"period" in indicator && (
        <div>
          <label>Período</label>
          <input
            type="number"
            value={indicator.period}
            onChange={e => updateIndicator(name, { period: Number(e.target.value) })}
            style={{ width: "100%" }}
          />
        </div>
      )}

      {"stdDev" in indicator && (
        <div>
          <label>Desvio</label>
          <input
            type="number"
            step="0.1"
            value={indicator.stdDev}
            onChange={e => updateIndicator(name, { stdDev: Number(e.target.value) })}
            style={{ width: "100%" }}
          />
        </div>
      )}

      <div>
        <label>Cor</label>
        <input
          type="color"
          value={indicator.color}
          onChange={e => updateIndicator(name, { color: e.target.value })}
        />
      </div>

      <button
        onClick={() => updateIndicator(name, { enabled: false })}
        style={{
          marginTop: "0.5rem",
          background: "#ff4444",
          color: "#fff",
          border: "none",
          padding: "0.4rem",
          width: "100%",
          cursor: "pointer"
        }}
      >
        Remover
      </button>

      <button
        onClick={onClose}
        style={{
          marginTop: "0.3rem",
          background: "#333",
          color: "#fff",
          border: "none",
          padding: "0.4rem",
          width: "100%",
          cursor: "pointer"
        }}
      >
        Fechar
      </button>
    </div>
  );
}
