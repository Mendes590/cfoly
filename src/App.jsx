import { useState } from "react";
import { Ctx, NAV } from "./core/context.jsx";
import { THEMES } from "./core/themes.js";
import { TR } from "./core/translations.js";
import { LoginScreen } from "./auth/LoginScreen.jsx";
import { NotifPanel } from "./panels/NotifPanel.jsx";
import { ProfilePanel } from "./panels/ProfilePanel.jsx";
import { PageDashboard } from "./pages/Dashboard.jsx";
import { PageCashFlow } from "./pages/CashFlow.jsx";
import { PageRevenue } from "./pages/Revenue.jsx";
import { PageExpenses } from "./pages/Expenses.jsx";
import { PageCustomers } from "./pages/Customers.jsx";
import { PageInsights } from "./pages/Insights.jsx";
import { PageReport } from "./pages/Report.jsx";
import { PageContext } from "./pages/BusinessContext.jsx";
import { PageIntegrations } from "./pages/Integrations.jsx";
import { PageSettings } from "./pages/Settings.jsx";
import { OnboardingModal } from "./panels/OnboardingModal.jsx";

const PAGES = {
  dashboard: PageDashboard,
  cashflow: PageCashFlow,
  revenue: PageRevenue,
  expenses: PageExpenses,
  customers: PageCustomers,
  insights: PageInsights,
  report: PageReport,
  context: PageContext,
  integrations: PageIntegrations,
  settings: PageSettings,
};

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
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
  @keyframes aiPopupDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aiPopupUp   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes cPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

function NavItem({ id, icon, label, active, th, onClick, collapsed }) {
  return (
    <button
      onClick={() => onClick(id)}
      title={collapsed ? label : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        padding: collapsed ? "10px 0" : "9px 14px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 10, border: "none", cursor: "pointer",
        background: active ? th.sideActive : "transparent",
        color: active ? th.sideTextA : th.sideText,
        fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 500,
        width: "100%", transition: "background 0.14s, color 0.14s",
        letterSpacing: active ? "-0.01em" : 0,
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = th.sideText; } }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
      {active && !collapsed && <span style={{ width: 5, height: 5, borderRadius: "50%", background: th.accentL, flexShrink: 0 }} />}
    </button>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [lang, setLang] = useState("pt");
  const [themeName, setTheme] = useState("dark");
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(DEFAULT_USER);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const th = THEMES[themeName];
  const t = TR[lang];

  const ctx = { th, t, lang, setLang, themeName, setTheme, user, setUser, page, setPage };

  const handleLogin = () => {
    setLoggedIn(true);
    const skip = localStorage.getItem("cfoly_skip_onboarding") === "true";
    const filled = localStorage.getItem("cfoly_ctx_filled") === "true";
    if (!skip && !filled) setShowOnboarding(true);
  };

  if (!loggedIn) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  const PageComponent = PAGES[page] || PageDashboard;
  const SIDEBAR_W = collapsed ? 60 : 220;
  const TOPBAR_H = 56;

  return (
    <Ctx.Provider value={ctx}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", height: "100vh", background: th.bg, color: th.text, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{ width: SIDEBAR_W, flexShrink: 0, background: th.bgSidebar, display: "flex", flexDirection: "column", transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden", borderRight: `1px solid rgba(255,255,255,0.06)` }}>
          {/* Logo */}
          <div style={{ height: TOPBAR_H, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: collapsed ? 0 : "0 16px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(79,70,229,0.5)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>CFOly</div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.04em" }}>{t.tagline}</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15, padding: 4, lineHeight: 1, flexShrink: 0 }}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >{collapsed ? "▶" : "◀"}</button>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
            {NAV.map((item) => (
              <NavItem
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={t.nav[item.id]}
                active={page === item.id}
                th={th}
                onClick={setPage}
                collapsed={collapsed}
              />
            ))}
          </nav>

        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <div style={{ height: TOPBAR_H, background: th.topbar, borderBottom: `1px solid ${th.border}`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0, zIndex: 100 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: th.text, letterSpacing: "-0.02em" }}>{t.nav[page]}</div>
              <div style={{ fontSize: 11, color: th.textM }}>{t.periodFull}</div>
            </div>

            {/* Period badge */}
            <div style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${th.border}`, background: th.bgCard, fontSize: 12, fontWeight: 600, color: th.textS, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ color: th.accentL }}>◷</span> {t.period}
            </div>

            {/* Notif bell */}
            <button
              onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${th.border}`, background: th.bgCard, color: th.textS, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 15, flexShrink: 0, transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = th.borderH)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = th.border)}
            >
              🔔
              <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: th.red, border: `1.5px solid ${th.topbar}` }} />
            </button>

            {/* Avatar */}
            <div
              onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
              style={{ width: 36, height: 36, borderRadius: 10, background: user.avatar ? "none" : "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer", flexShrink: 0, overflow: "hidden", boxShadow: "0 2px 10px rgba(79,70,229,0.4)" }}
            >
              {user.avatar ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.initials}
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20, scrollbarWidth: "thin" }}>
            <PageComponent />
          </div>
        </div>

        {/* Panels */}
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
            onLogout={() => { setLoggedIn(false); setShowProfile(false); }}
          />
        )}
      </div>
    </Ctx.Provider>
  );
}
