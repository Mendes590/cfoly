import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Ctx, NAV } from "./core/context.jsx";
import { THEMES } from "./core/themes.js";
import { TR } from "./core/translations.js";
import { LandingPage } from "./pages/Landing.jsx";
import { LoginScreen } from "./auth/LoginScreen.jsx";
import { NotifPanel } from "./panels/NotifPanel.jsx";
import { ProfilePanel } from "./panels/ProfilePanel.jsx";
import { PageDashboard } from "./pages/Dashboard.jsx";
import { PageCashFlow } from "./pages/CashFlow.jsx";
import { PageRevenue } from "./pages/Revenue.jsx";
import { PageExpenses } from "./pages/Expenses.jsx";
import { PageCustomers } from "./pages/Customers.jsx";
import { PageInsights }  from "./pages/Insights.jsx";
import { PageValuation } from "./pages/Valuation.jsx";
import { PageReport }    from "./pages/Report.jsx";
import { PageContext } from "./pages/BusinessContext.jsx";
import { PageIntegrations } from "./pages/Integrations.jsx";
import { PageSettings } from "./pages/Settings.jsx";
import { OnboardingModal } from "./panels/OnboardingModal.jsx";

/* ─── Route ↔ page-id maps ─── */
const PATH_TO_PAGE = {
  "/dashboard":       "dashboard",
  "/cashflow":        "cashflow",
  "/revenue":         "revenue",
  "/expenses":        "expenses",
  "/customers":       "customers",
  "/insights":        "insights",
  "/valuation":       "valuation",
  "/report":          "report",
  "/business-context":"context",
  "/integrations":    "integrations",
  "/settings":        "settings",
};

const PAGE_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_PAGE).map(([p, id]) => [id, p])
);

const DEFAULT_USER = {
  name: "Ronaldo Santos", role: "CEO", email: "ronaldo@empresa.com",
  phone: "+55 11 99999-9999", company: "TechBrasil Ltda",
  cnpj: "12.345.678/0001-99", sector: "Serviços de TI", employees: "10-50",
  initials: "RS", avatar: null,
};

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.18); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.3); }
  @keyframes aiPopupDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aiPopupUp   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes cPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

/* ─── Nav item ─── */
function NavItem({ id, icon, label, active, th, onClick, collapsed }) {
  return (
    <button
      onClick={() => onClick(id)}
      title={collapsed ? label : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: collapsed ? "10px 0" : "8px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? th.sideActive : "transparent",
        color: active ? th.sideTextA : th.sideText,
        fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 400,
        width: "100%", transition: "background 0.14s, color 0.14s",
        position: "relative",
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(148,163,184,0.07)"; e.currentTarget.style.color = "rgba(248,250,252,0.7)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = th.sideText; } }}
    >
      {active && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: "0 3px 3px 0", background: th.accent }} />}
      <span style={{ fontSize: 15, flexShrink: 0, opacity: active ? 1 : 0.7 }}>{icon}</span>
      {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
    </button>
  );
}

