import { useState } from "react";
import { useC } from "../../core/context.jsx";

export function Card({ children, style = {}, noPad, onClick, glow }) {
  const { th } = useC();
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h && onClick ? th.bgCardH : th.bgCard,
        border: `1px solid ${glow ? th.borderA : h && onClick ? th.borderH : th.border}`,
        borderRadius: 14,
        padding: noPad ? 0 : "20px 22px",
        boxShadow: glow
          ? `${th.shadowS}, 0 0 0 1px ${th.borderA}, 0 0 28px rgba(37,99,235,0.06)`
          : h && onClick ? th.shadow : th.shadowS,
        transition: "background 0.18s, border-color 0.2s, box-shadow 0.22s, transform 0.18s",
        transform: h && onClick ? "translateY(-2px)" : "translateY(0)",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SecTitle({ title, sub, right, mb = 16 }) {
  const { th } = useC();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: mb }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text, letterSpacing: "-0.02em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: th.textM, marginTop: 3 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
