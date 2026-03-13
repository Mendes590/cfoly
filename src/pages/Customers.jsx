import { useState } from "react";
import { useC, fmtFull } from "../core/context.jsx";
import { custData, PIE_C } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { KpiCard } from "../components/widgets/KpiCard.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import { Th, Td, TRow } from "../components/ui/Table.jsx";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

// Concentration data for chart — sorted descending
const concData = [...custData].sort((a, b) => b.share - a.share);

// Mock revenue trend data per customer (last 6 months)
const trendData = [
  { m: "Out", acme: 44000, tech: 28000, build: 24000, outros: 13000 },
  { m: "Nov", acme: 46000, tech: 30000, build: 23500, outros: 13500 },
  { m: "Dez", acme: 47000, tech: 31000, build: 23000, outros: 14000 },
  { m: "Jan", acme: 45000, tech: 29000, build: 22000, outros: 12500 },
  { m: "Fev", acme: 49000, tech: 32000, build: 22500, outros: 14500 },
  { m: "Mar", acme: 50400, tech: 33600, build: 21600, outros: 14400 },
];

export function PageCustomers() {
  const { th, t } = useC();
  const [search, setSearch] = useState("");
  const filtered = custData.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 13 }}>
        <KpiCard label="Total de Clientes" value="4" sub="Contas ativas" accent="#6366f1" icon="◉" sparkline={[2, 2, 3, 3, 4, 4].map((v, i) => ({ i, v }))} />
        <KpiCard label="Receita Média" value="$30k" sub={t.vsLast} trend={+5} accent="#3b82f6" icon="⌀" sparkline={[24, 25, 26, 26, 28, 30].map((v, i) => ({ i, v }))} />
        <KpiCard label="Concentração Máx." value="42%" sub="Acme Corp" accent="#ef4444" icon="⚠" sparkline={[38, 39, 40, 40, 41, 42].map((v, i) => ({ i, v }))} />
        <KpiCard label="Churn" value="0%" sub="últ. 6 meses" accent="#10b981" icon="✓" sparkline={[0, 0, 0, 0, 0, 0].map((v, i) => ({ i, v }))} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 13 }}>
        {/* Concentration chart */}
        <ChartCard title="Concentração de Receita" sub="% por cliente" aiKey="customers">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={concData}
              layout="vertical"
              margin={{ top: 4, right: 40, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 50]} />
              <YAxis type="category" dataKey="name" tick={{ fill: th.textS, fontSize: 11.5, fontWeight: 600 }} axisLine={false} tickLine={false} width={82} />
              <Tooltip
                formatter={(v) => [`${v}%`, "Participação"]}
                contentStyle={{ background: th.solidPanel, border: `1px solid ${th.border}`, borderRadius: 9, fontSize: 12 }}
              />
              <ReferenceLine x={25} stroke={th.amber} strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: "25% limite", position: "top", fontSize: 9, fill: th.amber }} />
              <Bar dataKey="share" name="Participação" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {concData.map((d, i) => (
                  <Cell key={i} fill={d.share > 35 ? "#ef4444" : d.share > 25 ? "#f59e0b" : PIE_C[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Risk labels */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {[{ label: "Crítico", color: "#ef4444" }, { label: "Moderado", color: "#f59e0b" }, { label: "OK", color: "#10b981" }].map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: th.textM }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                {r.label}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Revenue trend per customer */}
        <ChartCard title="Evolução de Receita por Cliente" sub="Últimos 6 meses" aiKey="custtrend">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="m" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="acme" name="Acme Corp" stackId="a" fill={PIE_C[0]} opacity={0.9} />
              <Bar dataKey="tech" name="TechStart" stackId="a" fill={PIE_C[1]} opacity={0.9} />
              <Bar dataKey="build" name="BuildCo" stackId="a" fill={PIE_C[2]} opacity={0.9} />
              <Bar dataKey="outros" name="Outros" stackId="a" fill={PIE_C[3]} radius={[5, 5, 0, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Customer table */}
      <Card noPad>
        <div style={{ padding: "18px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{t.tCust}</div>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", width: 190, fontFamily: "inherit", transition: "border-color 0.14s" }}
            onFocus={(e) => (e.target.style.borderColor = th.accent)}
            onBlur={(e) => (e.target.style.borderColor = th.border)}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr>{[t.tCust, t.tRev, t.tShare, t.tTrend, "Antiguidade", t.tStatus].map((h) => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <TRow key={i}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: PIE_C[i % PIE_C.length] + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: PIE_C[i % PIE_C.length], flexShrink: 0 }}>{c.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: th.text }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: th.textM }}>{c.months} meses · {c.status === "active" ? "ativo" : "em risco"}</div>
                      </div>
                    </div>
                  </Td>
                  <Td s={{ fontWeight: 600 }}>{fmtFull(c.revenue)}</Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 72, height: 5, borderRadius: 10, background: th.border }}>
                        <div style={{ height: "100%", width: `${c.share}%`, background: c.share > 35 ? "#ef4444" : c.share > 25 ? "#f59e0b" : "#6366f1", borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.share > 35 ? th.red : c.share > 25 ? th.amber : th.textS }}>{c.share}%</span>
                    </div>
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 700, color: c.trend >= 0 ? th.green : th.red }}>{c.trend >= 0 ? "↑" : "↓"} {Math.abs(c.trend)}%</span>
                  </Td>
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
