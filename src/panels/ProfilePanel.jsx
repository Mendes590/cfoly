import { useState, useRef } from "react";
import { useC } from "../core/context.jsx";

function Field({ label, fkey, ph, form, setForm, th }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      <input
        value={form[fkey]}
        onChange={(e) => setForm((p) => ({ ...p, [fkey]: e.target.value }))}
        placeholder={ph}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 9,
          border: `1px solid ${th.border}`, background: th.bgInput,
          color: th.text, fontSize: 13, outline: "none",
          fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.14s",
        }}
        onFocus={(e) => (e.target.style.borderColor = th.accent)}
        onBlur={(e) => (e.target.style.borderColor = th.border)}
      />
    </div>
  );
}

export function ProfilePanel({ onClose, user, setUser, onLogout }) {
  const { th } = useC();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({
    name: user.name, role: user.role, email: user.email, phone: user.phone,
    company: user.company, cnpj: user.cnpj, sector: user.sector, employees: user.employees,
  });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const save = () => {
    setUser((u) => ({
      ...u, ...form,
      initials: form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUser((u) => ({ ...u, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const fp = { form, setForm, th };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
      <div style={{
        position: "fixed", top: 60, right: 14, width: 360,
        background: th.solidPanel, border: `1px solid ${th.border}`,
        borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        zIndex: 999, maxHeight: "calc(100vh - 80px)",
        display: "flex", flexDirection: "column",
        animation: "aiPopupDown 0.2s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{ padding: "18px 20px 0", display: "flex", gap: 14, alignItems: "center", marginBottom: 14, flexShrink: 0 }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: user.avatar ? "none" : "linear-gradient(135deg,#4f46e5,#2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#fff",
              overflow: "hidden", boxShadow: "0 3px 12px rgba(79,70,229,0.4)",
            }}>
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : user.initials}
            </div>
            <div style={{
              position: "absolute", bottom: -2, right: -2, width: 20, height: 20,
              borderRadius: "50%", background: th.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#fff", border: `2px solid ${th.solidPanel}`,
            }}>✏</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: th.text }}>{user.name}</div>
            <div style={{ fontSize: 12, color: th.textM }}>{user.role} · {user.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: th.green, boxShadow: `0 0 5px ${th.green}` }} />
              <span style={{ fontSize: 11, color: th.green, fontWeight: 600 }}>Online</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{ fontSize: 11, fontWeight: 700, color: th.red, background: th.redBg, border: `1px solid ${th.redB}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}
          >Sair</button>
        </div>

        <div style={{ display: "flex", padding: "0 20px", borderBottom: `1px solid ${th.border}`, flexShrink: 0 }}>
          {[{ id: "profile", label: "Perfil" }, { id: "company", label: "Empresa" }].map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              style={{
                padding: "9px 16px", background: "none", border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: tab === tb.id ? 700 : 500,
                color: tab === tb.id ? th.accentL : th.textM,
                borderBottom: `2px solid ${tab === tb.id ? th.accent : "transparent"}`,
                marginBottom: -1, fontFamily: "inherit",
              }}
            >{tb.label}</button>
          ))}
        </div>

        <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
          {tab === "profile" ? (
            <>
              <Field label="Nome completo" fkey="name" ph="Ronaldo Santos" {...fp} />
              <Field label="Cargo" fkey="role" ph="CFO, CEO..." {...fp} />
              <Field label="E-mail" fkey="email" ph="ronaldo@empresa.com" {...fp} />
              <Field label="Telefone" fkey="phone" ph="+55 11 99999-9999" {...fp} />
            </>
          ) : (
            <>
              <Field label="Nome da empresa" fkey="company" ph="Minha Empresa Ltda" {...fp} />
              <Field label="CNPJ" fkey="cnpj" ph="00.000.000/0001-00" {...fp} />
              <Field label="Setor" fkey="sector" ph="Serviços, Construção..." {...fp} />
              <Field label="Funcionários" fkey="employees" ph="10-50" {...fp} />
            </>
          )}
          <button
            onClick={save}
            style={{
              marginTop: 4, padding: "10px", borderRadius: 10,
              border: saved ? `1px solid ${th.greenB}` : "none",
              background: saved ? th.greenBg : "linear-gradient(90deg,#4f46e5,#2563eb)",
              color: saved ? th.green : "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: saved ? "none" : "0 3px 12px rgba(79,70,229,0.35)",
            }}
          >{saved ? "✓ Salvo!" : "Salvar alterações"}</button>
        </div>
      </div>
    </>
  );
}
