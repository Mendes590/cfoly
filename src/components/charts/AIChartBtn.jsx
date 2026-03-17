import { useState, useRef, useEffect } from "react";
import { useC, renderMD } from "../../core/context.jsx";
import { AI_ANALYSIS } from "../../core/aiResponses.js";

const POPUP_W = 420;
const POPUP_H = 520;
const GAP = 10;
const PAD = 14;

// Canned follow-up responses — cycle through them to feel varied
const FOLLOW_UPS = [
  "Entendido. Com esse contexto adicional, a análise muda: o risco percebido diminui e a interpretação dos dados precisa considerar esse fator estrutural. Recomendo documentar essa informação nos registros financeiros para futuras revisões.",
  "Faz sentido. Esse tipo de contexto é exatamente o que diferencia uma análise genérica de uma visão real do seu negócio. Ajustando a interpretação: o número isolado pode parecer crítico, mas dentro do seu modelo operacional ele é esperado e gerenciável.",
  "Compreendido. Incorporando essa informação, o cenário melhora. Se esse padrão se mantiver consistente, ele deve ser considerado como parte da sazonalidade do modelo — e não como variação de risco. Vale monitorar a mesma métrica no próximo ciclo para confirmar.",
  "Obrigado por esse detalhe. Revisando a análise: esse custo ou comportamento tem natureza temporária e não deve impactar as projeções de longo prazo. Recomendo criar uma linha de item separada no orçamento para rastrear custos não-recorrentes.",
];

function calcPosition(btnRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = btnRect.right - POPUP_W;
  if (left < PAD) left = PAD;
  if (left + POPUP_W > vw - PAD) left = vw - POPUP_W - PAD;

  let top = btnRect.bottom + GAP;
  let dir = "down";
  if (top + POPUP_H > vh - PAD) {
    top = btnRect.top - POPUP_H - GAP;
    dir = "up";
  }
  if (top < PAD) top = PAD;

  return { top, left, dir };
}

function TypingIndicator({ th }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 13px", background: th.chatAI, border: `1px solid ${th.chatAIB}`, borderRadius: "12px 12px 12px 3px", alignSelf: "flex-start", maxWidth: "80%" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: th.textM, animation: `typingDot 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function AiMessage({ text, th }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, alignSelf: "flex-start", maxWidth: "92%", animation: "msgIn 0.18s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: th.accentL }}>CFOup IA</span>
      </div>
      <div style={{ padding: "10px 13px", background: th.chatAI, border: `1px solid ${th.chatAIB}`, borderRadius: "3px 12px 12px 12px", fontSize: 12.5, color: th.textS, lineHeight: 1.72 }}>
        {renderMD(text)}
      </div>
    </div>
  );
}

function UserMessage({ text, th }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", alignSelf: "flex-end", maxWidth: "85%", animation: "msgIn 0.18s ease both" }}>
      <div style={{ padding: "9px 13px", background: th.chatUser, borderRadius: "12px 3px 12px 12px", fontSize: 12.5, color: "#fff", lineHeight: 1.6 }}>
        {text}
      </div>
    </div>
  );
}

