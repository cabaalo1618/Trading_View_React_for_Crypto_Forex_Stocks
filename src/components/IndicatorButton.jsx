import { useState } from "react";
import { useIndicators } from "../state/IndicatorContext";
import IndicatorConfig from "./IndicatorConfig";

export default function IndicatorButton({ name, label }) {
  const { indicators, updateIndicator } = useIndicators();
  const [open, setOpen] = useState(false);

  const indicator = indicators[name];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          updateIndicator(name, { enabled: !indicator.enabled });
          setOpen(true);
        }}
        style={{
          background: indicator.enabled ? "#1e90ff" : "#222",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: "4px"
        }}
      >
        {label}
      </button>

      {open && (
        <IndicatorConfig
          name={name}
          indicator={indicator}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
