import { useState } from "react";
import { useC } from "../core/context.jsx";
import { cfData } from "../core/mockData.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { ChartCard, ChartTip } from "../components/charts/ChartCard.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function PageReport() {
  const { th, t } = useC();
  const r = t.report;
  const [exported, setExported] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: th.text, letterSpacing: "-0.03em", marginBottom: 5 }}>{r.title}</div>
          <div style={{ fontSize: 12, color: th.textM, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: th.accentL, display: "inline-block", animation: "cPulse 2s infinite" }} />
            {r.sub}
          </div>
        </div>
        <button
          onClick={() => { setExported(true); setTimeout(() => setExported(false), 2500); }}
          style={{
            padding: "10px 20px", borderRadius: 11,
            border: exported ? `1px solid ${th.greenB}` : "none",
            background: exported ? th.greenBg : "linear-gradient(135deg,#4f46e5,#2563eb)",
            color: exported ? th.green : "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
            boxShadow: exported ? "none" : "0 3px 12px rgba(99,102,241,0.35)",
          }}
        >{exported ? "✓ Exportado!" : "↓ Exportar PDF"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
        {[
          { label: "Receita", value: "$120k", color: th.green, trend: "+8%", icon: "↗" },
          { label: "Despesas", value: "$85k", color: th.red, trend: "-3%", icon: "↙" },
          { label: "Margem Líq.", value: "29%", color: th.accent, trend: "+2pp", icon: "%" },
          { label: "Runway", value: "87 dias", color: th.amber, trend: "-12d", icon: "◷" },
        ].map((k, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: th.bgCard, border: `1px solid ${th.border}`, boxShadow: th.shadowS }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{k.label}</div>
              <span style={{ fontSize: 15, color: k.color }}>{k.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: th.text, letterSpacing: "-0.03em", marginBottom: 5 }}>{k.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: k.color }}>{k.trend} vs mês ant.</div>
          </div>
        ))}
      </div>

      <Card>
        <SecTitle title="Resumo Executivo" mb={12} />
        <div style={{ fontSize: 13.5, color: th.textS, lineHeight: 1.78, padding: "14px 18px", background: th.bgSection, borderRadius: 11, border: `1px solid ${th.border}`, borderLeft: `3px solid ${th.accentL}` }}>
          {r.summary}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 13 }}>
        {[
          { title: "Destaques", icon: "✓", items: r.highlights, bg: th.greenBg, b: th.greenB, c: th.green },
          { title: "Riscos", icon: "!", items: r.risks, bg: th.redBg, b: th.redB, c: th.red },
          { title: "Ações", icon: "→", items: r.actions, bg: th.accentBg, b: th.borderA, c: th.accentL },
        ].map((col, ci) => (
          <Card key={ci}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: col.bg, border: `1px solid ${col.b}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: col.c, fontWeight: 800 }}>{col.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{col.title}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: col.bg, border: `1px solid ${col.b}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: col.c, flexShrink: 0, marginTop: 2, fontWeight: 800 }}>{ci === 2 ? i + 1 : col.icon}</div>
                  <div style={{ fontSize: 13, color: th.textS, lineHeight: 1.55 }}>{item}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <ChartCard title="Receita vs Despesas — Histórico" aiKey="cashflow">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={cfData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={5}>
            <CartesianGrid strokeDasharray="3 3" stroke={th.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: th.textM, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: th.textM, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="income" name="Receita" fill="#3b82f6" radius={[6, 6, 0, 0]} opacity={0.9} />
            <Bar dataKey="expenses" name="Despesas" fill="#6366f1" radius={[6, 6, 0, 0]} opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Period commentary */}
      <Card>
        <SecTitle title="Comentário do Período" mb={12} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {[
            { label: "Tendência de receita", value: "Crescimento consistente de +8% MoM, puxado por expansão em clientes existentes.", color: th.green, icon: "↗" },
            { label: "Controle de despesas", value: "Despesas crescem em ritmo menor que receita (+3%), preservando a margem.", color: th.accentL, icon: "✓" },
            { label: "Ponto de atenção", value: "Runway de 87 dias está abaixo do ideal de 180 dias — monitorar de perto.", color: th.amber, icon: "⚠" },
            { label: "Perspectiva", value: "Projeção Abril–Junho mantém todos os meses acima do break-even com folga.", color: th.blue ?? th.accentL, icon: "◈" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 13, background: th.bgSection, border: `1px solid ${th.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16, color: item.color }}>{item.icon}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: item.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 12.5, color: th.textS, lineHeight: 1.65 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Methodology note */}
      <div style={{ padding: "13px 18px", borderRadius: 13, background: th.bgSection, border: `1px solid ${th.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 16, color: th.textM, flexShrink: 0, marginTop: 1 }}>ℹ</span>
        <div style={{ fontSize: 12.5, color: th.textM, lineHeight: 1.65 }}>
          Relatório gerado com dados de <strong style={{ color: th.textS }}>Out 2024 – Mar 2025</strong>. Os valores apresentados são baseados em dados consolidados do período. Para análise com IA, acesse a página <strong style={{ color: th.accentL }}>Insights</strong>.
        </div>
      </div>
    </div>
  );
}
