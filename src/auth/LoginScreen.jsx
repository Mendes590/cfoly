import { useState } from "react";
import { THEMES } from "../core/themes.js";

const LC = {
  pt: {
    headline: "Seu CFO com IA",
    headlineAccent: "Inteligência financeira",
    sub: "Insights em tempo real para tomar decisões melhores — sem precisar de um CFO full-time.",
    features: [
      { icon: "◈", label: "Dashboards financeiros inteligentes" },
      { icon: "★", label: "Insights automáticos com IA" },
      { icon: "⚠", label: "Análise de risco e concentração" },
      { icon: "🔗", label: "Excel, ERPs, Stripe e bancos" },
    ],
    stats: [
      { value: "500+", label: "empresas" },
      { value: "2.4M", label: "transações/mês" },
      { value: "99.9%", label: "uptime" },
    ],
    login: "Entrar", email: "E-mail", pass: "Senha", or: "ou continuar com",
    google: "Google", github: "GitHub",
    forgot: "Esqueceu a senha?",
    demo: "Acessar conta demo →",
    noAccount: "Não tem uma conta?",
    signup: "Criar conta grátis",
    welcome: "Bem-vindo de volta",
    loading: "Entrando...",
  },
  en: {
    headline: "Your AI CFO",
    headlineAccent: "Financial intelligence",
    sub: "Real-time insights to make better decisions — without hiring a full-time CFO.",
    features: [
      { icon: "◈", label: "Smart financial dashboards" },
      { icon: "★", label: "Automated AI insights" },
      { icon: "⚠", label: "Risk and concentration analysis" },
      { icon: "🔗", label: "Excel, ERPs, Stripe and banks" },
    ],
    stats: [
      { value: "500+", label: "companies" },
      { value: "2.4M", label: "transactions/mo" },
      { value: "99.9%", label: "uptime" },
    ],
    login: "Sign in", email: "Email", pass: "Password", or: "or continue with",
    google: "Google", github: "GitHub",
    forgot: "Forgot password?",
    demo: "Access demo account →",
    noAccount: "Don't have an account?",
    signup: "Create free account",
    welcome: "Welcome back",
    loading: "Signing in...",
  },
};

// Animated SVG chart illustration
function ChartIllustration() {
  const bars = [55, 70, 45, 80, 60, 90, 72, 95, 68, 85, 78, 100];
  const linePoints = bars.map((v, i) => `${i * 36 + 18},${120 - v * 0.9}`).join(" ");
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto" }}>
      {/* Glow behind chart */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 60, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.3) 0%, transparent 70%)", filter: "blur(16px)", pointerEvents: "none" }} />

      <svg viewBox="0 0 450 140" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[30, 60, 90, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="450" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {/* Bars */}
        {bars.map((v, i) => (
          <rect
            key={i}
            x={i * 36 + 6}
            y={120 - v * 0.9}
            width={20}
            height={v * 0.9}
            rx={4}
            fill="url(#barGrad)"
            style={{ animation: `barRise 0.6s ${i * 0.05}s cubic-bezier(0.34,1.56,0.64,1) both` }}
          />
        ))}

        {/* Area fill under line */}
        <polygon
          points={`18,120 ${linePoints} ${bars.length * 36 - 18},120`}
          fill="url(#areaGrad)"
          style={{ animation: "fadeInArea 1.2s 0.4s ease both" }}
        />

        {/* Trend line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ animation: "drawLine 1.2s 0.3s ease both", strokeDasharray: 1000, strokeDashoffset: 0 }}
        />

        {/* Data points */}
        {bars.map((v, i) => (
          <circle
            key={i}
            cx={i * 36 + 18}
            cy={120 - v * 0.9}
            r={3}
            fill="#10b981"
            style={{ animation: `fadeIn 0.3s ${0.3 + i * 0.06}s ease both`, opacity: 0 }}
          />
        ))}

        {/* Highlight last bar label */}
        <rect x={bars.length * 36 - 30} y={120 - 100 * 0.9 - 26} width={44} height={20} rx={5} fill="rgba(99,102,241,0.9)" />
        <text x={bars.length * 36 - 8} y={120 - 100 * 0.9 - 11} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">+8%</text>
      </svg>

      <style>{`
        @keyframes barRise    { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
        @keyframes fadeIn     { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeInArea { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
}

// Google SVG icon
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// GitHub SVG icon
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [langKey, setLangKey] = useState("pt");
  const th = THEMES.dark;
  const lc = LC[langKey];

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1400);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c18", display: "flex", fontFamily: "'Inter',sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Background orbs */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* LEFT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 72px", position: "relative", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 480 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 64 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(79,70,229,0.55)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>CFOly</span>
            <div style={{ marginLeft: 4, padding: "2px 8px", borderRadius: 20, background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.05em" }}>BETA</div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{lc.headlineAccent}</div>
            <h1 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0 }}>
              {lc.headline.split(" ").map((word, i, arr) => (
                i === arr.length - 1
                  ? <span key={i} style={{ background: "linear-gradient(135deg,#818cf8,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> {word}</span>
                  : <span key={i}>{word} </span>
              ))}
            </h1>
          </div>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 44, maxWidth: 400 }}>{lc.sub}</p>

          {/* Chart illustration */}
          <div style={{ marginBottom: 44 }}>
            <ChartIllustration />
          </div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lc.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 44, display: "flex", gap: 28, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {lc.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 52px", position: "relative" }}>
        {/* Glassmorphism card */}
        <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "36px 34px", backdropFilter: "blur(20px)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

          {/* Lang + header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{lc.welcome}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["pt", "en"].map((l) => (
                <button key={l} onClick={() => setLangKey(l)} style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${langKey === l ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`, background: langKey === l ? "rgba(99,102,241,0.2)" : "transparent", color: langKey === l ? "#818cf8" : "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* OAuth buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { icon: <GoogleIcon />, label: lc.google },
              { icon: <GitHubIcon />, label: lc.github },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={onLogin}
                style={{ padding: "10px 8px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{lc.or}</div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "email", label: lc.email, type: "email", value: email, set: setEmail, ph: "voce@empresa.com" },
              { key: "pass",  label: lc.pass,  type: "password", value: pass, set: setPass,  ph: "••••••••" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.label}</label>
                <input
                  type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph} required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.6)"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
              <button type="button" style={{ background: "none", border: "none", color: "#818cf8", fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{lc.forgot}</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px", borderRadius: 12, border: "none",
                background: loading ? "rgba(99,102,241,0.45)" : "linear-gradient(135deg,#4f46e5,#2563eb)",
                color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", letterSpacing: "-0.01em",
                boxShadow: loading ? "none" : "0 4px 20px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                transition: "all 0.2s", marginTop: 2,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 28px rgba(79,70,229,0.65), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
            >
              {loading ? lc.loading : lc.login}
            </button>
          </form>

          {/* Demo link */}
          <button
            onClick={onLogin}
            style={{ width: "100%", marginTop: 14, background: "none", border: "none", color: "#818cf8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: "6px 0", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#818cf8")}
          >{lc.demo}</button>

          {/* Sign up */}
          <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            {lc.noAccount}{" "}
            <button onClick={onLogin} style={{ background: "none", border: "none", color: "#818cf8", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{lc.signup}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
