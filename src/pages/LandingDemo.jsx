/**
 * LandingDemo.jsx — Scaled live preview of the real CFOup app inside the
 * landing-page MacBook frame.
 *
 * KEY STABILITY GUARANTEE:
 *   All AI interactions use a screen-level overlay (DemoAIPanel) that renders
 *   as position:absolute inside the 1080×675 virtual canvas — completely
 *   contained, never overflowing, never touching the outer landing-page scroll.
 *
 * Exports: MacBook (desktop), MobileDemo (mobile fallback)
 */

import { useState, useEffect, useRef } from "react";
import { Ctx, useC, NAV, renderMD } from "../core/context.jsx";
import { THEMES }               from "../core/themes.js";
import { TR }                   from "../core/translations.js";
import { AI_ANALYSIS }          from "../core/aiResponses.js";
import { PageDashboard }        from "./Dashboard.jsx";
import { PageCashFlow }         from "./CashFlow.jsx";
import { PageRevenue }          from "./Revenue.jsx";
import { PageExpenses }         from "./Expenses.jsx";
import { PageCustomers }        from "./Customers.jsx";
import { PageInsights }         from "./Insights.jsx";
import { PageValuation }        from "./Valuation.jsx";
import { PageReport }           from "./Report.jsx";
import { PageContext }          from "./BusinessContext.jsx";
import { PageIntegrations }     from "./Integrations.jsx";
import { PageSettings }         from "./Settings.jsx";

/* ─── constants ─────────────────────────────────────────────────────────── */
const DEMO_USER = {
  name: "Alex Johnson", role: "CEO", email: "alex@demo.com",
  phone: "+1 555 000 0000", company: "DemoTech Inc",
  cnpj: "00.000.000/0001-00", sector: "SaaS", employees: "10-50",
  initials: "AJ", avatar: null,
};

/* Virtual canvas — 16:10 to match the screen aspect ratio */
const VW = 1080;
const VH = 675;

const CYCLE    = ["dashboard", "cashflow", "customers", "insights"];
const CYCLE_MS = { dashboard: 6500, cashflow: 5500, customers: 5000, insights: 7000 };

const AI_FOLLOWUPS = [
  "That context changes the picture. At this growth rate the metric normalises within two cycles — worth monitoring but not alarming. Flag it in your next board report.",
  "Good follow-up. Factoring in your current trajectory, the situation improves in ~45 days if revenue holds. I'd review again after month-close before acting.",
  "Understood. This level is within expected range for your stage and model. The key driver to watch is the week-over-week burn trend, not the absolute number.",
];

/* ─── hint badge ─────────────────────────────────────────────────────────── */
const HINTS = [
  "Click any section in the sidebar",
  "Try 'Analyze with AI' on a chart",
  "Hover over the Cash Flow chart",
  "Ask the AI assistant a question",
  "Explore Revenue, Expenses & more",
  "See the full executive report",
];

function HintBadge() {
  const [idx,  setIdx]  = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % HINTS.length); setFade(true); }, 280);
    }, 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
        borderRadius: 24, padding: "7px 18px",
        opacity: fade ? 1 : 0, transition: "opacity 0.28s ease",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "dPulse 2s infinite" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(148,163,184,0.8)" }}>{HINTS[idx]}</span>
      </div>
    </div>
  );
}

/* ─── sidebar nav item ───────────────────────────────────────────────────── */
function DemoNavItem({ id, icon, label, active, th, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px", borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? th.sideActive : "transparent",
        color: active ? th.sideTextA : th.sideText,
        fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 400,
        width: "100%", transition: "background 0.14s, color 0.14s", position: "relative",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(148,163,184,0.07)"; e.currentTarget.style.color = "rgba(248,250,252,0.7)"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = th.sideText; } }}
    >
      {active && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: "0 3px 3px 0", background: th.accent }} />}
      <span style={{ fontSize: 15, flexShrink: 0, opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    </button>
  );
}

/* ─── screen-level AI panel (the KEY stability fix) ──────────────────────
   Renders as position:absolute inside the 1080×675 virtual canvas.
   It NEVER escapes the canvas, NEVER affects the scroll container, NEVER
   causes the landing page to move. ─────────────────────────────────────── */
