import { useState } from "react";
import { login as apiLogin, signup as apiSignup } from "../services/api/auth.js";

/* ─── copy ─────────────────────────────────────────────────────────────────── */
const LC = {
  pt: {
    eyebrow: "Plataforma de CFO com IA",
    headline: "Inteligência financeira\npara decisões melhores",
    sub: "Dashboards em tempo real, análise com IA e insights acionáveis — tudo sem contratar um CFO.",
    features: [
      "Dashboards financeiros em tempo real",
      "Análise de concentração de risco",
      "Previsão de fluxo de caixa e runway",
      "CFO conversacional com IA",
    ],
    stats: [{ v:"500+", l:"empresas" }, { v:"2.4M", l:"transações/mês" }, { v:"99.9%", l:"uptime" }],
    welcome:  "Bem-vindo de volta",
    sub2:     "Entre para acessar sua plataforma financeira",
    login:    "Entrar",   email: "E-mail",   pass: "Senha",
    or:       "ou continue com",
    google:   "Google",   github: "GitHub",
    forgot:   "Esqueceu a senha?",
    demo:     "Acessar conta demo →",
    noAccount:"Não tem uma conta?",
    signup:   "Criar conta grátis",
    loading:  "Entrando...",
    ph_email: "voce@empresa.com",
    ph_pass:  "••••••••",
    trust:    "SSL 256-bit · SOC 2 · LGPD",
    chartTitle:"Receita Total",
    chartPeriod:"Jan – Dez 2024",
    chartVal:  "$120k",
  },
  en: {
    eyebrow: "AI-Powered CFO Platform",
    headline: "Financial intelligence\nfor better decisions",
    sub: "Real-time dashboards, AI analysis and actionable insights — all without hiring a full-time CFO.",
    features: [
      "Real-time financial dashboards",
      "Customer concentration risk analysis",
      "Cash flow & runway forecasting",
      "Conversational AI CFO assistant",
    ],
    stats: [{ v:"500+", l:"companies" }, { v:"2.4M", l:"transactions/mo" }, { v:"99.9%", l:"uptime" }],
    welcome:  "Welcome back",
    sub2:     "Sign in to access your financial platform",
    login:    "Sign in",  email: "Email",    pass: "Password",
    or:       "or continue with",
    google:   "Google",   github: "GitHub",
    forgot:   "Forgot password?",
    demo:     "Access demo account →",
    noAccount:"Don't have an account?",
    signup:   "Create free account",
    loading:  "Signing in...",
    ph_email: "you@company.com",
    ph_pass:  "••••••••",
    trust:    "SSL 256-bit · SOC 2 · GDPR",
    chartTitle:"Total Revenue",
    chartPeriod:"Jan – Dec 2024",
    chartVal:  "$120k",
  },
};

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
/* Critical: root is height:100vh; overflow:hidden — no scroll ever. */
const LOGIN_CSS = `
  *,*::before,*::after { box-sizing:border-box }

  /* ── Animations ── */
  @keyframes lg-barRise  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
  @keyframes lg-lineIn   { from{opacity:0} to{opacity:1} }
  @keyframes lg-slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lg-orbDrift { 0%,100%{transform:translate(0,0)} 40%{transform:translate(24px,-16px)} 70%{transform:translate(-10px,14px)} }
  @keyframes lg-pulse    { 0%,100%{opacity:0.4} 50%{opacity:1} }

  /* ── Layout ── */
  .lg-root {
    height: 100vh;
    overflow: hidden;
    display: flex;
    background: #07101F;
    font-family: "Inter",-apple-system,BlinkMacSystemFont,sans-serif;
    color: #F8FAFC;
    position: relative;
  }

  /* Left marketing panel */
  .lg-left {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 64px;
    border-right: 1px solid rgba(148,163,184,0.07);
    position: relative;
  }

  /* Right auth panel */
  .lg-right {
    width: 468px;
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 40px;
    position: relative;
  }

  /* ── Form controls ── */
  .lg-input {
    display: block;
    width: 100%;
    height: 46px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid rgba(148,163,184,0.12);
    background: rgba(5,9,18,0.75);
    color: #F8FAFC;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.17s, box-shadow 0.17s;
    -webkit-appearance: none;
  }
  .lg-input::placeholder { color: rgba(148,163,184,0.28) }
  .lg-input:focus {
    border-color: rgba(37,99,235,0.6);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.11);
  }

  .lg-oauth {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 42px;
    border-radius: 10px;
    border: 1px solid rgba(148,163,184,0.12);
    background: rgba(148,163,184,0.04);
    color: rgba(248,250,252,0.7);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    width: 100%;
  }
  .lg-oauth:hover {
    background: rgba(148,163,184,0.09);
    border-color: rgba(148,163,184,0.22);
    color: rgba(248,250,252,0.9);
  }

  .lg-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
    color: #fff;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: -0.01em;
    box-shadow: 0 6px 28px rgba(37,99,235,0.45), inset 0 1px 0 rgba(255,255,255,0.18);
    transition: box-shadow 0.17s, opacity 0.17s;
  }
  .lg-cta:hover:not(:disabled) {
    box-shadow: 0 8px 36px rgba(37,99,235,0.6), inset 0 1px 0 rgba(255,255,255,0.18);
  }
  .lg-cta:disabled {
    opacity: 0.42;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* ── Responsive — tablet: hide left marketing ── */
  @media (max-width: 900px) {
    .lg-left  { display: none }
    .lg-right { width: 100%; padding: 32px 24px }
  }
  @media (max-width: 480px) {
    .lg-right { padding: 24px 16px }
  }
`;

