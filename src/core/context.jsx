import { createContext, useContext } from "react";

export const Ctx = createContext(null);
export const useC = () => useContext(Ctx);

export const NAV = [
  { id: "dashboard", icon: "⊞" },
  { id: "cashflow", icon: "◈" },
  { id: "revenue", icon: "↗" },
  { id: "expenses", icon: "↙" },
  { id: "customers", icon: "◉" },
  { id: "insights", icon: "★" },
  { id: "report", icon: "📄" },
  { id: "context", icon: "🧠" },
  { id: "integrations", icon: "🔗" },
  { id: "settings", icon: "⚙" },
];

export const fmt = (v) => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v);
export const fmtFull = (v) => "$" + v.toLocaleString();
export const fmtPct = (v) => v.toFixed(1) + "%";

export function renderMD(text) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={j}>{p.slice(2, -2)}</strong>
        : p
    );
    return <div key={i} style={{ marginBottom: line === "" ? 6 : 2, lineHeight: 1.65 }}>{parts}</div>;
  });
}
