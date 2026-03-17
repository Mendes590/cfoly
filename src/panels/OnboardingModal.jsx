import { useState } from "react";
import { useC } from "../core/context.jsx";

export function OnboardingModal({ onClose, onGoToContext }) {
  const { th } = useC();
  const [skipForever, setSkipForever] = useState(false);

  const handleClose = () => {
    if (skipForever) localStorage.setItem("cfoup_skip_onboarding", "true");
    onClose();
  };

  const handleGoToContext = () => {
    onClose();
    onGoToContext();
  };

  return (
    <>
      <div
        onClick={handleClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 2000 }}
      />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 480, maxWidth: "calc(100vw - 32px)",
        borderRadius: 22, background: th.solidPanel,
        border: `1px solid ${th.borderA}`,
        boxShadow: "0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.12)",
        zIndex: 2001, padding: "32px 32px 28px",
        animation: "onboardIn 0.28s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {/* Icon + Title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: "linear-gradient(135deg,#4f46e5,#2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 28px rgba(79,70,229,0.45)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: th.text, marginBottom: 10, letterSpacing: "-0.02em" }}>
            Torne a IA mais precisa para o seu negócio
          </div>
          <div style={{ fontSize: 13.5, color: th.textS, lineHeight: 1.72, maxWidth: 360, margin: "0 auto" }}>
            Preencha o <strong style={{ color: th.text }}>Contexto do Negócio</strong> para que a IA calibre alertas e análises de acordo com o seu setor e objetivos.
          </div>
        </div>

        {/* Benefits list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
          {[
            "Análises calibradas para o seu setor e modelo de receita",
            "Alertas ajustados ao seu perfil de risco e tolerância",
            "Recomendações alinhadas aos seus objetivos financeiros",
          ].map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12,
              background: th.bgSection, border: `1px solid ${th.border}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7,
                background: th.accentBg, border: `1px solid ${th.borderA}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 10, color: th.accentL, fontWeight: 900 }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: th.textS, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleGoToContext}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 13, border: "none",
              background: "linear-gradient(135deg,#4f46e5,#2563eb)", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(79,70,229,0.42)", transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Preencher Contexto do Negócio →
          </button>
          <button
            onClick={handleClose}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 13,
              border: `1px solid ${th.border}`, background: "transparent",
              color: th.textS, fontSize: 13.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = th.bgCardH)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Agora não
          </button>
        </div>

        {/* Toggle "don't show again" */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, justifyContent: "center", cursor: "pointer" }}
          onClick={() => setSkipForever((v) => !v)}
        >
          <div style={{
            width: 38, height: 21, borderRadius: 11,
            background: skipForever ? th.accent : th.border,
            position: "relative", transition: "background 0.22s", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", top: 3.5,
              left: skipForever ? 20 : 3.5,
              width: 14, height: 14, borderRadius: "50%",
              background: "#fff", transition: "left 0.22s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
            }} />
          </div>
          <span style={{ fontSize: 12.5, color: th.textM, userSelect: "none" }}>Não ver isso novamente</span>
        </div>
      </div>

      <style>{`@keyframes onboardIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.94)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }`}</style>
    </>
  );
}
