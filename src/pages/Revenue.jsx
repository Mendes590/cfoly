import { useState } from "react";
import { useC, fmtFull } from "../core/context.jsx";
import { custData, revMonthly, revGrowthData, PIE_C } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { KpiCard } from "../components/widgets/KpiCard.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import { AIChartBtn } from "../components/charts/AIChartBtn.jsx";
import { Th, Td, TRow } from "../components/ui/Table.jsx";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ReferenceLine,
} from "recharts";

export function PageRevenue() {
  const { th, t } = useC();
  const [sel, setSel] = useState(null);
  const [chartType, setChartType] = useState("area");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 13 }}>
        <KpiCard label={t.kpi.revenue} value="$120k" sub={t.vsLast} trend={+8} accent="#3b82f6" icon="↗" sparkline={[88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.netMargin} value="29%" sub={t.vsLast} trend={+2} accent="#10b981" icon="%" sparkline={[26, 27, 25, 27, 28, 29].map((v, i) => ({ i, v }))} />
        <KpiCard label="MRR" value="$120k" sub={t.vsLast} trend={+8} accent="#8b5cf6" icon="★" sparkline={[88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }))} />
        <KpiCard label="ARR" value="$1.44M" sub="Projetado" accent="#06b6d4" icon="◈" sparkline={[1.1, 1.2, 1.26, 1.3, 1.37, 1.44].map((v, i) => ({ i, v: v * 1000 }))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 13 }}>
        {/* Revenue history */}
        <Card noPad>
          <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{t.revOverTime}</div>
              <div style={{ fontSize: 11.5, color: th.textM, marginTop: 2 }}>Set 2024 – Mar 2025</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 2, padding: "3px", borderRadius: 9, background: th.bgSection, border: `1px solid ${th.border}` }}>
                {[{ v: "area", i: "~" }, { v: "bar", i: "▐" }].map((o) => (
                  <button key={o.v} onClick={() => setChartType(o.v)}
                    style={{ padding: "4px 9px", borderRadius: 7, border: "none", background: chartType === o.v ? th.accent : "transparent", color: chartType === o.v ? "#fff" : th.textM, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{o.i}</button>
                ))}
              </div>
              <AIChartBtn analysisKey="revenue" />
            </div>
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <ResponsiveContainer width="100%" height={220}>
              {chartType === "bar" ? (
                <BarChart data={revMonthly} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="v" name={t.kpi.revenue} radius={[7, 7, 0, 0]}>
                    {revMonthly.map((_, i) => <Cell key={i} fill={i === revMonthly.length - 1 ? "#3b82f6" : "rgba(59,130,246,0.5)"} />)}
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart data={revMonthly} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="v" name={t.kpi.revenue} stroke="#3b82f6" strokeWidth={3} fill="url(#gR)"
                    dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Concentration pie */}
        <ChartCard title={t.custTitle} aiKey="pierevenuebycat">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={custData} dataKey="share" nameKey="name" cx="50%" cy="50%" outerRadius={82} innerRadius={52} paddingAngle={3}
                onClick={(_, i) => setSel(i === sel ? null : i)}>
                {custData.map((_, i) => <Cell key={i} fill={PIE_C[i]} opacity={sel === null || sel === i ? 1 : 0.35} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: th.solidPanel, border: `1px solid ${th.border}`, borderRadius: 9, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: th.textS }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Concentration risk indicator */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
            {custData.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_C[i] }} />
                <span style={{ color: c.share > 35 ? th.red : th.textM, fontWeight: c.share > 35 ? 700 : 400 }}>
                  {c.share > 25 && "⚠ "}{c.name.split(" ")[0]}: {c.share}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Revenue growth rate */}
      <ChartCard title="Taxa de Crescimento Mensal" sub="Variação % vs mês anterior" aiKey="revgrowth">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revGrowthData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
            <XAxis dataKey="m" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={0} stroke={th.border} strokeWidth={1.5} />
            <Bar dataKey="growth" name="Crescimento %" radius={[5, 5, 0, 0]}>
              {revGrowthData.map((d, i) => <Cell key={i} fill={d.growth >= 0 ? "#10b981" : "#ef4444"} opacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Customer table */}
      <Card noPad>
        <div style={{ padding: "18px 22px 4px" }}>
          <SecTitle title={`${t.tCust} — ${t.tRev}`} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr>{[t.tCust, t.tRev, t.tShare, t.tTrend, "MRR", "Meses", t.tStatus].map((h) => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {custData.map((c, i) => (
                <TRow key={i}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: PIE_C[i] + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: PIE_C[i], flexShrink: 0 }}>{c.name[0]}</div>
                      <span style={{ fontWeight: 600, color: th.text }}>{c.name}</span>
                    </div>
                  </Td>
                  <Td s={{ fontWeight: 600 }}>{fmtFull(c.revenue)}</Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 64, height: 5, borderRadius: 10, background: th.border }}>
                        <div style={{ height: "100%", width: `${c.share}%`, background: c.share > 35 ? "#ef4444" : "#6366f1", borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.share > 35 ? th.red : th.textS }}>{c.share}%</span>
                    </div>
                  </Td>
                  <Td><span style={{ fontWeight: 700, color: c.trend >= 0 ? th.green : th.red }}>{c.trend >= 0 ? "↑" : "↓"} {Math.abs(c.trend)}%</span></Td>
                  <Td s={{ fontWeight: 600 }}>{fmtFull(c.mrr)}</Td>
                  <Td>{c.months} meses</Td>
                  <Td><Badge color={c.status === "active" ? "green" : "red"}>{c.status === "active" ? t.tActive : t.tRisk}</Badge></Td>
                </TRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