/* ─── Chart illustration ─────────────────────────────────────────────────── */
function ChartModule({ lc }) {
  const bars   = [42, 55, 38, 68, 59, 82, 67, 90, 63, 80, 75, 100];
  const W = 380, H = 76;
  const bw = 20, slot = W / bars.length;
  const bx = i => i * slot + (slot - bw) / 2;
  const by = v => H - v * (H / 108);
  const pts = bars.map((v, i) => `${bx(i) + bw/2},${by(v)}`).join(" ");

  return (
    <div style={{
      background: "rgba(8,15,30,0.8)", border: "1px solid rgba(148,163,184,0.1)",
      borderRadius: 14, padding: "14px 16px 12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:-24, right:-16, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />

      {/* header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, position:"relative" }}>
        <div>
          <div style={{ fontSize:9.5, fontWeight:700, color:"rgba(148,163,184,0.4)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>{lc.chartTitle}</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.04em", lineHeight:1 }}>{lc.chartVal}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, background:"rgba(16,185,129,0.11)", border:"1px solid rgba(16,185,129,0.2)" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"lg-pulse 2s infinite" }} />
            <span style={{ fontSize:11, fontWeight:700, color:"#10b981" }}>+8.2%</span>
          </div>
          <div style={{ fontSize:9.5, color:"rgba(148,163,184,0.3)" }}>{lc.chartPeriod}</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block", overflow:"visible" }}>
        <defs>
          <linearGradient id="lg-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="lg-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="lg-glow">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {[25, 50, 75].map(p => (
          <line key={p} x1="0" y1={by(p)} x2={W} y2={by(p)}
            stroke="rgba(148,163,184,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        {bars.map((v, i) => (
          <rect key={i} x={bx(i)} y={by(v)} width={bw} height={H - by(v)} rx={3}
            fill="url(#lg-bar)"
            style={{ transformOrigin:`${bx(i)+bw/2}px ${H}px`, animation:`lg-barRise 0.48s ${i*0.033}s cubic-bezier(0.34,1.56,0.64,1) both` }}
          />
        ))}

        <polygon points={`${bx(0)+bw/2},${H} ${pts} ${bx(11)+bw/2},${H}`}
          fill="url(#lg-area)" style={{ animation:"lg-lineIn 0.9s 0.5s ease both", opacity:0 }} />
        <polyline points={pts} fill="none" stroke="url(#lg-line)" strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round" filter="url(#lg-glow)"
          style={{ animation:"lg-lineIn 0.9s 0.4s ease both", opacity:0 }} />
        {bars.map((v, i) => (
          <circle key={i} cx={bx(i)+bw/2} cy={by(v)} r={2.5} fill="#10b981"
            style={{ animation:`lg-lineIn 0.3s ${0.5+i*0.04}s ease both`, opacity:0 }} />
        ))}

        {/* peak tooltip */}
        <g style={{ animation:"lg-lineIn 0.3s 1.05s ease both", opacity:0 }}>
          <rect x={bx(11)-4} y={by(100)-22} width={36} height={17} rx={5} fill="rgba(37,99,235,0.95)" />
          <text x={bx(11)+14} y={by(100)-10} textAnchor="middle"
            fill="#fff" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">+8%</text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Small icons ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(248,250,252,0.75)" style={{ flexShrink:0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function LoginScreen({ onLogin }) {
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name,    setName]    = useState("");
  const [langKey, setLangKey] = useState("pt");
  const lc = LC[langKey];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let data;
      if (isSignup) {
        data = await apiSignup({ name: name || email.split("@")[0], email, password: pass });
      } else {
        data = await apiLogin({ email, password: pass });
      }
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Erro ao autenticar");
      setLoading(false);
    }
  }

  function handleDemoAccess() {
    onLogin(null); // enter with default mock user, no token
  }

  return (
    <div className="lg-root">
      <style>{LOGIN_CSS}</style>

      {/* ── Background ── */}
      <div style={{ position:"absolute", top:"-20%", left:"-12%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 65%)", pointerEvents:"none", animation:"lg-orbDrift 22s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-18%", right:"30%", width:540, height:540, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"15%", right:"6%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.055) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(148,163,184,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.02) 1px,transparent 1px)", backgroundSize:"52px 52px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(4,8,18,0.5) 100%)", pointerEvents:"none" }} />

      {/* ══ LEFT PANEL ══ */}
      <div className="lg-left">
        <div style={{ maxWidth:480, animation:"lg-slideUp 0.6s ease both" }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#2563EB,#1D4ED8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,99,235,0.5)", flexShrink:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span style={{ fontSize:17, fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>CFOly</span>
            <div style={{ padding:"2px 9px", borderRadius:20, background:"rgba(37,99,235,0.14)", border:"1px solid rgba(37,99,235,0.26)", fontSize:9, fontWeight:800, color:"#60A5FA", letterSpacing:"0.09em" }}>BETA</div>
          </div>

          {/* Eyebrow */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 12px", borderRadius:20, background:"rgba(37,99,235,0.09)", border:"1px solid rgba(37,99,235,0.18)", marginBottom:14 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#2563EB", animation:"lg-pulse 2.4s infinite" }} />
            <span style={{ fontSize:10.5, fontWeight:700, color:"#60A5FA", letterSpacing:"0.08em", textTransform:"uppercase" }}>{lc.eyebrow}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize:46, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.04em", lineHeight:1.1, margin:"0 0 14px" }}>
            {lc.headline.split("\n").map((line, i, arr) =>
              i === arr.length - 1
                ? <span key={i} style={{ background:"linear-gradient(135deg,#60A5FA 0%,#06b6d4 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", display:"block" }}>{line}</span>
                : <span key={i} style={{ display:"block" }}>{line}</span>
            )}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize:14, color:"rgba(148,163,184,0.58)", lineHeight:1.68, margin:"0 0 26px", maxWidth:380 }}>{lc.sub}</p>

          {/* Chart */}
          <div style={{ marginBottom:26 }}>
            <ChartModule lc={lc} />
          </div>

          {/* Features — 2 columns to save vertical space */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px", marginBottom:26 }}>
            {lc.features.map((f, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
                <div style={{
                  width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1,
                  background:"linear-gradient(135deg,rgba(37,99,235,0.22),rgba(79,70,229,0.15))",
                  border:"1px solid rgba(37,99,235,0.28)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span style={{ fontSize:12.5, color:"rgba(203,213,225,0.68)", fontWeight:500, lineHeight:1.45 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", paddingTop:22, borderTop:"1px solid rgba(148,163,184,0.08)" }}>
            {lc.stats.map((s, i) => (
              <div key={i} style={{
                paddingLeft:  i > 0 ? 20 : 0,
                paddingRight: i < 2 ? 20 : 0,
                borderRight:  i < 2 ? "1px solid rgba(148,163,184,0.08)" : "none",
              }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.04em", lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:10.5, color:"rgba(148,163,184,0.36)", marginTop:4, fontWeight:500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="lg-right">
        {/* ambient glow behind card */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />

        {/* card */}
        <div style={{ width:"100%", maxWidth:400, animation:"lg-slideUp 0.65s 0.08s ease both", opacity:0 }}>
          <div style={{
            background:"rgba(9,15,28,0.9)",
            border:"1px solid rgba(148,163,184,0.12)",
            borderRadius:20,
            padding:"32px 30px",
            backdropFilter:"blur(32px)",
            boxShadow:"0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            position:"relative",
          }}>

            {/* Card header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
              <div>
                <div style={{ fontSize:19, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.03em", lineHeight:1 }}>{lc.welcome}</div>
                <div style={{ fontSize:12, color:"rgba(148,163,184,0.42)", marginTop:5 }}>{lc.sub2}</div>
              </div>
              <div style={{ display:"flex", gap:4, flexShrink:0, marginLeft:10 }}>
                {["pt","en"].map(l => (
                  <button key={l} onClick={() => setLangKey(l)} style={{
                    padding:"3px 9px", borderRadius:7, cursor:"pointer", fontFamily:"inherit",
                    border:`1px solid ${langKey===l ? "rgba(37,99,235,0.45)" : "rgba(148,163,184,0.11)"}`,
                    background: langKey===l ? "rgba(37,99,235,0.16)" : "transparent",
                    color: langKey===l ? "#60A5FA" : "rgba(148,163,184,0.35)",
                    fontSize:10, fontWeight:700, transition:"all 0.14s",
                  }}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {/* OAuth — 2-col grid (saves vertical space) */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
              {[
                { icon:<GoogleIcon />, label:lc.google },
                { icon:<GitHubIcon />, label:lc.github },
              ].map((btn, i) => (
                <button key={i} className="lg-oauth" onClick={onLogin}>
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ flex:1, height:1, background:"rgba(148,163,184,0.08)" }} />
              <span style={{ fontSize:11, color:"rgba(148,163,184,0.28)", whiteSpace:"nowrap" }}>{lc.or}</span>
              <div style={{ flex:1, height:1, background:"rgba(148,163,184,0.08)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {isSignup && (
                <div>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(148,163,184,0.42)", marginBottom:7, letterSpacing:"0.08em", textTransform:"uppercase" }}>Nome</label>
                  <input className="lg-input" type="text" value={name} placeholder="Seu nome completo" required onChange={e => setName(e.target.value)} />
                </div>
              )}
              {[
                { key:"email", label:lc.email, type:"email",    value:email, set:setEmail, ph:lc.ph_email },
                { key:"pass",  label:lc.pass,  type:"password", value:pass,  set:setPass,  ph:lc.ph_pass  },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(148,163,184,0.42)", marginBottom:7, letterSpacing:"0.08em", textTransform:"uppercase" }}>{f.label}</label>
                  <input className="lg-input" type={f.type} value={f.value} placeholder={f.ph} required onChange={e => f.set(e.target.value)} />
                </div>
              ))}

              {error && (
                <div style={{ padding:"10px 13px", borderRadius:9, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", fontSize:12.5, color:"#F87171" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="lg-cta" disabled={loading}>
                {loading ? lc.loading : isSignup ? lc.signup : lc.login}
              </button>
            </form>

            {/* Demo link */}
            <button onClick={handleDemoAccess} style={{ width:"100%", marginTop:12, background:"none", border:"none", color:"rgba(96,165,250,0.7)", fontSize:12.5, cursor:"pointer", fontFamily:"inherit", fontWeight:600, padding:"5px 0", transition:"color 0.14s", letterSpacing:"-0.01em" }}
              onMouseEnter={e => (e.currentTarget.style.color="#93C5FD")}
              onMouseLeave={e => (e.currentTarget.style.color="rgba(96,165,250,0.7)")}
            >{lc.demo}</button>

            {/* Signup toggle */}
            <div style={{ height:1, background:"rgba(148,163,184,0.07)", margin:"14px 0" }} />
            <div style={{ textAlign:"center", fontSize:12.5, color:"rgba(148,163,184,0.3)" }}>
              {isSignup ? "Já tem conta? " : lc.noAccount + " "}
              <button onClick={() => { setIsSignup(v => !v); setError(""); }} style={{ background:"none", border:"none", color:"rgba(96,165,250,0.78)", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"color 0.14s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#93C5FD")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(96,165,250,0.78)")}
              >{isSignup ? "Entrar" : lc.signup}</button>
            </div>

            {/* Trust badge */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:16, paddingTop:14, borderTop:"1px solid rgba(148,163,184,0.06)" }}>
              <LockIcon />
              <span style={{ fontSize:10.5, color:"rgba(148,163,184,0.26)", fontWeight:500, letterSpacing:"0.02em" }}>{lc.trust}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
