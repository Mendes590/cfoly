import { useState } from "react";
import { useC } from "../core/context.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";

const INTEGRATIONS = [
  // Spreadsheets
  { id: "excel", name: "Microsoft Excel", cat: "spreadsheet", icon: "📊", color: "#217346", desc: "Import P&L, cash flow and balance sheets directly from .xlsx files.", status: "available", featured: true, tags: ["popular"] },
  { id: "gsheets", name: "Google Sheets", cat: "spreadsheet", icon: "📋", color: "#0f9d58", desc: "Sync financial spreadsheets in real-time from Google Drive.", status: "connected", featured: true, tags: ["popular", "live"] },
  { id: "csv", name: "CSV / TSV", cat: "spreadsheet", icon: "📄", color: "#6366f1", desc: "Upload any CSV or TSV file with transaction history or reports.", status: "available", featured: false, tags: [] },

  // Databases
  { id: "postgres", name: "PostgreSQL", cat: "database", icon: "🐘", color: "#336791", desc: "Direct connection to your PostgreSQL database. Run custom queries.", status: "available", featured: true, tags: ["popular"] },
  { id: "mysql", name: "MySQL", cat: "database", icon: "🐬", color: "#00758f", desc: "Connect to MySQL / MariaDB to import financial tables.", status: "available", featured: false, tags: [] },
  { id: "sqlserver", name: "SQL Server", cat: "database", icon: "🗄", color: "#cc2927", desc: "Microsoft SQL Server connector for ERP and accounting databases.", status: "available", featured: false, tags: [] },
  { id: "mongo", name: "MongoDB", cat: "database", icon: "🍃", color: "#47a248", desc: "Read financial records from MongoDB collections.", status: "soon", featured: false, tags: ["coming soon"] },

  // ERPs
  { id: "sap", name: "SAP S/4HANA", cat: "erp", icon: "⚙", color: "#0070f2", desc: "Pull GL entries, cost centers and P&L from SAP Finance.", status: "available", featured: true, tags: [] },
  { id: "totvs", name: "TOTVS Protheus", cat: "erp", icon: "🔷", color: "#0066b2", desc: "Native integration with TOTVS financial modules.", status: "available", featured: false, tags: [] },
  { id: "oracle", name: "Oracle Financials", cat: "erp", icon: "🔴", color: "#c74634", desc: "Connect to Oracle ERP Cloud for consolidated financial data.", status: "soon", featured: false, tags: ["coming soon"] },
  { id: "netsuite", name: "NetSuite", cat: "erp", icon: "🌐", color: "#009cde", desc: "Import revenue recognition, AP/AR and ledger from NetSuite.", status: "available", featured: false, tags: [] },

  // Accounting
  { id: "quickbooks", name: "QuickBooks", cat: "accounting", icon: "💚", color: "#2ca01c", desc: "Sync invoices, expenses and bank transactions from QuickBooks Online.", status: "connected", featured: true, tags: ["popular", "live"] },
  { id: "xero", name: "Xero", cat: "accounting", icon: "💙", color: "#1ab4d7", desc: "Pull bank feeds, invoices and payroll from Xero.", status: "available", featured: true, tags: ["popular"] },
  { id: "contaazul", name: "Conta Azul", cat: "accounting", icon: "☁", color: "#1d87e5", desc: "Integre sua conta do Conta Azul para importar lançamentos automaticamente.", status: "available", featured: false, tags: [] },
  { id: "nfse", name: "NF-e / NFS-e", cat: "accounting", icon: "🧾", color: "#059669", desc: "Importe NFe e NFSe via SEFAZ para controle de faturamento.", status: "available", featured: false, tags: [] },

  // Financial APIs
  { id: "stripe", name: "Stripe", cat: "api", icon: "💳", color: "#635bff", desc: "Real-time revenue, MRR, ARR and churn metrics from Stripe.", status: "connected", featured: true, tags: ["popular", "live"] },
  { id: "plaid", name: "Plaid", cat: "api", icon: "🏦", color: "#01a09e", desc: "Connect bank accounts to import transactions and balances.", status: "available", featured: true, tags: ["popular"] },
  { id: "brex", name: "Brex", cat: "api", icon: "💜", color: "#7c3aed", desc: "Import spend management data and corporate card transactions.", status: "available", featured: false, tags: [] },
  { id: "mercury", name: "Mercury", cat: "api", icon: "🌊", color: "#0891b2", desc: "Sync Mercury bank account balance and wire history.", status: "soon", featured: false, tags: ["coming soon"] },
  { id: "hubspot", name: "HubSpot CRM", cat: "api", icon: "🟠", color: "#ff5c35", desc: "Pull pipeline value and closed deals to project future revenue.", status: "available", featured: false, tags: [] },
];

const CATS = [
  { id: "all", label: "Todas" },
  { id: "spreadsheet", label: "Planilhas" },
  { id: "database", label: "Bancos de Dados" },
  { id: "erp", label: "ERPs" },
  { id: "accounting", label: "Contabilidade" },
  { id: "api", label: "APIs Financeiras" },
];