/* ─── App shell (uses router hooks – must be inside BrowserRouter) ─── */
function AppShell({ lang, setLang, themeName, setTheme, user, setUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const skip = localStorage.getItem("cfoly_skip_onboarding") === "true";
    const filled = localStorage.getItem("cfoly_ctx_filled") === "true";
    return !skip && !filled;
  });

  const th = THEMES[themeName];
  const t = TR[lang];

  const page = PATH_TO_PAGE[location.pathname] || "dashboard";
  const setPage = (id) => navigate(PAGE_TO_PATH[id] || "/dashboard");

  const ctx = { th, t, lang, setLang, themeName, setTheme, user, setUser, page, setPage };

  const SIDEBAR_W = collapsed ? 58 : 220;
  const TOPBAR_H = 56;

  return (
    <Ctx.Provider value={ctx}>
      <div style={{ display: "flex", height: "100vh", background: th.bg, color: th.text, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: SIDEBAR_W, flexShrink: 0,
          background: th.bgSidebar,
          display: "flex", flexDirection: "column",
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          borderRight: "1px solid rgba(148,163,184,0.07)",
        }}>
          {/* Logo row */}
          <div style={{ height: TOPBAR_H, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: collapsed ? 0 : "0 14px", flexShrink: 0, borderBottom: "1px solid rgba(148,163,184,0.07)" }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 12px rgba(37,99,235,0.5)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>CFOly</div>
                  <div style={{ fontSize: 9, color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{t.tagline}</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{ background: "none", border: "none", color: "rgba(148,163,184,0.35)", cursor: "pointer", fontSize: 13, padding: 6, lineHeight: 1, flexShrink: 0, borderRadius: 6, transition: "color 0.15s, background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(148,163,184,0.7)"; e.currentTarget.style.background = "rgba(148,163,184,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(148,163,184,0.35)"; e.currentTarget.style.background = "transparent"; }}
              title={collapsed ? "Expand" : "Collapse"}
            >{collapsed ? "▶" : "◀"}</button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "10px 6px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
            {NAV.map((item) => (
              <NavItem key={item.id} id={item.id} icon={item.icon} label={t.nav[item.id]} active={page === item.id} th={th} onClick={setPage} collapsed={collapsed} />
            ))}
          </nav>

          {/* Bottom: version */}
          {!collapsed && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(148,163,184,0.07)", fontSize: 10, color: "rgba(148,163,184,0.25)", fontWeight: 600, letterSpacing: "0.05em" }}>v0.1.0 BETA</div>
          )}
        </div>

        {/* ── Main area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ height: TOPBAR_H, background: th.topbar, borderBottom: `1px solid ${th.border}`, backdropFilter: "blur(16px)", display: "flex", alignItems: "center", padding: "0 22px", gap: 12, flexShrink: 0, zIndex: 100 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: th.text, letterSpacing: "-0.02em" }}>{t.nav[page]}</div>
              <div style={{ fontSize: 10.5, color: th.textM, marginTop: 1 }}>{t.periodFull}</div>
            </div>

            {/* Period */}
            <div style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${th.border}`, background: th.bgCard, fontSize: 11.5, fontWeight: 600, color: th.textS, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ color: th.accentL, fontSize: 12 }}>◷</span> {t.period}
            </div>

            {/* AI badge */}
            <div style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${th.aiBtnBorder}`, background: th.aiBtnBg, fontSize: 11.5, fontWeight: 700, color: th.accentL, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
              onClick={() => setPage("insights")}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              AI CFO
            </div>

            {/* Notif */}
            <button
              onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
              style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${th.border}`, background: th.bgCard, color: th.textS, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 14, flexShrink: 0, transition: "border-color 0.15s, background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = th.borderH; e.currentTarget.style.background = th.bgCardH; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.background = th.bgCard; }}
            >
              🔔
              <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: th.red, border: `2px solid ${th.topbar}` }} />
            </button>

            {/* Avatar */}
            <div
              onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
              style={{ width: 36, height: 36, borderRadius: 9, background: user.avatar ? "none" : "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", cursor: "pointer", flexShrink: 0, overflow: "hidden", boxShadow: "0 2px 12px rgba(37,99,235,0.45)", border: `1px solid ${th.borderA}` }}
            >
              {user.avatar ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.initials}
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", scrollbarWidth: "thin" }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"        element={<PageDashboard />} />
              <Route path="/cashflow"         element={<PageCashFlow />} />
              <Route path="/revenue"          element={<PageRevenue />} />
              <Route path="/expenses"         element={<PageExpenses />} />
              <Route path="/customers"        element={<PageCustomers />} />
              <Route path="/insights"         element={<PageInsights />} />
              <Route path="/valuation"        element={<PageValuation />} />
              <Route path="/report"           element={<PageReport />} />
              <Route path="/business-context" element={<PageContext />} />
              <Route path="/integrations"     element={<PageIntegrations />} />
              <Route path="/settings"         element={<PageSettings />} />
              <Route path="*"                 element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>

        {/* ── Overlays ── */}
        {showOnboarding && (
          <OnboardingModal
            onClose={() => setShowOnboarding(false)}
            onGoToContext={() => { setPage("context"); setShowOnboarding(false); }}
          />
        )}
        {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
        {showProfile && (
          <ProfilePanel
            onClose={() => setShowProfile(false)}
            user={user}
            setUser={setUser}
            onLogout={onLogout}
          />
        )}
      </div>
    </Ctx.Provider>
  );
}

/* ─── Route wrappers (need router context) ─── */
function LandingRoute() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate("/login")} />;
}

function LoginRoute({ onLogin }) {
  const navigate = useNavigate();
  return (
    <LoginScreen onLogin={() => { onLogin(); navigate("/dashboard"); }} />
  );
}

/* ─── Root ─── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [lang, setLang] = useState("pt");
  const [themeName, setTheme] = useState("dark");
  const [user, setUser] = useState(DEFAULT_USER);

  return (
    <BrowserRouter>
      <style>{GLOBAL_CSS}</style>
      <Routes>
        <Route path="/"      element={<LandingRoute />} />
        <Route path="/login" element={<LoginRoute onLogin={() => setLoggedIn(true)} />} />
        <Route path="/*" element={
          loggedIn
            ? <AppShell lang={lang} setLang={setLang} themeName={themeName} setTheme={setTheme} user={user} setUser={setUser} onLogout={() => setLoggedIn(false)} />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}
