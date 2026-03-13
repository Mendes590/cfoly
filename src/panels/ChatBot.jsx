import { useState, useEffect, useRef } from "react";
import { useC, renderMD } from "../core/context.jsx";
import { CHAT, AI_ANALYSIS } from "../core/aiResponses.js";

export function ChatBot({ preload }) {
  const { th, t, lang } = useC();
  const greet = {
    pt: "Olá! Sou seu CFO com IA. Analisei todos os seus dados e estou pronto. O que você quer saber?",
    en: "Hi! I'm your AI CFO. I've analyzed all your data and I'm ready. What would you like to know?",
    es: "¡Hola! Soy su CFO con IA. Analicé todos sus datos y estoy listo. ¿Qué le gustaría saber?",
  };
  const initMsg = preload
    ? [
        { role: "ai", text: greet[lang] || greet.pt },
        { role: "user", text: "Analise este gráfico" },
        { role: "ai", text: AI_ANALYSIS[preload] || AI_ANALYSIS.cashflow },
      ]
    : [{ role: "ai", text: greet[lang] || greet.pt }];

  const [msgs, setMsgs] = useState(initMsg);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSugg, setShowSugg] = useState(!preload);
  const botRef = useRef(null);
  const resp = CHAT[lang] || CHAT.pt;

  useEffect(() => {
    botRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: "user", text }]);
    setInput(""); setTyping(true); setShowSugg(false);
    setTimeout(() => {
      const fallback =
        lang === "pt" ? "Boa pergunta! Com base nos seus dados (receita $120k, margem 29%, runway 87 dias), recomendo focar em crescimento de receita antes de aumentar custos fixos."
        : lang === "es" ? "¡Buena pregunta! Basado en sus datos, recomiendo enfocarse en el crecimiento de ingresos antes de aumentar costos fijos."
        : "Good question! Based on your data ($120k revenue, 29% margin, 87-day runway), focus on revenue growth before increasing fixed costs.";
      setTyping(false);
      setMsgs((p) => [...p, { role: "ai", text: resp[text] || fallback }]);
    }, 1100 + Math.random() * 600);
  };

  const AiAvatar = () => (
    <div style={{
      width: 30, height: 30, borderRadius: 9,
      background: "linear-gradient(135deg,#4f46e5,#2563eb)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, marginTop: 2, boxShadow: "0 2px 8px rgba(79,70,229,0.4)",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 440 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 8px", display: "flex", flexDirection: "column", gap: 12, scrollbarWidth: "thin" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 9 }}>
            {m.role === "ai" && <AiAvatar />}
            <div style={{
              maxWidth: "80%", padding: "11px 14px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? th.chatUser : th.chatAI,
              border: m.role === "ai" ? `1px solid ${th.chatAIB}` : "none",
              color: m.role === "user" ? "#fff" : th.text,
              fontSize: 13, lineHeight: 1.62,
              boxShadow: m.role === "user" ? "0 2px 8px rgba(79,70,229,0.28)" : "none",
            }}>
              {m.role === "ai" ? renderMD(m.text) : m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 9 }}>
            <AiAvatar />
            <div style={{
              background: th.chatAI, border: `1px solid ${th.chatAIB}`,
              borderRadius: "14px 14px 14px 4px", padding: "13px 16px",
              display: "flex", gap: 5,
            }}>
              {[0, 0.18, 0.36].map((d, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: th.accentL, animation: `cDot 1.2s ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={botRef} />
      </div>

      {showSugg && (
        <div style={{ padding: "4px 14px 10px", display: "flex", flexWrap: "wrap", gap: 7 }}>
          {t.chatSugg.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              style={{
                padding: "6px 12px", borderRadius: 20,
                border: `1px solid ${th.borderA}`, background: th.accentBg,
                color: th.accentL, fontSize: 11.5, fontWeight: 500,
                cursor: "pointer", transition: "all 0.14s", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = th.accent; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = th.accentBg; e.currentTarget.style.color = th.accentL; }}
            >{s}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${th.border}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder={t.chatPlaceholder}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 11,
            border: `1px solid ${th.border}`, background: th.bgInput,
            color: th.text, fontSize: 13, outline: "none",
            fontFamily: "inherit", transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = th.accent)}
          onBlur={(e) => (e.target.style.borderColor = th.border)}
        />
        <button
          onClick={() => send(input)}
          style={{
            width: 42, height: 42, borderRadius: 11, border: "none",
            background: input.trim() ? "linear-gradient(135deg,#4f46e5,#2563eb)" : th.bgInput,
            color: input.trim() ? "#fff" : th.textM,
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 16, transition: "all 0.15s", flexShrink: 0,
            boxShadow: input.trim() ? "0 2px 8px rgba(79,70,229,0.35)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >↑</button>
      </div>
    </div>
  );
}
