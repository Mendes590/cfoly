import { createContext, useContext } from "react";

export const Ctx = createContext(null);
export const useC = () => useContext(Ctx);

export const NAV = [
  { id: "dashboard",    icon: "⊞", path: "/dashboard" },
  { id: "cashflow",     icon: "◈", path: "/cashflow" },
  { id: "revenue",      icon: "↗", path: "/revenue" },
  { id: "expenses",     icon: "↙", path: "/expenses" },
  { id: "customers",    icon: "◉", path: "/customers" },
  { id: "insights",     icon: "★", path: "/insights" },
  { id: "report",       icon: "📄", path: "/report" },
  { id: "context",      icon: "🧠", path: "/business-context" },
  { id: "integrations", icon: "🔗", path: "/integrations" },
  { id: "settings",     icon: "⚙",  path: "/settings" },
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
