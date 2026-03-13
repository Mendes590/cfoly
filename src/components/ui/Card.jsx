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
        border: `1px solid ${h && onClick ? th.borderH : th.border}`,
        borderRadius: 18,
        padding: noPad ? 0 : "20px 22px",
        boxShadow: glow
          ? `${th.shadowS}, 0 0 0 1px ${th.borderA}`
          : h && onClick ? th.shadow : th.shadowS,
        transition: "all 0.18s",
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
        <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text, letterSpacing: "-0.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: th.textM, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
