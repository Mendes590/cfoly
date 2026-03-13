import { useState } from "react";
import { useC } from "../core/context.jsx";
import { Card } from "../components/ui/Card.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";

function Section({ title, children, th }) {
  return (
    <Card>
      <SecTitle title={title} mb={16} />
      {children}
    </Card>
  );
}

function Row({ label, sub, children, th }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: `1px solid ${th.border}` }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: th.text }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: th.textM, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, th }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? th.accent : th.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

function ChipGroup({ options, value, onChange, th }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ padding: "6px 14px", borderRadius: 9, border: `1px solid ${value === o.value ? th.borderA : th.border}`, background: value === o.value ? th.accentBg : "transparent", color: value === o.value ? th.accentL : th.textS, fontSize: 12.5, fontWeight: value === o.value ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{o.label}</button>
      ))}
    </div>
  );
}

export function PageSettings() {
  const { th, lang, setLang, themeName, setTheme, t } = useC();
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: true, weekly: true, alerts: true });
  const [privacy, setPrivacy] = useState({ anonymize: false, share: false });
  const [currency, setCurrency] = useState("usd");
  const [dateFormat, setDateFormat] = useState("mdy");
  const [fiscalStart, setFiscalStart] = useState("jan");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: th.text, letterSpacing: "-0.03em", marginBottom: 5 }}>{t.settTitle}</div>
        <div style={{ fontSize: 12.5, color: th.textM }}>Personalize sua experiência no CFOly</div>
      </div>

      {/* Appearance */}
      <Section title="Aparência" th={th}>
        <Row label={t.settTheme} sub="Escolha entre tema claro e escuro" th={th}>
          <ChipGroup
            options={[{ value: "dark", label: t.settDark }, { value: "light", label: t.settLight }]}
            value={themeName} onChange={setTheme} th={th}
          />
        </Row>
        <Row label={t.settLang} sub="Idioma de toda a interface" th={th}>
          <ChipGroup
            options={[{ value: "pt", label: "Português" }, { value: "en", label: "English" }, { value: "es", label: "Español" }]}
            value={lang} onChange={setLang} th={th}
          />
        </Row>
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Regional */}
      <Section title="Regional e Formato" th={th}>
        <Row label="Moeda padrão" sub="Usada em todos os relatórios e gráficos" th={th}>
          <ChipGroup
            options={[{ value: "usd", label: "USD ($)" }, { value: "brl", label: "BRL (R$)" }, { value: "eur", label: "EUR (€)" }]}
            value={currency} onChange={setCurrency} th={th}
          />
        </Row>
        <Row label="Formato de data" sub="" th={th}>
          <ChipGroup
            options={[{ value: "dmy", label: "DD/MM/AAAA" }, { value: "mdy", label: "MM/DD/YYYY" }, { value: "ymd", label: "AAAA-MM-DD" }]}
            value={dateFormat} onChange={setDateFormat} th={th}
          />
        </Row>
        <Row label="Início do ano fiscal" sub="Define quando começa o ciclo anual" th={th}>
          <select
            value={fiscalStart} onChange={(e) => setFiscalStart(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: 9, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", cursor: "pointer" }}
          >
            {["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"].map((m, i) => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </Row>
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Notifications */}
      <Section title="Notificações" th={th}>
        {[
          { key: "email", label: "Notificações por e-mail", sub: "Resumos diários e alertas críticos" },
          { key: "push", label: "Notificações no app", sub: "Alertas em tempo real no painel" },
          { key: "weekly", label: "Relatório semanal", sub: "Resumo financeiro toda segunda-feira" },
          { key: "alerts", label: "Alertas de risco", sub: "Runway, concentração de clientes e variações grandes" },
        ].map((n) => (
          <Row key={n.key} label={n.label} sub={n.sub} th={th}>
            <Toggle value={notifs[n.key]} onChange={(v) => setNotifs({ ...notifs, [n.key]: v })} th={th} />
          </Row>
        ))}
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Privacy */}
      <Section title="Privacidade e Dados" th={th}>
        {[
          { key: "anonymize", label: "Anonimizar dados nos relatórios", sub: "Oculta nomes de clientes e valores exatos ao exportar" },
          { key: "share", label: "Compartilhar dados para melhorar a IA", sub: "Dados anonimizados para treinar modelos (nunca vendemos)" },
        ].map((p) => (
          <Row key={p.key} label={p.label} sub={p.sub} th={th}>
            <Toggle value={privacy[p.key]} onChange={(v) => setPrivacy({ ...privacy, [p.key]: v })} th={th} />
          </Row>
        ))}
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Plan */}
      <Section title="Plano e Faturamento" th={th}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(37,99,235,0.08))", border: `1px solid ${th.borderA}`, marginBottom: 4 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>CFOly Pro</div>
              <Badge color="accent">Ativo</Badge>
            </div>
            <div style={{ fontSize: 12, color: th.textM }}>Renovação em 14 de abril de 2025 · $49/mês</div>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 9, border: `1px solid ${th.borderA}`, background: th.accentBg, color: th.accentL, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Gerenciar plano</button>
        </div>
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Danger zone */}
      <Section title="Zona de Perigo" th={th}>
        <Row label="Exportar todos os dados" sub="Baixe todos os seus dados financeiros em formato JSON" th={th}>
          <button style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${th.border}`, background: "transparent", color: th.textS, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Exportar</button>
        </Row>
        <Row label="Excluir conta" sub="Remove permanentemente todos os dados — sem recuperação" th={th}>
          <button style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${th.redB}`, background: th.redBg, color: th.red, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Excluir conta</button>
        </Row>
        <div style={{ paddingTop: 4 }} />
      </Section>

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 8 }}>
        <button
          onClick={handleSave}
          style={{ padding: "11px 28px", borderRadius: 11, border: saved ? `1px solid ${th.greenB}` : "none", background: saved ? th.greenBg : "linear-gradient(135deg,#4f46e5,#2563eb)", color: saved ? th.green : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: saved ? "none" : "0 3px 12px rgba(79,70,229,0.35)" }}
        >{saved ? `✓ ${t.settSaved}` : t.settSave}</button>
      </div>
    </div>
  );
}
