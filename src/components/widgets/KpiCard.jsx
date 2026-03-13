import { useC } from "../../core/context.jsx";
import { Card } from "../ui/Card.jsx";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function KpiCard({ label, value, sub, trend, accent, icon, sparkline }) {
  const { th } = useC();
  const mini = sparkline || [88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }));
  const isPositive = trend >= 0;
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: th.textM, textTransform: "uppercase" }}>{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: accent + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: th.text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 10 }}>{value}</div>
      <div style={{ height: 36, marginBottom: 10 }}>
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={mini} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <Line type="monotone" dataKey="v" stroke={accent} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {trend !== undefined && (
          <span style={{
            fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: isPositive ? th.greenBg : th.redBg,
            color: isPositive ? th.green : th.red,
          }}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: 11.5, color: th.textM }}>{sub}</span>
      </div>
    </Card>
  );
}
