import { useC, fmtFull } from "../core/context.jsx";
import { cfData, expData, fixedVarData } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { KpiCard } from "../components/widgets/KpiCard.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import { Th, Td, TRow } from "../components/ui/Table.jsx";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

export function PageExpenses() {
  const { th, t } = useC();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 13 }}>
        <KpiCard label={t.kpi.expenses} value="$85k" sub={t.vsLast} trend={-3} accent="#ef4444" icon="↙" sparkline={[75, 74, 80, 76, 82, 85].map((v, i) => ({ i, v }))} />
        <KpiCard label="Fixas" value="$54.5k" sub="64% do total" accent="#6366f1" icon="⊟" sparkline={[54, 54, 54, 54, 54, 54.5].map((v, i) => ({ i, v }))} />
        <KpiCard label="Variáveis" value="$30.5k" sub="36% do total" accent="#f59e0b" icon="⊞" sparkline={[20, 20, 26, 22, 28, 30.5].map((v, i) => ({ i, v }))} />
        <KpiCard label="Maior item" value="56%" sub="Folha / total" accent="#8b5cf6" icon="👥" sparkline={[54, 55, 55, 55, 56, 56].map((v, i) => ({ i, v }))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 13 }}>
        {/* Expense pie */}
        <ChartCard title={t.expByCat} aiKey="expenses">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                {expData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtFull(v)} contentStyle={{ background: th.solidPanel, border: `1px solid ${th.border}`, borderRadius: 9, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: th.textS }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top expenses table */}
        <Card noPad>
          <div style={{ padding: "18px 22px 4px" }}>
            <SecTitle title={t.topExp} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{[t.cat, t.amt, "% Total", t.chg].map((h) => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {expData.map((e, i) => (
                  <TRow key={i}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: e.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{e.name}</span>
                      </div>
                    </Td>
                    <Td s={{ fontWeight: 600 }}>{fmtFull(e.value)}</Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 50, height: 4, borderRadius: 4, background: th.border }}>
                          <div style={{ height: "100%", width: `${(e.value / 85000 * 100)}%`, background: e.color, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11.5 }}>{(e.value / 85000 * 100).toFixed(0)}%</span>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ fontWeight: 700, color: e.change > 0 ? th.red : e.change < 0 ? th.green : th.textM }}>
                        {e.change > 0 ? "↑" : e.change < 0 ? "↓" : "–"} {Math.abs(e.change)}%
                      </span>
                    </Td>
                  </TRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {/* Fixed vs variable stacked */}
        <ChartCard title="Fixas vs Variáveis" sub="Evolução por mês" aiKey="fixedvar">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fixedVarData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: th.textS }} />
              <Bar dataKey="fixed" name="Fixas" stackId="a" fill="#6366f1" opacity={0.9} />
              <Bar dataKey="variable" name="Variáveis" stackId="a" fill="#f59e0b" radius={[5, 5, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense history */}
        <ChartCard title={`${t.kpi.expenses} — Histórico`} aiKey="exphistory">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cfData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="expenses" name={t.kpi.expenses} radius={[7, 7, 0, 0]}>
                {cfData.map((_, i) => <Cell key={i} fill={i === 5 ? "#6366f1" : "rgba(99,102,241,0.45)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
