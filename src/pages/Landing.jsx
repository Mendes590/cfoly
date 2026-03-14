import { useState, useEffect, useRef } from "react";
import { MacBook, MobileDemo } from "./LandingDemo.jsx";

/* ─── Design tokens ─── */
const C = {
  bg: "#070C18", bgCard: "#0C1528", bgCard2: "#101D35", bgDeep: "#040810",
  blue: "#2563EB", blueL: "#60A5FA", blueXL: "#BFDBFE",
  cyan: "#22D3EE", cyanL: "#67E8F9",
  green: "#10B981", red: "#F87171", amber: "#FBBF24",
  text: "#F8FAFC", textS: "#94A3B8",
  textM: "rgba(148,163,184,0.45)",
  border: "rgba(148,163,184,0.09)", borderB: "rgba(37,99,235,0.25)",
  blueBg: "rgba(37,99,235,0.1)", cyanBg: "rgba(34,211,238,0.08)",
};

const W = "1160px";

/* ─── Global CSS: keyframes + all responsive breakpoints ─── */
const LAND_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes lFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes lOrb     { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.08)} 66%{transform:translate(-15px,25px) scale(0.95)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes lPulse   { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes lGrad    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes lChatIn  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lChatInR { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lMenuIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .lfu  { animation:lFadeUp .72s       ease both }
  .lfu1 { animation:lFadeUp .72s .1s   ease both }
  .lfu2 { animation:lFadeUp .72s .2s   ease both }
  .lfu3 { animation:lFadeUp .72s .3s   ease both }
  .lfu4 { animation:lFadeUp .72s .4s   ease both }
  .lfloat { animation:lFloat 5.5s ease-in-out infinite }
  .lorb   { animation:lOrb   16s  ease-in-out infinite }

  .lCard { transition:transform .2s,border-color .2s,box-shadow .25s }
  .lCard:hover { transform:translateY(-4px)!important; border-color:rgba(37,99,235,0.28)!important; box-shadow:0 28px 64px rgba(0,0,0,0.55)!important }
  .lInt { transition:all .18s }
  .lInt:hover { background:rgba(37,99,235,0.07)!important; border-color:rgba(37,99,235,0.28)!important }
  .lLink { transition:color .15s; cursor:pointer }
  .lLink:hover { color:#F8FAFC!important }
  .lBtnP { transition:all .18s }
  .lBtnP:hover { background:#3B82F6!important; transform:translateY(-1px); box-shadow:0 12px 40px rgba(37,99,235,0.55)!important }
  .lBtnS { transition:all .18s }
  .lBtnS:hover { background:rgba(148,163,184,0.1)!important; border-color:rgba(148,163,184,0.22)!important }
  .lBtnG { transition:all .18s }
  .lBtnG:hover { background:rgba(34,211,238,0.12)!important; border-color:rgba(34,211,238,0.45)!important }
  .lPrompt { transition:all .18s; cursor:pointer }
  .lPrompt:hover { border-color:rgba(37,99,235,0.35)!important; background:rgba(37,99,235,0.08)!important }
  .lStep { transition:transform .2s }
  .lStep:hover { transform:translateY(-3px) }

  /* ── Visibility helpers ── */
  .deskOnly { display:block }
  .mobOnly  { display:none  }

  /* ── Nav ── */
  .navLinks { display:flex; gap:28px }
  .navBtns  { display:flex; gap:8px; align-items:center }
  .hamburger { display:none; background:none; border:none; cursor:pointer; color:#94A3B8; padding:6px }
  .mobileMenu { display:none }
  .mobileMenu.open { display:block; animation:lMenuIn 0.2s ease both }

  /* ── Layout grids ── */
  .heroGrid  { display:grid; grid-template-columns:0.62fr 1.38fr; gap:36px; align-items:center }
  .howGrid   { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; position:relative }
  .chatGrid  { display:grid; grid-template-columns:5fr 7fr; gap:64px; align-items:flex-start }
  .featGrid  { display:grid; grid-template-columns:repeat(3,1fr); gap:18px }
  .benGrid   { display:grid; grid-template-columns:repeat(3,1fr); gap:24px }
  .statsGrid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px }
  .trustGrid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px }
  .intGrid   { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; max-width:720px; margin:0 auto }

  /* ── Typography scale classes ── */
  .heroH1 { font-size:60px }
  .secH2  { font-size:40px }
  .ctaH2  { font-size:52px }

  /* ── Section padding ── */
  .secPad { padding:88px 32px }
  .navPad { padding:0 32px }

  /* ════════════════════════════════════
     RESPONSIVE — 1100px (tablet landscape)
     ════════════════════════════════════ */
  @media(max-width:1100px) {
    .chatGrid { gap:40px !important }
  }

  /* ════════════════════════════════════
     RESPONSIVE — 900px (tablet portrait)
     ════════════════════════════════════ */
  @media(max-width:900px) {
    .heroH1  { font-size:46px !important }
    .secH2   { font-size:34px !important }
    .ctaH2   { font-size:42px !important }
    .chatGrid { grid-template-columns:1fr !important; gap:36px !important }
    .howGrid  { grid-template-columns:repeat(2,1fr) !important }
  }

  /* ════════════════════════════════════
     RESPONSIVE — 860px (hide MacBook, show mobile demo)
     ════════════════════════════════════ */
  @media(max-width:860px) {
    .deskOnly { display:none !important }
    .mobOnly  { display:block !important }
    .heroGrid { grid-template-columns:1fr !important; gap:36px !important; padding:96px 24px 56px !important }
    .navLinks { display:none !important }
    .hamburger { display:block !important }
  }

  /* ════════════════════════════════════
     RESPONSIVE — 760px (compact tablet)
     ════════════════════════════════════ */
  @media(max-width:760px) {
    .secH2   { font-size:30px !important }
    .ctaH2   { font-size:36px !important }
    .secPad  { padding:64px 24px !important }
    .navPad  { padding:0 20px !important }
    .featGrid  { grid-template-columns:repeat(2,1fr) !important }
    .benGrid   { grid-template-columns:1fr !important; gap:32px !important }
    .statsGrid { grid-template-columns:repeat(2,1fr) !important }
    .trustGrid { grid-template-columns:1fr !important }
    .intGrid   { grid-template-columns:repeat(2,1fr) !important; max-width:100% !important }
    .howGrid   { grid-template-columns:repeat(2,1fr) !important }
    .navBtns .signIn { display:none }
  }

  /* ════════════════════════════════════
     RESPONSIVE — 560px (large phone)
     ════════════════════════════════════ */
  @media(max-width:560px) {
    .heroH1  { font-size:36px !important }
    .secH2   { font-size:26px !important }
    .ctaH2   { font-size:30px !important }
    .heroGrid { padding:88px 16px 44px !important; gap:28px !important }
    .secPad  { padding:52px 16px !important }
    .navPad  { padding:0 16px !important }
    .featGrid  { grid-template-columns:1fr !important }
    .howGrid   { grid-template-columns:1fr !important }
    .statsGrid { grid-template-columns:repeat(2,1fr) !important }
    .intGrid   { grid-template-columns:repeat(2,1fr) !important }
  }

  /* ════════════════════════════════════
     RESPONSIVE — 400px (small phone)
     ════════════════════════════════════ */
  @media(max-width:400px) {
    .heroH1 { font-size:30px !important }
    .ctaH2  { font-size:26px !important }
    .secPad { padding:44px 14px !important }
  }
`;

/* ─── Shared pill badge ─── */
function Pill({ label, color = C.blueL, bg = C.blueBg }) {
  return (
    <div style={{ display: "inline-block", background: bg, border: `1px solid ${color}35`, borderRadius: 20, padding: "5px 14px" }}>
      <span style={{ fontSize: 11.5, color, fontWeight: 600, letterSpacing: "0.01em" }}>{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════════════════ */
function Nav({ onGetStarted, scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled || menuOpen ? "rgba(7,12,24,0.97)" : "transparent",
      backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
      borderBottom: scrolled || menuOpen ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div className="navPad" style={{ maxWidth: W, margin: "0 auto", height: 62, display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
          </div>
          <span style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>CFOly</span>
        </div>

        {/* Desktop nav links */}
        <nav className="navLinks" style={{ flex: 1 }}>
          {["Product", "How it works", "Features", "Pricing"].map(l => (
            <span key={l} className="lLink" style={{ fontSize: 13.5, color: C.textS, fontWeight: 500 }}>{l}</span>
          ))}
        </nav>

        <div style={{ flex: 1 }} className="mobileOnly" />

        {/* Desktop CTA buttons */}
        <div className="navBtns" style={{ flexShrink: 0 }}>
          <button onClick={onGetStarted} className="lBtnS signIn" style={{ padding: "7px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign in</button>
          <button onClick={onGetStarted} className="lBtnP" style={{ padding: "7px 20px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}>Get Started</button>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          style={{ flexShrink: 0 }}
          aria-label="Menu"
        >
          {menuOpen
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobileMenu open" style={{
          borderTop: `1px solid ${C.border}`, padding: "16px 20px 20px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {["Product", "How it works", "Features", "Pricing"].map(l => (
            <button key={l} style={{ textAlign: "left", background: "none", border: "none", padding: "10px 4px", fontSize: 15, color: C.textS, fontFamily: "inherit", cursor: "pointer", fontWeight: 500, borderBottom: `1px solid ${C.border}` }}
              onClick={() => setMenuOpen(false)}
            >{l}</button>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={() => { onGetStarted(); setMenuOpen(false); }} style={{ flex: 1, padding: "11px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign in</button>
            <button onClick={() => { onGetStarted(); setMenuOpen(false); }} className="lBtnP" style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", background: C.blue, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Get Started</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HERO — scroll-safe MacBook wrapper stops focus-scroll jumps
   ════════════════════════════════════════════════════════ */
function Hero({ onGetStarted }) {
  /* Save scroll position before any click inside the demo propagates focus,
     then restore it so the page never jumps. */
  const demoWrapRef = useRef(null);
  const savedScrollY = useRef(0);

  const handleDemoMouseDown = () => {
    savedScrollY.current = window.scrollY;
  };

  const handleDemoFocusCapture = () => {
    const y = savedScrollY.current || window.scrollY;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
  };

  return (
    <div style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* BG orbs */}
      <div className="lorb" style={{ position: "absolute", top: "10%", left: "5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(148,163,184,0.024) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.024) 1px,transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />

      <div className="heroGrid secPad" style={{ maxWidth: W, margin: "0 auto", width: "100%" }}>
        {/* Left: copy */}
        <div>
          <div className="lfu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.blueBg, border: `1px solid ${C.borderB}`, borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.blueL, animation: "lPulse 2s infinite", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: C.blueL, fontWeight: 600 }}>AI-Powered Financial Intelligence</span>
          </div>

          <h1 className="lfu1 heroH1" style={{ fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.04em", color: C.text, margin: "0 0 20px" }}>
            Ask your<br />
            <span style={{ background: `linear-gradient(130deg,${C.blue} 0%,${C.blueL} 45%,${C.cyan} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 200%", animation: "lGrad 5s ease infinite" }}>finances anything</span>
          </h1>

          <p className="lfu2" style={{ fontSize: 17, color: C.textS, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>
            CFOly connects your financial data, analyzes it with AI, and lets you ask questions in plain language — so you make decisions with real confidence.
          </p>

          <div className="lfu3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={onGetStarted} className="lBtnP" style={{ padding: "13px 30px", borderRadius: 10, border: "none", background: C.blue, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 32px rgba(37,99,235,0.45)" }}>
              Get Started Free
            </button>
            <button onClick={onGetStarted} className="lBtnS" style={{ padding: "13px 28px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(148,163,184,0.05)", color: C.text, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              See Demo
            </button>
          </div>

          <div className="lfu4" style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40, paddingTop: 28, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["#2563EB","#3B82F6","#60A5FA","#22D3EE"].map((bg, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: bg, border: "2px solid #070C18", marginLeft: i ? -9 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>500+ companies</div>
              <div style={{ fontSize: 11.5, color: C.textS }}>making smarter decisions</div>
            </div>
            <div style={{ width: 1, height: 28, background: C.border }} />
            <div>
              <div style={{ display: "flex", gap: 1, marginBottom: 3 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: C.amber, fontSize: 12 }}>★</span>)}
              </div>
              <div style={{ fontSize: 11.5, color: C.textS }}>4.9 average rating</div>
            </div>
          </div>
        </div>

        {/* Right: notebook demo — fully scroll-safe */}
        <div
          ref={demoWrapRef}
          className="deskOnly"
          onMouseDown={handleDemoMouseDown}
          onFocusCapture={handleDemoFocusCapture}
          style={{ minWidth: 0 }}
        >
          <MacBook />
        </div>

        {/* Mobile: stacked demo */}
        <div className="mobOnly" style={{ display: "none" }}>
          <MobileDemo />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   LOGOS BAR
   ════════════════════════════════════════════════════════ */
function LogosBar() {
  const logos = ["Excel", "Stripe", "QuickBooks", "PostgreSQL", "SAP", "Google Sheets"];
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "20px 20px" }}>
      <div style={{ maxWidth: W, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: C.textM, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>Connects with</span>
        <div style={{ width: 1, height: 20, background: C.border, flexShrink: 0 }} />
        {logos.map(l => (
          <div key={l} style={{ padding: "5px 14px", borderRadius: 7, border: `1px solid ${C.border}`, background: "rgba(148,163,184,0.04)", fontSize: 12, fontWeight: 600, color: C.textS }}>{l}</div>
        ))}
        <div style={{ padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, color: C.textM }}>+ more via API</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════════════════════ */
const STEPS = [
  { n: "01", color: C.blue,  title: "Connect your data",                       desc: "Import data from Excel, your ERP, Stripe, or any database. CFOly unifies your financial picture in minutes.",          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
  { n: "02", color: C.cyan,  title: "Add business context",                     desc: "Tell CFOly about your team, goals, and growth stage. The AI uses this to give you context-aware answers.",           icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { n: "03", color: C.blueL, title: "Ask anything or get proactive insights",   desc: "Ask \"Can I hire?\" or \"How's my runway?\" — or let CFOly surface alerts before you even ask.",                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { n: "04", color: C.green, title: "Decide with confidence",                   desc: "Get AI recommendations backed by your real data. No guessing. No spreadsheet gymnastics. Just decisions.",           icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
];

function HowItWorks() {
  return (
    <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Pill label="How it works" />
          <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 12px" }}>
            From raw data to<br />clear decisions — in minutes
          </h2>
          <p style={{ fontSize: 16, color: C.textS, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            CFOly transforms your messy financial data into AI-powered clarity.
          </p>
        </div>

        <div className="howGrid">
          {/* Connecting line — hidden on mobile via grid width */}
          <div style={{ position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg,${C.blue},${C.cyan},${C.blueL},${C.green})`, opacity: 0.25, pointerEvents: "none" }} />
          {STEPS.map((s, i) => (
            <div key={i} className="lStep lCard" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: s.color + "18", border: `1px solid ${s.color}28`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 800, color: s.color, opacity: 0.5, letterSpacing: "0.05em" }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: C.textS, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   AI CHAT SECTION
   ════════════════════════════════════════════════════════ */
const CHAT_CONVOS = [
  { q: "Can I hire another salesperson?",     tag: "Hiring decision",  a: "Based on your current burn of R$85k/month and runway of 87 days, hiring now is tight. However, your revenue is growing 8% MoM. If Q2 continues this trajectory, a hire in 45 days becomes financially sound. I recommend waiting for this month's close to confirm." },
  { q: "How long is my runway?",              tag: "Cashflow",         a: "At your current burn rate of R$85k/month, you have 87 days of runway (≈ 2.9 months). Under the optimistic scenario — sustained 8% MoM growth — this extends to 4.3 months. I'd target 6 months before your next fundraise or major hire." },
  { q: "Is my revenue too concentrated?",     tag: "Risk analysis",    a: "Yes — Acme Corp represents 34% of your revenue, which exceeds the 25% safe threshold. A churn from this single client would remove R$41k/month from your top line. I'd prioritize diversification this quarter to reduce concentration below 20%." },
  { q: "Why did expenses increase this month?",tag: "Expense analysis", a: "Expenses grew 12% vs. last month, primarily driven by: (1) infrastructure costs up 18% — likely the new cloud deployment, and (2) SaaS tools up 22% following your team expansion. Payroll remains stable. The increase appears intentional but should be monitored." },
];

function AIChatSection() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        <div className="chatGrid">
          {/* Left */}
          <div style={{ paddingTop: 8 }}>
            <Pill label="AI CFO Copilot" color={C.cyan} bg={C.cyanBg} />
            <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 14px", lineHeight: 1.1 }}>
              Ask your<br />financial data<br />anything
            </h2>
            <p style={{ fontSize: 15.5, color: C.textS, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 360 }}>
              CFOly understands your full financial context and responds like a senior CFO — with data-backed answers you can act on right now.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHAT_CONVOS.map((c, i) => (
                <button key={i} className="lPrompt" onClick={() => setActive(i)}
                  style={{ textAlign: "left", background: i === active ? C.blueBg : "rgba(148,163,184,0.03)", border: `1px solid ${i === active ? C.borderB : C.border}`, borderRadius: 11, padding: "12px 16px", fontFamily: "inherit" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: i === active ? C.blueL : C.textM, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{c.tag}</div>
                  <div style={{ fontSize: 13.5, color: i === active ? C.blueXL : C.textS, fontWeight: i === active ? 600 : 500, lineHeight: 1.4 }}>{c.q}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat UI */}
          <div style={{ background: C.bgCard, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.08)" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 11, background: "rgba(4,8,16,0.5)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.blueBg, border: `1px solid ${C.borderB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.blueL} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>CFOly AI</div>
                <div style={{ fontSize: 10.5, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", animation: "lPulse 2s infinite" }} /> Online · analyzing your data
                </div>
              </div>
              <div style={{ padding: "3px 10px", borderRadius: 6, background: C.cyanBg, border: `1px solid rgba(34,211,238,0.2)`, fontSize: 10, fontWeight: 700, color: C.cyan }}>AI CFO</div>
            </div>
            <div style={{ padding: "20px 20px 0" }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: C.textM, background: "rgba(148,163,184,0.06)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px" }}>Connected to TechBrasil Ltda · Q1 2026</span>
              </div>
              <div key={`u-${active}`} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, animation: "lChatInR 0.3s ease both" }}>
                <div style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", borderRadius: "14px 14px 4px 14px", padding: "11px 16px", maxWidth: "82%", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
                  <span style={{ fontSize: 13.5, color: "#fff", fontWeight: 500, lineHeight: 1.5 }}>{CHAT_CONVOS[active].q}</span>
                </div>
              </div>
              <div key={`a-${active}`} style={{ display: "flex", gap: 10, marginBottom: 20, animation: "lChatIn 0.35s 0.1s ease both" }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: C.blueBg, border: `1px solid ${C.borderB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.blueL} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                </div>
                <div style={{ background: "rgba(148,163,184,0.06)", border: `1px solid ${C.border}`, borderRadius: "4px 14px 14px 14px", padding: "13px 16px", flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.blueL, marginBottom: 8 }}>CFOly AI · {CHAT_CONVOS[active].tag}</div>
                  <span style={{ fontSize: 13.5, color: C.text, lineHeight: 1.65 }}>{CHAT_CONVOS[active].a}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ background: "rgba(148,163,184,0.05)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: C.textM, flex: 1 }}>Ask your financial data anything…</span>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(37,99,235,0.4)", cursor: "pointer" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FEATURES
   ════════════════════════════════════════════════════════ */
const FEATURES = [
  { color: C.blueL, title: "Real-time financial dashboards",   desc: "Revenue, expenses, margin, runway — unified in one clear, always-current view. No manual updates.",              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
  { color: C.cyan,  title: "AI analysis on every chart",        desc: "Click Analyze with AI on any chart to get an instant explanation of what happened and what to do.",              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M11 8v3l2 2"/></svg> },
  { color: C.amber, title: "Customer concentration risk",        desc: "Identify over-reliance on single clients before it becomes a business threat. Get early warnings.",             icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { color: C.green, title: "Cashflow & runway forecasting",      desc: "Pessimistic, projected, and optimistic scenarios so you always know where you stand before you need to.",      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
  { color: C.blueL, title: "Business context-aware AI",          desc: "CFOly learns your team size, goals, and growth stage to give advice that actually fits your situation.",       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { color: C.red,   title: "Proactive financial alerts",          desc: "Don't wait to discover problems. CFOly surfaces anomalies, risks, and opportunities automatically.",           icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
];

function Features() {
  return (
    <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Pill label="Capabilities" />
          <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 12px" }}>
            Everything you need to<br />run finance with confidence
          </h2>
          <p style={{ fontSize: 16, color: C.textS, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Built for founders, operators, and finance teams who need clarity — not complexity.
          </p>
        </div>
        <div className="featGrid">
          {FEATURES.map(f => (
            <div key={f.title} className="lCard" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "26px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: f.color + "17", border: `1px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.3 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: C.textS, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   BENEFITS
   ════════════════════════════════════════════════════════ */
const BENEFITS = [
  { icon: "💡", title: "No finance degree required",     desc: "Ask questions in plain language. CFOly translates raw numbers into clear, actionable language." },
  { icon: "⚡", title: "AI insights in seconds",         desc: "Stop spending hours in spreadsheets. Get CFO-level analysis in the time it takes to ask a question." },
  { icon: "🧭", title: "Decisions backed by real data",  desc: "Every recommendation is grounded in your actual financial data — not templates or generic benchmarks." },
];

function Benefits() {
  return (
    <div>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Pill label="Why CFOly" />
          <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 12px" }}>
            Financial clarity<br />without the overhead
          </h2>
          <p style={{ fontSize: 16, color: C.textS, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            CFOly gives growing businesses access to the kind of financial intelligence that used to require a full CFO team.
          </p>
        </div>
        <div className="benGrid">
          {BENEFITS.map(b => (
            <div key={b.title} style={{ textAlign: "center", padding: "0 12px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: "-0.02em", margin: "0 0 12px" }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STATS BAR
   ════════════════════════════════════════════════════════ */
function StatsBar() {
  const stats = [
    { v: "500+",  l: "companies using CFOly" },
    { v: "2.4M",  l: "transactions analyzed" },
    { v: "87%",   l: "reduction in finance review time" },
    { v: "99.9%", l: "uptime SLA" },
  ];
  return (
    <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="statsGrid secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        {stats.map(s => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", background: `linear-gradient(135deg,${C.blue},${C.blueL})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>{s.v}</div>
            <div style={{ fontSize: 13, color: C.textS, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TRUST / SECURITY
   ════════════════════════════════════════════════════════ */
const TRUST = [
  { color: C.green, title: "Bank-level encryption",         desc: "AES-256 encryption at rest and in transit — the same standard used by major financial institutions worldwide.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { color: C.blueL, title: "Enterprise-grade infrastructure", desc: "Built on financial-grade cloud infrastructure with 99.9% uptime SLA. Your data is there when you need it.",  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { color: C.cyan,  title: "Privacy-first analytics",        desc: "Your financial data is processed only to generate your insights. Never sold, never shared with third parties.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> },
];

function Trust() {
  return (
    <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Pill label="Security & trust" color={C.green} bg="rgba(16,185,129,0.1)" />
          <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 12px" }}>
            Built for financial data
          </h2>
          <p style={{ fontSize: 16, color: C.textS, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            We treat your data with the same seriousness as your finances deserve.
          </p>
        </div>
        <div className="trustGrid">
          {TRUST.map(t => (
            <div key={t.title} className="lCard" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "30px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: t.color + "15", border: `1px solid ${t.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, marginBottom: 20 }}>{t.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: "-0.02em", margin: "0 0 12px" }}>{t.title}</h3>
              <p style={{ fontSize: 14, color: C.textS, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   INTEGRATIONS
   ════════════════════════════════════════════════════════ */
const INTS = [
  { name: "Excel",          icon: "📊" }, { name: "Google Sheets", icon: "📋" },
  { name: "Stripe",         icon: "💳" }, { name: "QuickBooks",    icon: "📒" },
  { name: "PostgreSQL",     icon: "🐘" }, { name: "SAP ERP",       icon: "🏢" },
  { name: "Conta Azul",     icon: "🔷" }, { name: "Omie",          icon: "⚙️" },
];

function Integrations() {
  return (
    <div>
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
        <Pill label="Integrations" />
        <h2 className="secH2" style={{ fontWeight: 800, letterSpacing: "-0.03em", color: C.text, margin: "14px 0 12px" }}>
          Works with your existing tools
        </h2>
        <p style={{ fontSize: 16, color: C.textS, maxWidth: 440, margin: "0 auto 44px", lineHeight: 1.7 }}>
          Connect the systems you already use. CFOly brings it all together.
        </p>
        <div className="intGrid">
          {INTS.map(i => (
            <div key={i.name} className="lInt" style={{ background: "rgba(148,163,184,0.03)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{i.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textS }}>{i.name}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12.5, color: C.textM, marginTop: 24 }}>+ REST API, webhooks, and CSV import for any other system</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FINAL CTA
   ════════════════════════════════════════════════════════ */
function FinalCTA({ onGetStarted }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: C.bgDeep, borderTop: `1px solid ${C.border}` }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(148,163,184,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.02) 1px,transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
      <div className="secPad" style={{ maxWidth: W, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Pill label="Get started today" />
        <h2 className="ctaH2" style={{ fontWeight: 900, letterSpacing: "-0.04em", color: C.text, margin: "18px 0 18px", lineHeight: 1.06 }}>
          Stop guessing.<br />
          <span style={{ background: `linear-gradient(130deg,${C.blue},${C.blueL},${C.cyan})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start deciding.</span>
        </h2>
        <p style={{ fontSize: 17, color: C.textS, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Join 500+ companies who use CFOly to run their finances with AI-powered clarity. Free to start, no credit card required.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetStarted} className="lBtnP" style={{ padding: "15px 44px", borderRadius: 12, border: "none", background: C.blue, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 40px rgba(37,99,235,0.45)" }}>
            Get CFOly Free
          </button>
          <button onClick={onGetStarted} className="lBtnG" style={{ padding: "15px 32px", borderRadius: 12, border: `1px solid rgba(34,211,238,0.25)`, background: C.cyanBg, color: C.cyan, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 9 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            See live demo
          </button>
        </div>
        <p style={{ fontSize: 12.5, color: C.textM, marginTop: 20 }}>No credit card · 5-minute setup · Cancel anytime</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, padding: "28px 20px" }}>
      <div style={{ maxWidth: W, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>CFOly</span>
        </div>
        <div style={{ fontSize: 12, color: C.textM }}>© 2026 CFOly. Financial intelligence for modern businesses.</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Security", "Docs"].map(l => (
            <span key={l} className="lLink" style={{ fontSize: 12.5, color: C.textS }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════════════ */
export function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{
      background: C.bg, color: C.text,
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
      minHeight: "100vh", overflowX: "hidden",
    }}>
      <style>{LAND_CSS}</style>
      <Nav onGetStarted={onGetStarted} scrolled={scrolled} />
      <Hero onGetStarted={onGetStarted} />
      <LogosBar />
      <HowItWorks />
      <AIChatSection />
      <Features />
      <Benefits />
      <StatsBar />
      <Trust />
      <Integrations />
      <FinalCTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
