import { useState } from "react";
import { useC } from "../../core/context.jsx";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";

export function InsCard({ ins }) {
  const { th } = useC();
  const [gone, setGone] = useState(false);
  const cm = {
    warning: { bg: th.amberBg, b: th.amberB, c: th.amber },
    alert: { bg: th.redBg, b: th.redB, c: th.red },
    tip: { bg: th.accentBg, b: th.borderA, c: th.accentL },
    positive: { bg: th.greenBg, b: th.greenB, c: th.green },
  };
  const { bg, b, c } = cm[ins.type] || cm.tip;
  if (gone) return null;
  return (
    <div style={{
      background: bg, border: `1px solid ${b}`,
      borderRadius: 12, padding: "13px 15px",
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: c + "20",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, flexShrink: 0,
      }}>{ins.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, color: th.text, marginBottom: 3 }}>{ins.title}</div>
        <div style={{ fontSize: 12, color: th.textS, lineHeight: 1.55 }}>{ins.desc}</div>
      </div>
      <button
        onClick={() => setGone(true)}
        style={{ background: "none", border: "none", cursor: "pointer", color: th.textM, fontSize: 18, lineHeight: 1, fontFamily: "inherit", padding: "0 2px", flexShrink: 0, opacity: 0.5 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
      >×</button>
    </div>
  );
}

export function AlertCard({ alert }) {
  const { th } = useC();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const cm = {
    critical: { border: th.redB, bg: th.redBg, dot: th.red, label: "Crítico", lc: th.red, bar: "#ef4444" },
    warning: { border: th.amberB, bg: th.amberBg, dot: th.amber, label: "Atenção", lc: th.amber, bar: "#f59e0b" },
    positive: { border: th.greenB, bg: th.greenBg, dot: th.green, label: "Positivo", lc: th.green, bar: "#10b981" },
  };
  const s = cm[alert.level] || cm.positive;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 14, padding: "14px 16px 14px 20px",
      display: "flex", gap: 12, alignItems: "flex-start",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: s.bar, borderRadius: "14px 0 0 14px" }} />
      <div style={{ fontSize: 18, flexShrink: 0 }}>{alert.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: th.text }}>{alert.title}</div>
          <span style={{
            fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20,
            background: s.dot + "22", color: s.dot,
            letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{s.label}</span>
        </div>
        <div style={{ fontSize: 13, color: th.textS, lineHeight: 1.62, marginBottom: 9 }}>{alert.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, background: s.dot + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>→</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: s.lc }}>{alert.action}</div>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: "none", border: "none", cursor: "pointer", color: th.textM, fontSize: 18, lineHeight: 1, fontFamily: "inherit", padding: "0 2px", flexShrink: 0, opacity: 0.6, transition: "opacity 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >×</button>
    </div>
  );
}

export function ScoreGauge({ score }) {
  const { th } = useC();
  const [expanded, setExpanded] = useState(false);
  const { label, value, color, grade, what, meaning, action } = score;
  const cx = 60, cy = 62, r = 46;
  const toRad = (d) => (d * Math.PI) / 180;
  const arcPath = (start, end, radius) => {
    const s = toRad(start), e = toRad(end);
    const x1 = cx + radius * Math.cos(s), y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e), y2 = cy + radius * Math.sin(e);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const valEnd = 165 + (value / 100) * 210;
  const gradeColor = value >= 75 ? th.green : value >= 50 ? th.amber : th.red;
  const gradeBg = value >= 75 ? th.greenBg : value >= 50 ? th.amberBg : th.redBg;
  const gradeB = value >= 75 ? th.greenB : value >= 50 ? th.amberB : th.redB;
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
        <Badge color={value >= 75 ? "green" : value >= 50 ? "amber" : "red"}>{grade}</Badge>
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 0" }}>
        <svg width="120" height="76" viewBox="0 0 120 76">
          <path d={arcPath(165, 375, r)} fill="none" stroke={th.border} strokeWidth="10" strokeLinecap="round" />
          <path d={arcPath(165, valEnd, r)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}70)` }} />
          <text x={cx} y={cy - 2} textAnchor="middle" fill={th.text} fontSize="19" fontWeight="800"
            style={{ fontFamily: "'DM Sans',sans-serif" }}>{value}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fill={th.textM} fontSize="9"
            style={{ fontFamily: "'DM Sans',sans-serif" }}>/100</text>
        </svg>
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          marginTop: 6, padding: "7px 0", background: "none",
          border: `1px solid ${th.border}`, borderRadius: 9, cursor: "pointer",
          fontSize: 11, color: th.textS, fontWeight: 600, fontFamily: "inherit",
          transition: "all 0.14s", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 5, width: "100%",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = th.accentBg; e.currentTarget.style.color = th.accentL; e.currentTarget.style.borderColor = th.borderA; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = th.textS; e.currentTarget.style.borderColor = th.border; }}
      >
        {expanded ? "▲ Fechar" : "▼ O que isso significa?"}
      </button>
      {expanded && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { bg: th.bgSection, b: th.border, lc: th.textM, label: "O que mede", text: what },
            { bg: gradeBg, b: gradeB, lc: gradeColor, label: "Sua situação", text: meaning },
            { bg: th.accentBg, b: th.borderA, lc: th.accentL, label: "Ação recomendada", text: action },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 9, background: s.bg, border: `1px solid ${s.b}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.lc, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: th.textS, lineHeight: 1.55 }}>{s.text}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