function DemoAIPanel({ analysisKey, onClose }) {
  const { th } = useC();
  const analysis = AI_ANALYSIS[analysisKey] || AI_ANALYSIS.cashflow;

  const [msgs,    setMsgs]    = useState([{ role: "ai", text: analysis }]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const [fuIdx,   setFuIdx]   = useState(0);
  const [loading, setLoading] = useState(true);
  const msgsRef = useRef(null);

  /* Simulate initial analysis loading */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  /* Scroll only the messages container — never touches ancestor scrollers */
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, typing, loading]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [...prev, { role: "ai", text: AI_FOLLOWUPS[fuIdx % AI_FOLLOWUPS.length] }]);
      setFuIdx(i => i + 1);
    }, 1000 + Math.random() * 500);
  };

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    /* Absolutely positioned inside the 1080×675 canvas — fully contained */
    <div style={{
      position: "absolute", top: 56, right: 0, bottom: 0, width: 380,
      background: th.solidPanel, borderLeft: `1px solid ${th.borderA}`,
      display: "flex", flexDirection: "column", zIndex: 500,
      boxShadow: "-12px 0 40px rgba(0,0,0,0.45)",
      animation: "demoAIIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${th.border}`, display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(79,70,229,0.4)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: th.text }}>AI Analysis</div>
          <div style={{ fontSize: 10.5, color: th.textM }}>Ask follow-up questions</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: `1px solid ${th.border}`, cursor: "pointer", color: th.textM, fontSize: 16, lineHeight: 1, padding: "3px 8px", borderRadius: 7, fontFamily: "inherit", transition: "all 0.14s" }}
          onMouseEnter={e => { e.currentTarget.style.background = th.bgCardH; e.currentTarget.style.color = th.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = th.textM; }}
        >×</button>
      </div>

      {/* Messages */}
      <div ref={msgsRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 12, scrollbarWidth: "thin", scrollbarColor: `${th.border} transparent` }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: th.accentL, animation: "cPulse 1.2s infinite" }} />
              <span style={{ fontSize: 12, color: th.textM }}>Analysing your financial data…</span>
            </div>
            {[92, 78, 100, 65, 85].map((w, i) => (
              <div key={i} style={{ height: 9, borderRadius: 5, background: th.border, width: `${w}%`, animation: `shimmer 1.6s ${i * 0.12}s infinite`, backgroundImage: `linear-gradient(90deg,${th.border} 0%,${th.bgCardH} 50%,${th.border} 100%)`, backgroundSize: "200% 100%" }} />
            ))}
          </div>
        ) : (
          <>
            {msgs.map((m, i) => m.role === "ai" ? (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 0, alignSelf: "flex-start", maxWidth: "95%", animation: "demoMsgIn 0.18s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: th.accentL }}>CFOup AI</span>
                </div>
                <div style={{ padding: "10px 12px", background: th.chatAI, border: `1px solid ${th.chatAIB}`, borderRadius: "3px 12px 12px 12px", fontSize: 12, color: th.textS, lineHeight: 1.7 }}>
                  {renderMD(m.text)}
                </div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", alignSelf: "flex-end", maxWidth: "88%", animation: "demoMsgIn 0.18s ease both" }}>
                <div style={{ padding: "9px 12px", background: th.chatUser, borderRadius: "12px 3px 12px 12px", fontSize: 12, color: "#fff", lineHeight: 1.6 }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", background: th.chatAI, border: `1px solid ${th.chatAIB}`, borderRadius: "12px 12px 12px 3px", alignSelf: "flex-start" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: th.textM, animation: `typingDot 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      {!loading && (
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${th.border}`, display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0, background: th.solidPanel }}>
          <textarea
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Ask a follow-up question…" rows={1}
            style={{ flex: 1, padding: "8px 11px", borderRadius: 9, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 12, outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.5, scrollbarWidth: "none" }}
            onFocus={e => (e.target.style.borderColor = th.accent)}
            onBlur={e => (e.target.style.borderColor = th.border)}
          />
          <button
            onClick={send} disabled={!input.trim() || typing}
            style={{ width: 32, height: 32, borderRadius: 9, border: "none", flexShrink: 0, background: input.trim() && !typing ? "linear-gradient(135deg,#4f46e5,#2563eb)" : th.bgCardH, color: input.trim() && !typing ? "#fff" : th.textM, cursor: input.trim() && !typing ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── real app shell inside the virtual canvas ───────────────────────────── */
const PAGES = {
  dashboard:    PageDashboard,
  cashflow:     PageCashFlow,
  revenue:      PageRevenue,
  expenses:     PageExpenses,
  customers:    PageCustomers,
  insights:     PageInsights,
  valuation:    PageValuation,
  report:       PageReport,
  context:      PageContext,
  integrations: PageIntegrations,
  settings:     PageSettings,
};

function DemoShell({ page, setPage }) {
  const { th, t } = useC();
  const PageComp = PAGES[page] || PageDashboard;
  const pageScrollRef = useRef(null);

  /* Reset scroll to top whenever the active page changes */
  useEffect(() => {
    if (pageScrollRef.current) pageScrollRef.current.scrollTop = 0;
  }, [page]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: th.bg, color: th.text, overflow: "hidden", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: 200, flexShrink: 0, background: th.bgSidebar, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(148,163,184,0.07)" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 14px", borderBottom: "1px solid rgba(148,163,184,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 12px rgba(37,99,235,0.5)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>CFOup</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em" }}>{t.tagline}</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 6px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {NAV.map(item => (
            <DemoNavItem key={item.id} id={item.id} icon={item.icon} label={t.nav[item.id]} active={page === item.id} th={th} onClick={setPage} />
          ))}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(148,163,184,0.07)", fontSize: 10, color: "rgba(148,163,184,0.25)", fontWeight: 600, letterSpacing: "0.05em" }}>v0.1.0 BETA</div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 56, background: th.topbar, borderBottom: `1px solid ${th.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, flexShrink: 0, zIndex: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: th.text, letterSpacing: "-0.02em" }}>{t.nav[page]}</div>
            <div style={{ fontSize: 10.5, color: th.textM, marginTop: 1 }}>{t.periodFull}</div>
          </div>
          <div style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${th.border}`, background: th.bgCard, fontSize: 11.5, fontWeight: 600, color: th.textS, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ color: th.accentL }}>◷</span> {t.period}
          </div>
          <div onClick={() => setPage("insights")} style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${th.aiBtnBorder}`, background: th.aiBtnBg, fontSize: 11.5, fontWeight: 700, color: th.accentL, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            AI CFO
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${th.border}`, background: th.bgCard, color: th.textS, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 14, flexShrink: 0 }}>
            🔔
            <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: th.red, border: `2px solid ${th.topbar}` }} />
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 12px rgba(37,99,235,0.45)" }}>
            {DEMO_USER.initials}
          </div>
        </div>

        {/* Page content — overscroll-behavior:contain stops wheel events escaping */}
        <div ref={pageScrollRef} style={{ flex: 1, overflowY: "auto", padding: "22px 24px", scrollbarWidth: "thin", scrollbarColor: "rgba(148,163,184,0.18) transparent", overscrollBehavior: "contain" }}>
          <PageComp />
        </div>
      </div>
    </div>
  );
}

/* ─── scaled demo screen ─────────────────────────────────────────────────── */
function DemoScreen() {
  const containerRef = useRef(null);
  const [scale,     setScale]     = useState(0.58);
  const [page,      setPage]      = useState("dashboard");
  const [userActed, setUserActed] = useState(false);
  /* aiPanel: null | { key: string }  — drives the screen-level AI overlay */
  const [aiPanel,   setAiPanel]   = useState(null);

  /* Scale to fill container width */
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => setScale(el.offsetWidth / VW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Auto-cycle until user interacts */
  useEffect(() => {
    if (userActed) return;
    const idx = CYCLE.indexOf(page);
    const ms  = CYCLE_MS[page] || 5500;
    const tid = setTimeout(() => setPage(CYCLE[(idx < 0 ? 0 : idx + 1) % CYCLE.length]), ms);
    return () => clearTimeout(tid);
  }, [page, userActed]);

  const handleSetPage = id => { setPage(id); setUserActed(true); setAiPanel(null); };
  const openDemoAI   = key => { setAiPanel({ key }); setUserActed(true); };
  const closeDemoAI  = ()  => setAiPanel(null);

  const th = THEMES.dark;
  const t  = TR.en;

  const ctxValue = {
    th, t,
    lang: "en", setLang: () => {},
    themeName: "dark", setTheme: () => {},
    user: DEMO_USER, setUser: () => {},
    page, setPage: handleSetPage,
    demo: true,
    openDemoAI, closeDemoAI,
    aiPanelKey: aiPanel?.key ?? null,
  };

  /* Prevent focus-induced page scroll: save Y before click, restore after. */
  const savedY = useRef(0);
  const onMouseDown     = () => { savedY.current = window.scrollY; };
  const onFocusCapture  = () => {
    const y = savedY.current || window.scrollY;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
  };
  /* Prevent wheel events from reaching the outer page */
  const onWheel = e => e.stopPropagation();

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
      onMouseDown={onMouseDown}
      onFocusCapture={onFocusCapture}
      onWheel={onWheel}
    >
      {/* 1080×675 virtual canvas — transform:scale keeps layout footprint stable */}
      <div style={{ width: VW, height: VH, transform: `scale(${scale})`, transformOrigin: "top left", overflow: "hidden", position: "relative" }}>
        <Ctx.Provider value={ctxValue}>
          <DemoShell page={page} setPage={handleSetPage} />
          {/* AI overlay — always inside the canvas, never overflows it */}
          {aiPanel && <DemoAIPanel analysisKey={aiPanel.key} onClose={closeDemoAI} />}
        </Ctx.Provider>
      </div>
    </div>
  );
}

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const DEMO_CSS = `
  @keyframes lfloat     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes dOrb       { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.08)} 66%{transform:translate(-15px,25px) scale(0.95)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes dPulse     { 0%,100%{opacity:0.45} 50%{opacity:1} }
  @keyframes demoAIIn   { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes demoMsgIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cPulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes typingDot  { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
  @keyframes aiPopupDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aiPopupUp  { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  .lfloat { animation:lfloat 5.5s ease-in-out infinite }
`;

/* ════════════════════════════════════════════════════════
   MacBook frame export
   ════════════════════════════════════════════════════════ */
export function MacBook() {
  return (
    <div>
      <style>{DEMO_CSS}</style>
      <HintBadge />

      <div style={{ position: "relative" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", inset: "-18% -12%", background: "radial-gradient(ellipse at 50% 55%, rgba(37,99,235,0.13) 0%, rgba(34,211,238,0.05) 45%, transparent 70%)", pointerEvents: "none", animation: "dOrb 18s ease-in-out infinite" }} />

        <div className="lfloat" style={{ position: "relative", width: "100%", filter: "drop-shadow(0 48px 88px rgba(0,0,0,0.72))" }}>
          {/* Lid */}
          <div style={{ background: "linear-gradient(175deg,#2E2E34 0%,#1C1C22 100%)", borderRadius: "16px 16px 3px 3px", padding: "11px 11px 2px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5)" }}>
            {/* Camera notch */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 13, marginBottom: 2 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2A2A30", border: "1px solid rgba(255,255,255,0.05)" }} />
            </div>
            {/* Screen glass — 16:10, contains the live real app */}
            <div style={{ borderRadius: "6px 6px 0 0", overflow: "hidden", aspectRatio: "16/10", position: "relative", background: THEMES.dark.bg, lineHeight: 0 }}>
              <DemoScreen />
              {/* Glare */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(180deg,rgba(255,255,255,0.027) 0%,transparent 100%)", pointerEvents: "none" }} />
            </div>
          </div>
          {/* Hinge */}
          <div style={{ height: 4, background: "linear-gradient(180deg,#0E0E12 0%,#1A1A20 100%)" }} />
          {/* Base */}
          <div style={{ background: "linear-gradient(180deg,#2A2A30 0%,#1E1E24 100%)", borderRadius: "0 0 10px 10px", height: 21, position: "relative", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 0 rgba(0,0,0,0.5)" }}>
            <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 86, height: 12, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5 }} />
          </div>
          {/* Shadow */}
          <div style={{ width: "70%", height: 7, margin: "0 auto", background: "rgba(0,0,0,0.55)", filter: "blur(10px)", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MobileDemo — mobile fallback
   ════════════════════════════════════════════════════════ */
export function MobileDemo() {
  const t = TR.en;
  return (
    <div style={{ padding: "0 4px" }}>
      <style>{DEMO_CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 24, padding: "6px 18px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "dPulse 2s infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(148,163,184,0.75)" }}>Interactive demo</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Revenue",    value: "$120k", trend: "+8%",  pos: true },
          { label: "Net Margin", value: "29%",   trend: "+2%",  pos: true },
          { label: "Runway",     value: "87 days",trend: null        },
          { label: "EBITDA",     value: "$35k",  trend: "+5%",  pos: true },
        ].map(k => (
          <div key={k.label} style={{ background: "rgba(12,21,42,0.92)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(148,163,184,0.09)" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.03em" }}>{k.value}</div>
            {k.trend && <div style={{ fontSize: 11, color: k.pos ? "#10B981" : "#F87171", fontWeight: 700 }}>{k.trend}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(12,21,42,0.92)", borderRadius: 14, padding: "18px", border: "1px solid rgba(148,163,184,0.09)", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Insights</div>
          <div style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", fontSize: 11, fontWeight: 700, color: "#22D3EE" }}>Live</div>
        </div>
        {t.insCards.slice(0, 3).map((ins, i) => (
          <div key={i} style={{ padding: "9px 0", borderBottom: i < 2 ? "1px solid rgba(148,163,184,0.07)" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{ins.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#F8FAFC", marginBottom: 2 }}>{ins.title}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{ins.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 12.5, color: "rgba(148,163,184,0.6)" }}>
        Open on desktop to see the full interactive demo ↑
      </div>
    </div>
  );
}