export function AIChartBtn({ analysisKey }) {
  const { th, t, demo, openDemoAI, closeDemoAI, aiPanelKey } = useC();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [input, setInput] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, dir: "down" });
  const [followUpCount, setFollowUpCount] = useState(0);
  const btnRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, aiTyping]);

  const handleOpen = () => {
    if (open) { setOpen(false); return; }
    if (btnRef.current) {
      setPos(calcPosition(btnRef.current.getBoundingClientRect()));
    }
    setOpen(true);
    if (!initialized.current) {
      initialized.current = true;
      setInitialLoading(true);
      setTimeout(() => {
        const analysis = AI_ANALYSIS[analysisKey] || AI_ANALYSIS.cashflow;
        setInitialLoading(false);
        setMessages([{ role: "ai", text: analysis, id: 0 }]);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 900 + Math.random() * 400);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || aiTyping) return;
    setInput("");

    const userMsg = { role: "user", text: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setAiTyping(true);

    setTimeout(() => {
      const reply = FOLLOW_UPS[followUpCount % FOLLOW_UPS.length];
      setFollowUpCount((c) => c + 1);
      setAiTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: reply, id: Date.now() + 1 }]);
    }, 1000 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (
        !btnRef.current?.contains(e.target) &&
        !document.getElementById("ai-popup-" + analysisKey)?.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open, analysisKey]);

  const animName = pos.dir === "down" ? "aiPopupDown" : "aiPopupUp";

  /* ── Demo mode: just a toggle button — the actual AI panel is a screen-level
     overlay inside DemoScreen (no inline popup, no overflow, no scroll jump) ── */
  if (demo) {
    const isActive = aiPanelKey === analysisKey;
    const toggle = () => isActive ? closeDemoAI?.() : openDemoAI?.(analysisKey);
    return (
      <button
        onClick={toggle}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 20,
          border: `1px solid ${isActive ? th.borderA : th.aiBtnBorder}`,
          background: isActive ? th.accentBg : th.aiBtnBg,
          color: isActive ? th.accentL : th.textM,
          fontSize: 11.5, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = th.accentBg; e.currentTarget.style.color = th.accentL; e.currentTarget.style.borderColor = th.borderA; } }}
        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = th.aiBtnBg; e.currentTarget.style.color = th.textM; e.currentTarget.style.borderColor = th.aiBtnBorder; } }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {t.aiBtn}
      </button>
    );
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 20,
          border: `1px solid ${open ? th.borderA : th.aiBtnBorder}`,
          background: open ? th.accentBg : th.aiBtnBg,
          color: open ? th.accentL : th.textM,
          fontSize: 11.5, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = th.accentBg; e.currentTarget.style.color = th.accentL; e.currentTarget.style.borderColor = th.borderA; }}
        onMouseLeave={(e) => { if (!open) { e.currentTarget.style.background = th.aiBtnBg; e.currentTarget.style.color = th.textM; e.currentTarget.style.borderColor = th.aiBtnBorder; } }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {t.aiBtn}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1099 }} />
          <div
            id={"ai-popup-" + analysisKey}
            style={{
              position: "fixed", top: pos.top, left: pos.left,
              width: POPUP_W, height: POPUP_H,
              background: th.solidPanel,
              border: `1px solid ${th.borderA}`,
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.1)",
              zIndex: 1100, display: "flex", flexDirection: "column",
              animation: `${animName} 0.2s cubic-bezier(0.16,1,0.3,1) both`,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${th.border}`, display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(79,70,229,0.4)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: th.text }}>Análise com IA</div>
                <div style={{ fontSize: 10.5, color: th.textM }}>Responda para refinar a análise</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: "auto", background: "none", border: `1px solid ${th.border}`, cursor: "pointer", color: th.textM, fontSize: 16, lineHeight: 1, padding: "3px 7px", borderRadius: 7, transition: "all 0.14s", fontFamily: "inherit" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = th.bgCardH; e.currentTarget.style.color = th.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = th.textM; }}
              >×</button>
            </div>

            {/* Messages area */}
            <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 12, scrollbarWidth: "thin", scrollbarColor: `${th.border} transparent` }}>
              {initialLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: th.accentL, animation: "cPulse 1.2s infinite" }} />
                    <span style={{ fontSize: 11.5, color: th.textM }}>Analisando dados financeiros...</span>
                  </div>
                  {[90, 75, 100, 60, 85, 70].map((w, i) => (
                    <div key={i} style={{ height: 9, borderRadius: 5, background: `linear-gradient(90deg,${th.border},${th.bgCardH},${th.border})`, backgroundSize: "200% 100%", animation: `shimmer 1.4s ${i * 0.1}s infinite`, width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <>
                  {messages.map((m) =>
                    m.role === "ai"
                      ? <AiMessage key={m.id} text={m.text} th={th} />
                      : <UserMessage key={m.id} text={m.text} th={th} />
                  )}
                  {aiTyping && <TypingIndicator th={th} />}
                </>
              )}
            </div>

            {/* Input area */}
            {!initialLoading && (
              <div style={{ padding: "10px 12px", borderTop: `1px solid ${th.border}`, display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0, background: th.solidPanel }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Responder análise..."
                  rows={1}
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 10,
                    border: `1px solid ${th.border}`, background: th.bgInput,
                    color: th.text, fontSize: 12.5, outline: "none",
                    fontFamily: "inherit", resize: "none", lineHeight: 1.5,
                    maxHeight: 80, overflowY: "auto", transition: "border-color 0.15s",
                    scrollbarWidth: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = th.accent)}
                  onBlur={(e) => (e.target.style.borderColor = th.border)}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || aiTyping}
                  style={{
                    width: 34, height: 34, borderRadius: 9, border: "none", flexShrink: 0,
                    background: input.trim() && !aiTyping ? "linear-gradient(135deg,#4f46e5,#2563eb)" : th.bgCardH,
                    color: input.trim() && !aiTyping ? "#fff" : th.textM,
                    cursor: input.trim() && !aiTyping ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", boxShadow: input.trim() && !aiTyping ? "0 2px 8px rgba(79,70,229,0.4)" : "none",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes aiPopupDown { from{opacity:0;transform:translateY(-10px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes aiPopupUp   { from{opacity:0;transform:translateY(10px) scale(0.97)}  to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes typingDot   { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes msgIn       { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
