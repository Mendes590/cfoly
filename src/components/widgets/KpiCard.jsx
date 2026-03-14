import { useC } from "../../core/context.jsx";
import { Card } from "../ui/Card.jsx";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function KpiCard({ label, value, sub, trend, accent, icon, sparkline }) {
  const { th } = useC();
  const mini = sparkline || [88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }));
  const isPositive = trend >= 0;
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: th.textS, textTransform: "uppercase" }}>{label}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: accent + "16",
          border: `1px solid ${accent}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: th.text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 12 }}>{value}</div>
      <div style={{ height: 34, marginBottom: 12 }}>
        <ResponsiveContainer width="100%" height={34}>
          <LineChart data={mini} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
            <Line type="monotone" dataKey="v" stroke={accent} strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {trend !== undefined && (
          <span style={{
            fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: isPositive ? th.greenBg : th.redBg,
            color: isPositive ? th.green : th.red,
            border: `1px solid ${isPositive ? th.greenB : th.redB}`,
          }}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: 11.5, color: th.textM }}>{sub}</span>
      </div>
    </Card>
  );
}
