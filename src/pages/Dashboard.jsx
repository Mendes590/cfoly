import { useC } from "../core/context.jsx";
import { cfData, custData, fcastData, PIE_C } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { KpiCard } from "../components/widgets/KpiCard.jsx";
import { InsCard, AlertCard } from "../components/widgets/InsightCards.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart,
  ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export function PageDashboard() {
  const { th, t } = useC();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {t.alerts.map((a) => <AlertCard key={a.id} alert={a} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 13 }}>
        <KpiCard label={t.kpi.revenue} value="$120k" sub={t.vsLast} trend={+8} accent="#3b82f6" icon="↗" sparkline={[88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.expenses} value="$85k" sub={t.vsLast} trend={-3} accent="#ef4444" icon="↙" sparkline={[75, 74, 80, 76, 82, 85].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.netMargin} value="29%" sub={t.vsLast} trend={+2} accent="#10b981" icon="%" sparkline={[26, 27, 25, 27, 28, 29].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.cashRunway} value={`87 ${t.days}`} sub="Ideal: 180+" accent="#f59e0b" icon="◷" sparkline={[110, 105, 99, 95, 90, 87].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.breakeven} value="$82k" sub={t.perMonth} accent="#8b5cf6" icon="⊜" sparkline={[82, 82, 82, 82, 82, 82].map((v, i) => ({ i, v }))} />
        <KpiCard label={t.kpi.ebitda} value="$35k" sub={t.vsLast} trend={+5} accent="#06b6d4" icon="◈" sparkline={[28, 30, 31, 29, 33, 35].map((v, i) => ({ i, v }))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 13 }}>
        <ChartCard title={t.cfTitle} sub={t.cfSub} aiKey="cashflow" right={<Badge color="green">+$35k saldo</Badge>}>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={cfData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.18} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="income" name={t.income} stroke="#3b82f6" strokeWidth={2.5} fill="url(#gI)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
              <Area type="monotone" dataKey="expenses" name={t.expenses2} stroke="#ef4444" strokeWidth={2.5} fill="url(#gE)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.custTitle} aiKey="concentration" right={<Badge color="red">Risco</Badge>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {custData.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: th.text }}>{c.name}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: c.share > 35 ? th.red : th.textS }}>{c.share}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 10, background: th.border }}>
                  <div style={{
                    height: "100%", width: `${c.share}%`,
                    background: c.share > 35 ? "linear-gradient(90deg,#ef4444,#f87171)" : PIE_C[i],
                    borderRadius: 10, transition: "width 0.7s ease",
                    boxShadow: c.share > 35 ? "0 0 8px rgba(239,68,68,0.5)" : "none",
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "9px 12px", borderRadius: 10, background: th.redBg, border: `1px solid ${th.redB}`, fontSize: 11.5, color: th.textS, lineHeight: 1.5 }}>
            ⚠ {t.custWarn}
          </div>
        </ChartCard>
      </div>

      <Card>
        <SecTitle title={t.insTitle} right={<Badge color="accent" pulse>{t.insLive}</Badge>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {t.insCards.map((ins, i) => <InsCard key={i} ins={ins} />)}
        </div>
      </Card>

      <ChartCard title={t.fTitle} sub={t.fSub} aiKey="forecast" right={<Badge color="green">{t.fAbove}</Badge>}>
        <ResponsiveContainer width="100%" height={190}>
          <ComposedChart data={fcastData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="pessimist" name="Pessimista" fill={th.border} radius={[6, 6, 0, 0]} opacity={0.5} />
            <Bar dataKey="projected" name="Projetado" fill="#6366f1" radius={[6, 6, 0, 0]} opacity={0.9} />
            <Bar dataKey="optimistic" name="Otimista" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.55} />
            <ReferenceLine y={82000} stroke={th.green} strokeDasharray="5 4" strokeWidth={2}
              label={{ value: "Break-even", position: "right", fontSize: 10, fill: th.green }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
