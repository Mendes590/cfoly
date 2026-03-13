import { useState } from "react";
import { useC, fmtFull } from "../core/context.jsx";
import { cfData, fcastData, weeklyData, balanceData } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { KpiCard } from "../components/widgets/KpiCard.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import { AIChartBtn } from "../components/charts/AIChartBtn.jsx";
import { Th, Td, TRow } from "../components/ui/Table.jsx";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";

// Forecast data with confidence band fields
const fcastBand = fcastData.map((d) => ({
  ...d,
  bandBase: d.pessimist,
  bandTop: d.optimistic - d.pessimist,
}));

export function PageCashFlow() {
  const { th, t } = useC();
  const [period, setPeriod] = useState("6m");
  const [view, setView] = useState("area");

  const PeriodBtn = ({ p }) => (
    <button onClick={() => setPeriod(p)}
      style={{
        padding: "4px 10px", borderRadius: 7, border: "none",
        background: period === p ? th.accent : "transparent",
        color: period === p ? "#fff" : th.textM,
        fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
      }}>{p}</button>
  );

  const ViewBtn = ({ v, icon }) => (
    <button onClick={() => setView(v)}
      style={{
        padding: "4px 10px", borderRadius: 7, border: "none",
        background: view === v ? th.accent : "transparent",
        color: view === v ? "#fff" : th.textM,
        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
      }}>{icon}</button>
  );

  const chartProps = {
    data: cfData, margin: { top: 4, right: 4, left: -12, bottom: 0 },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 13 }}>
        <KpiCard label="Receita Total" value="$636k" sub="últ. 6 meses" accent="#3b82f6" icon="↗" sparkline={[88, 95, 103, 98, 110, 120].map((v, i) => ({ i, v }))} />
        <KpiCard label="Despesas Total" value="$468k" sub="últ. 6 meses" accent="#ef4444" icon="↙" sparkline={[71, 74, 80, 76, 82, 85].map((v, i) => ({ i, v }))} />
        <KpiCard label="Saldo Acumulado" value="$168k" sub="últ. 6 meses" trend={+8} accent="#10b981" icon="=" sparkline={[27, 31, 32, 27, 36, 35].map((v, i) => ({ i, v }))} />
        <KpiCard label="Burn Rate" value="$85k" sub="/ mês atual" accent="#f59e0b" icon="🔥" sparkline={[71, 74, 80, 76, 82, 85].map((v, i) => ({ i, v }))} />
        <KpiCard label="Caixa Disponível" value="$245k" sub="Runway 87 dias" trend={-5} accent="#8b5cf6" icon="💰" sparkline={[280, 270, 260, 255, 250, 245].map((v, i) => ({ i, v }))} />
      </div>

      {/* Main chart with controls */}
      <Card noPad>
        <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{t.cfTitle}</div>
            <div style={{ fontSize: 11.5, color: th.textM, marginTop: 2 }}>Receita vs Despesas · Período selecionado</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 2, padding: "3px", borderRadius: 9, background: th.bgSection, border: `1px solid ${th.border}` }}>
              {["1m", "3m", "6m", "1a"].map((p) => <PeriodBtn key={p} p={p} />)}
            </div>
            <div style={{ display: "flex", gap: 2, padding: "3px", borderRadius: 9, background: th.bgSection, border: `1px solid ${th.border}` }}>
              <ViewBtn v="area" icon="~" /><ViewBtn v="bar" icon="▐" /><ViewBtn v="line" icon="/" />
            </div>
            <AIChartBtn analysisKey="cashflow" />
          </div>
        </div>
        <div style={{ padding: "0 20px 16px" }}>
          <ResponsiveContainer width="100%" height={300}>
            {view === "bar" ? (
              <BarChart {...chartProps} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: th.textS }} />
                <Bar dataKey="income" name={t.income} fill="#3b82f6" radius={[6, 6, 0, 0]} opacity={0.9} />
                <Bar dataKey="expenses" name={t.expenses2} fill="#ef4444" radius={[6, 6, 0, 0]} opacity={0.75} />
              </BarChart>
            ) : view === "line" ? (
              <LineChart {...chartProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: th.textS }} />
                <Line type="monotone" dataKey="income" name={t.income} stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="expenses" name={t.expenses2} stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
              </LineChart>
            ) : (
              <AreaChart {...chartProps}>
                <defs>
                  <linearGradient id="g2I" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2E" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.18} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: th.textS }} />
                <Area type="monotone" dataKey="income" name={t.income} stroke="#3b82f6" strokeWidth={2.5} fill="url(#g2I)" dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
                <Area type="monotone" dataKey="expenses" name={t.expenses2} stroke="#ef4444" strokeWidth={2.5} fill="url(#g2E)" dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Balance + Margin row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {/* Cash balance over time */}
        <ChartCard title="Saldo de Caixa" sub="Posição acumulada de caixa" aiKey="balance">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={balanceData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={180000} stroke={th.green} strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: "Meta 180d", position: "right", fontSize: 9, fill: th.green }} />
              <Area type="monotone" dataKey="balance" name="Saldo" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gBal)"
                dot={{ fill: "#06b6d4", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Margin over time */}
        <ChartCard title="Margem Operacional" sub="Receita − Despesas" aiKey="margin">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cfData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="margin" name="Margem" stroke="#10b981" strokeWidth={2.5} fill="url(#gM)"
                dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Forecast with confidence band + Weekly */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 13 }}>
        <ChartCard title={t.fTitle} sub="Com intervalo de confiança" aiKey="forecast" right={<Badge color="green">{t.fAbove}</Badge>}>
          <ResponsiveContainer width="100%" height={210}>
            <ComposedChart data={fcastBand} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              {/* Confidence band: base (transparent) + top fill */}
              <Area dataKey="bandBase" stackId="band" stroke="none" fill="none" name="Mín" />
              <Area dataKey="bandTop" stackId="band" stroke="none" fill="url(#gBand)" name="Intervalo" />
              <Line type="monotone" dataKey="projected" stroke="#6366f1" strokeWidth={3}
                dot={{ fill: "#6366f1", r: 5, strokeWidth: 2, stroke: "#fff" }} name="Projetado" />
              <Line type="monotone" dataKey="pessimist" stroke={th.amber} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Pessimista" />
              <Line type="monotone" dataKey="optimistic" stroke={th.green} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Otimista" />
              <ReferenceLine y={82000} stroke={th.green} strokeDasharray="5 4" strokeWidth={2}
                label={{ value: "Break-even", position: "right", fontSize: 10, fill: th.green }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fluxo Semanal" sub="Março 2025" aiKey="cashflow">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
              <XAxis dataKey="w" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="income" name="Receita" fill="#3b82f6" radius={[5, 5, 0, 0]} opacity={0.9} />
              <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[5, 5, 0, 0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Burn rate */}
      <ChartCard title="Burn Rate vs Runway" sub="Projeção do caixa disponível" aiKey="burnrate">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: "4px 0" }}>
          {[
            { label: "Caixa Disponível", value: "$245k", pct: 100, color: "#3b82f6", note: "Referência" },
            { label: "Burn Rate Mensal", value: "$85k", pct: 35, color: "#ef4444", note: "34.7% do caixa" },
            { label: "Runway Atual", value: "87 dias", pct: 48, color: "#f59e0b", note: "48% da meta" },
            { label: "Meta Runway", value: "180 dias", pct: 100, color: "#10b981", note: "Ideal mínimo" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12.5, color: th.textS }}>{item.label}</div>
                  <div style={{ fontSize: 10.5, color: th.textM }}>{item.note}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.value}</span>
              </div>
              <div style={{ height: 8, borderRadius: 10, background: th.border }}>
                <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 10, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Monthly table */}
      <Card noPad>
        <div style={{ padding: "18px 22px 4px" }}>
          <SecTitle title="Detalhamento Mensal" />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr>{["Mês", "Receita", "Despesas", "Margem", "Margem %", "Var. Receita"].map((h) => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {cfData.map((d, i) => {
                const prevInc = i > 0 ? cfData[i - 1].income : d.income;
                const varPct = i > 0 ? ((d.income - prevInc) / prevInc * 100).toFixed(1) : 0;
                return (
                  <TRow key={i}>
                    <Td s={{ fontWeight: 600, color: th.text }}>{d.month}</Td>
                    <Td s={{ fontWeight: 600, color: th.green }}>{fmtFull(d.income)}</Td>
                    <Td s={{ fontWeight: 600, color: th.red }}>{fmtFull(d.expenses)}</Td>
                    <Td s={{ fontWeight: 700, color: th.text }}>{fmtFull(d.margin)}</Td>
                    <Td><span style={{ fontSize: 12, fontWeight: 700, color: d.marginPct > 28 ? th.green : th.amber }}>{d.marginPct.toFixed(1)}%</span></Td>
                    <Td><span style={{ fontSize: 12, fontWeight: 700, color: Number(varPct) >= 0 ? th.green : th.red }}>{Number(varPct) >= 0 ? "↑" : "↓"} {Math.abs(Number(varPct))}%</span></Td>
                  </TRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