const STATUS_CFG = {
  connected: { label: "Conectado", color: "green" },
  available: { label: "Disponível", color: "accent" },
  soon: { label: "Em breve", color: "amber" },
};

function ConnectModal({ item, th, onClose, onConnect }) {
  const [step, setStep] = useState(0); // 0=form, 1=testing, 2=done
  const [fields, setFields] = useState({ host: "", port: "", db: "", user: "", pass: "" });

  const isDB = item.cat === "database";
  const isFile = item.cat === "spreadsheet" && item.id !== "gsheets";

  function handleConnect() {
    setStep(1);
    setTimeout(() => { setStep(2); }, 2200);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div style={{ width: 440, background: th.solidPanel, borderRadius: 20, border: `1px solid ${th.border}`, boxShadow: th.shadow, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${th.border}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: item.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: th.text }}>Conectar {item.name}</div>
            <div style={{ fontSize: 12, color: th.textM, marginTop: 2 }}>Configure a conexão abaixo</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: th.textM, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</button>
        </div>

        <div style={{ padding: "22px 24px" }}>
          {step === 0 && (
            <>
              {isDB && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 10 }}>
                  {[["host", "Host / IP"], ["port", "Porta"], ["db", "Banco de Dados"], ["user", "Usuário"], ["pass", "Senha"]].map(([k, lbl], idx) => (
                    <div key={k} style={{ gridColumn: k === "host" ? "1" : k === "port" ? "2" : "1 / -1", marginTop: idx > 1 ? 10 : 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: th.textM, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</div>
                      <input
                        type={k === "pass" ? "password" : "text"}
                        value={fields[k]} onChange={(e) => setFields({ ...fields, [k]: e.target.value })}
                        placeholder={k === "host" ? "db.empresa.com" : k === "port" ? "5432" : ""}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = th.accent)}
                        onBlur={(e) => (e.target.style.borderColor = th.border)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {isFile && (
                <div style={{ border: `2px dashed ${th.borderH}`, borderRadius: 14, padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: th.text, marginBottom: 6 }}>Arraste ou selecione o arquivo</div>
                  <div style={{ fontSize: 12, color: th.textM, marginBottom: 14 }}>Formatos aceitos: .xlsx, .csv, .tsv</div>
                  <button style={{ padding: "8px 18px", borderRadius: 9, border: `1px solid ${th.borderA}`, background: th.accentBg, color: th.accentL, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Selecionar arquivo</button>
                </div>
              )}
              {!isDB && !isFile && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 14, color: th.textS, lineHeight: 1.7, marginBottom: 18 }}>
                    Você será redirecionado para autorizar a conexão com <strong style={{ color: th.text }}>{item.name}</strong> via OAuth.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "10px 16px", background: th.greenBg, border: `1px solid ${th.greenB}`, borderRadius: 10 }}>
                    <span style={{ color: th.green }}>🔒</span>
                    <span style={{ fontSize: 12, color: th.green, fontWeight: 600 }}>Conexão segura via OAuth 2.0 — sem armazenar senha</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleConnect}
                style={{ marginTop: 20, width: "100%", padding: "12px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#4f46e5,#2563eb)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(79,70,229,0.35)" }}
              >{isFile ? "Importar arquivo" : isDB ? "Testar conexão" : "Autorizar acesso"}</button>
            </>
          )}

          {step === 1 && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 14, animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 6 }}>Testando conexão...</div>
              <div style={{ fontSize: 12, color: th.textM }}>Isso pode levar alguns segundos</div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: th.greenBg, border: `1.5px solid ${th.greenB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>✓</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: th.green, marginBottom: 8 }}>Conectado com sucesso!</div>
              <div style={{ fontSize: 13, color: th.textS, marginBottom: 20 }}>{item.name} está sincronizando seus dados financeiros.</div>
              <button onClick={() => { onConnect(item.id); onClose(); }} style={{ padding: "10px 28px", borderRadius: 10, border: `1px solid ${th.greenB}`, background: th.greenBg, color: th.green, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Concluir</button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

function IntCard({ item, th, onConnect, onDisconnect }) {
  const cfg = STATUS_CFG[item.status];
  const connected = item.status === "connected";

  return (
    <div style={{ padding: "18px 20px", borderRadius: 16, background: th.bgCard, border: `1px solid ${connected ? th.greenB : th.border}`, boxShadow: th.shadowS, display: "flex", flexDirection: "column", gap: 0, position: "relative", transition: "border-color 0.2s, transform 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = connected ? th.greenB : th.borderH; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = connected ? th.greenB : th.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {item.tags.includes("popular") && (
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <Badge color="accent">popular</Badge>
        </div>
      )}
      {item.tags.includes("coming soon") && (
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <Badge color="amber">em breve</Badge>
        </div>
      )}
      {item.tags.includes("live") && (
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <Badge color="green" pulse>live</Badge>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 4 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: th.textS, lineHeight: 1.55 }}>{item.desc}</div>
        </div>
      </div>

      {connected && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", background: th.greenBg, border: `1px solid ${th.greenB}`, borderRadius: 8, marginBottom: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: th.green, display: "inline-block", animation: "cPulse 2s infinite" }} />
          <span style={{ fontSize: 11.5, color: th.green, fontWeight: 600 }}>Sincronizando — última atualização há 3 min</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 4 }}>
        {item.status !== "soon" ? (
          connected ? (
            <button
              onClick={() => onDisconnect(item.id)}
              style={{ flex: 1, padding: "8px", borderRadius: 9, border: `1px solid ${th.border}`, background: "transparent", color: th.textS, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >Desconectar</button>
          ) : (
            <button
              onClick={() => onConnect(item)}
              style={{ flex: 1, padding: "8px", borderRadius: 9, border: `1px solid ${th.borderA}`, background: th.accentBg, color: th.accentL, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >Conectar</button>
          )
        ) : (
          <div style={{ flex: 1, padding: "8px", borderRadius: 9, background: th.amberBg, border: `1px solid ${th.amberB}`, textAlign: "center", fontSize: 12, color: th.amber, fontWeight: 600 }}>Em breve</div>
        )}
      </div>
    </div>
  );
}

export function PageIntegrations() {
  const { th } = useC();
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [statuses, setStatuses] = useState(() => {
    const s = {};
    INTEGRATIONS.forEach((i) => { s[i.id] = i.status; });
    return s;
  });

  const filtered = INTEGRATIONS.filter((i) => {
    const matchCat = cat === "all" || i.cat === cat;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).map((i) => ({ ...i, status: statuses[i.id] }));

  const connectedCount = Object.values(statuses).filter((s) => s === "connected").length;

  function handleConnect(item) { setModal(item); }
  function handleConnected(id) { setStatuses((s) => ({ ...s, [id]: "connected" })); }
  function handleDisconnect(id) { setStatuses((s) => ({ ...s, [id]: "available" })); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: th.text, letterSpacing: "-0.03em", marginBottom: 5 }}>Integrações</div>
          <div style={{ fontSize: 12.5, color: th.textM }}>Conecte suas fontes de dados financeiros ao CFOup</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "8px 16px", borderRadius: 10, background: th.greenBg, border: `1px solid ${th.greenB}`, fontSize: 13, fontWeight: 700, color: th.green }}>
            {connectedCount} conectada{connectedCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
        {[
          { label: "Disponíveis", value: INTEGRATIONS.filter((i) => i.status === "available").length, icon: "◈", color: th.accent },
          { label: "Conectadas", value: connectedCount, icon: "✓", color: th.green },
          { label: "Em breve", value: INTEGRATIONS.filter((i) => i.status === "soon").length, icon: "◷", color: th.amber },
          { label: "Registros hoje", value: "4.2k", icon: "↗", color: th.cyan },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: th.bgCard, border: `1px solid ${th.border}`, boxShadow: th.shadowS }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
              <span style={{ fontSize: 14, color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: th.text, letterSpacing: "-0.03em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar integração..."
          style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", width: 220, fontFamily: "inherit" }}
          onFocus={(e) => (e.target.style.borderColor = th.accent)}
          onBlur={(e) => (e.target.style.borderColor = th.border)}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATS.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${cat === c.id ? th.borderA : th.border}`, background: cat === c.id ? th.accentBg : "transparent", color: cat === c.id ? th.accentL : th.textS, fontSize: 12, fontWeight: cat === c.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Featured section */}
      {cat === "all" && !search && (
        <>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Destaques</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 13 }}>
              {filtered.filter((i) => i.featured).map((item) => (
                <IntCard key={item.id} item={item} th={th} onConnect={handleConnect} onDisconnect={handleDisconnect} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Todas as integrações</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 13 }}>
              {filtered.filter((i) => !i.featured).map((item) => (
                <IntCard key={item.id} item={item} th={th} onConnect={handleConnect} onDisconnect={handleDisconnect} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Filtered list */}
      {(cat !== "all" || search) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 13 }}>
          {filtered.length > 0
            ? filtered.map((item) => <IntCard key={item.id} item={item} th={th} onConnect={handleConnect} onDisconnect={handleDisconnect} />)
            : <div style={{ gridColumn: "1/-1", padding: "48px 0", textAlign: "center", color: th.textM, fontSize: 14 }}>Nenhuma integração encontrada.</div>
          }
        </div>
      )}

      {/* CTA banner */}
      <div style={{ padding: "22px 28px", borderRadius: 16, background: "linear-gradient(135deg,rgba(99,102,241,0.14),rgba(37,99,235,0.1))", border: `1px solid ${th.borderA}`, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 5 }}>Não encontrou sua ferramenta?</div>
          <div style={{ fontSize: 13, color: th.textS }}>Solicite uma integração ou conecte via nossa API REST e webhooks.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${th.borderA}`, background: th.accentBg, color: th.accentL, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Solicitar integração</button>
          <button style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4f46e5,#2563eb)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(79,70,229,0.35)" }}>Ver documentação API</button>
        </div>
      </div>

      {modal && <ConnectModal item={modal} th={th} onClose={() => setModal(null)} onConnect={handleConnected} />}
    </div>
  );
}
