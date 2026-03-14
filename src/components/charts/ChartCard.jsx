import { useC } from "../../core/context.jsx";
import { AIChartBtn } from "./AIChartBtn.jsx";

export function ChartTip({ active, payload, label }) {
  const { th } = useC();
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: th.solidPanel, border: `1px solid ${th.border}`,
      borderRadius: 12, padding: "10px 14px", boxShadow: th.shadow, minWidth: 130,
    }}>
      <div style={{ color: th.textS, fontSize: 10.5, fontWeight: 600, marginBottom: 8, letterSpacing: "0.02em" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>
          <span style={{ color: th.textS, fontWeight: 500 }}>{p.name}</span>
          <span style={{ color: p.color }}>
            {typeof p.value === "number" && p.value > 1000
              ? "$" + (p.value / 1000).toFixed(0) + "k"
              : p.value + (p.name?.includes("%") || p.unit === "%" ? "%" : "")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartCard({ title, sub, right, aiKey, children, noPad }) {
  const { th } = useC();
  return (
    <div style={{
      background: th.bgCard, border: `1px solid ${th.border}`,
      borderRadius: 14, padding: noPad ? 0 : "18px 20px 14px",
      boxShadow: th.shadowS, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 14, padding: noPad ? "18px 20px 0" : 0,
      }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text, letterSpacing: "-0.02em" }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, color: th.textM, marginTop: 3 }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {right}
          {aiKey && <AIChartBtn analysisKey={aiKey} />}
        </div>
      </div>
      <div style={{ padding: noPad ? "0 20px 14px" : 0 }}>{children}</div>
    </div>
  );
}
