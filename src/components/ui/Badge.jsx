import { useC } from "../../core/context.jsx";

export function Badge({ children, color = "accent", pulse, size = "sm" }) {
  const { th } = useC();
  const m = {
    accent: [th.accentBg, th.accentL],
    green: [th.greenBg, th.green],
    red: [th.redBg, th.red],
    amber: [th.amberBg, th.amber],
    cyan: [th.cyanBg, th.cyan],
  };
  const [bg, c] = m[color] || m.accent;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: size === "lg" ? 12 : 10, fontWeight: 700, letterSpacing: "0.05em",
      padding: size === "lg" ? "4px 12px" : "3px 8px",
      borderRadius: 20, background: bg, color: c, whiteSpace: "nowrap",
    }}>
      {pulse && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, animation: "cPulse 2s infinite", flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
