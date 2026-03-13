import { useC } from "../core/context.jsx";

export function NotifPanel({ onClose }) {
  const { th, t } = useC();
  const cc = { amber: th.amber, red: th.red, green: th.green, accent: th.accent };
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9998 }} />
      <div style={{
        position: "fixed", top: 60, right: 14, width: 340,
        background: th.solidPanel, border: `1px solid ${th.border}`,
        borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        zIndex: 9999, maxHeight: "calc(100vh - 80px)",
        display: "flex", flexDirection: "column",
        animation: "aiPopupDown 0.2s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{
          padding: "14px 18px", borderBottom: `1px solid ${th.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5, color: th.text }}>{t.notifTitle}</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: th.redBg, color: th.red, padding: "1px 7px", borderRadius: 20 }}>2</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: th.accentL, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}
          >{t.notifMark}</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
          {t.notifs.map((n, i) => (
            <div key={i}
              style={{
                padding: "12px 18px",
                borderBottom: i < t.notifs.length - 1 ? `1px solid ${th.border}` : "none",
                display: "flex", gap: 11, alignItems: "flex-start",
                background: n.unread ? th.bgSection : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = th.bgCardH)}
              onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? th.bgSection : "transparent")}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: cc[n.c] + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, flexShrink: 0,
              }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: n.unread ? 700 : 500, fontSize: 12.5, color: th.text, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 11.5, color: th.textM }}>{n.desc}</div>
              </div>
              <div style={{ fontSize: 10.5, color: th.textM, flexShrink: 0, paddingTop: 1 }}>{n.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
