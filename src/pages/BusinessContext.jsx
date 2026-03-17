import { useState, useRef, useEffect } from "react";
import { useC } from "../core/context.jsx";
import { Card } from "../components/ui/Card.jsx";

// ─── Audio mode ───────────────────────────────────────────────────────────────
function AudioMode({ th }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  const mockTranscripts = [
    "Somos uma empresa de tecnologia B2B com modelo de receita recorrente (SaaS). Nosso maior cliente representa cerca de 42% da receita, o que nos preocupa bastante. Nosso principal objetivo agora é diversificar a base de clientes e melhorar o runway de caixa para pelo menos 6 meses.",
    "Atuamos no setor de construção civil com contratos de longo prazo. Ter um cliente grande não é um problema pra gente — é normal no nosso setor. Nosso foco atual é melhorar a margem líquida e preparar a empresa para uma expansão em 2026.",
  ];

  const startRec = () => {
    setRecording(true);
    setDone(false);
    timerRef.current = setTimeout(() => {
      setRecording(false);
      setDone(true);
      setTranscript(mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]);
    }, 3500);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const topics = ["Qual seu setor?", "Modelo de negócio?", "Maior risco atual?", "Principal meta?", "Runway ideal?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "8px 0" }}>
      {!done ? (
        <>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: th.text, marginBottom: 8 }}>
              {recording ? "Gravando... fale sobre seu negócio" : "Clique para falar sobre seu negócio"}
            </div>
            <div style={{ fontSize: 12.5, color: th.textM, maxWidth: 420 }}>
              Fale naturalmente sobre seu setor, modelo de receita, principais riscos e objetivos
            </div>
          </div>

          {/* Mic button */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {recording && (
              <>
                <div style={{ position: "absolute", width: 110, height: 110, borderRadius: "50%", background: "#ef444420", animation: "micPulse1 1.5s ease-in-out infinite" }} />
                <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "50%", background: "#ef444430", animation: "micPulse2 1.5s 0.3s ease-in-out infinite" }} />
              </>
            )}
            <button
              onClick={recording ? undefined : startRec}
              style={{
                width: 72, height: 72, borderRadius: "50%", border: "none", cursor: recording ? "default" : "pointer",
                background: recording ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#4f46e5,#2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: recording ? "0 0 0 4px rgba(239,68,68,0.25), 0 8px 24px rgba(239,68,68,0.4)" : "0 8px 24px rgba(79,70,229,0.45)",
                transition: "all 0.25s", fontSize: 28,
              }}
            >🎤</button>
          </div>

          {/* Waveform animation when recording */}
          {recording && (
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: 32 }}>
              {[0.4, 0.7, 1, 0.85, 0.6, 0.9, 0.5, 0.75, 1, 0.65, 0.45, 0.8].map((h, i) => (
                <div key={i} style={{
                  width: 4, borderRadius: 4, background: "#ef4444",
                  animation: `waveBar 0.8s ${i * 0.07}s ease-in-out infinite alternate`,
                  height: `${h * 32}px`,
                }} />
              ))}
            </div>
          )}

          {/* Topic chips */}
          {!recording && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
              {topics.map((tp, i) => (
                <span key={i} style={{ padding: "6px 14px", borderRadius: 20, background: th.bgSection, border: `1px solid ${th.border}`, fontSize: 12, color: th.textM, cursor: "pointer" }}>
                  {tp}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: th.greenBg, border: `1px solid ${th.greenB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✓</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: th.green }}>Contexto capturado! Revise e ajuste se necessário.</div>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: "13px 15px", borderRadius: 12, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", lineHeight: 1.65, transition: "border-color 0.14s" }}
            onFocus={(e) => (e.target.style.borderColor = th.accent)}
            onBlur={(e) => (e.target.style.borderColor = th.border)}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
            <button onClick={() => { setDone(false); setTranscript(""); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${th.border}`, background: "transparent", color: th.textS, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Regravar
            </button>
            <button onClick={() => {
              localStorage.setItem("cfoup_ctx_filled", "true");
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
              style={{ padding: "9px 22px", borderRadius: 10, border: saved ? `1px solid ${th.greenB}` : "none", background: saved ? th.greenBg : "linear-gradient(135deg,#4f46e5,#2563eb)", color: saved ? th.green : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: saved ? "none" : "0 3px 12px rgba(79,70,229,0.35)" }}>
              {saved ? "✓ Salvo!" : "Salvar Contexto"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes micPulse1 { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:0.3} }
        @keyframes micPulse2 { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.1);opacity:0.2} }
        @keyframes waveBar { from{opacity:0.5} to{opacity:1} }
      `}</style>
    </div>
  );
}

// ─── Text mode ────────────────────────────────────────────────────────────────
function TextMode({ th }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const prompts = [
    { label: "Setor", snippet: "Somos uma empresa do setor de " },
    { label: "Modelo", snippet: "\nNosso modelo de negócio é " },
    { label: "Clientes", snippet: "\nNosso maior cliente representa " },
    { label: "Risco", snippet: "\nNosso principal risco financeiro é " },
    { label: "Meta", snippet: "\nNosso principal objetivo é " },
    { label: "Concentração", snippet: "\nConcentração de clientes é " },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: "13px 16px", borderRadius: 12, background: th.accentBg, border: `1px solid ${th.borderA}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: th.accentL, marginBottom: 5 }}>Como descrever seu negócio</div>
        <div style={{ fontSize: 12, color: th.textS, lineHeight: 1.6 }}>
          Escreva livremente sobre seu setor, modelo de receita, concentração de clientes e objetivos. A IA usará esse contexto para calibrar alertas e análises especificamente para o seu caso.
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Contexto do negócio</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Somos uma empresa de construção civil B2B com contratos anuais de R$500k. Nosso maior cliente representa 42% da receita, mas temos contrato vigente até 2027. Nosso principal objetivo é abrir 2 novas frentes em 2026..."
          rows={8}
          style={{ width: "100%", padding: "13px 15px", borderRadius: 12, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", lineHeight: 1.65, transition: "border-color 0.14s" }}
          onFocus={(e) => (e.target.style.borderColor = th.accent)}
          onBlur={(e) => (e.target.style.borderColor = th.border)}
        />
        <div style={{ fontSize: 11, color: th.textM, textAlign: "right", marginTop: 5 }}>{text.length} / 1000 caracteres</div>
      </div>

      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Adicionar contexto rápido</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {prompts.map((p, i) => (
            <button key={i}
              onClick={() => setText((prev) => prev + p.snippet)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${th.borderA}`, background: th.accentBg, color: th.accentL, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.14s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = th.accent; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = th.accentBg; e.currentTarget.style.color = th.accentL; }}
            >+ {p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => { if (text.trim()) { localStorage.setItem("cfoup_ctx_filled", "true"); setSaved(true); setTimeout(() => setSaved(false), 2500); } }}
          style={{ padding: "11px 28px", borderRadius: 11, border: saved ? `1px solid ${th.greenB}` : "none", background: saved ? th.greenBg : text.trim() ? "linear-gradient(135deg,#4f46e5,#2563eb)" : th.bgSection, color: saved ? th.green : text.trim() ? "#fff" : th.textM, fontSize: 13, fontWeight: 700, cursor: text.trim() ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.2s", boxShadow: saved || !text.trim() ? "none" : "0 3px 12px rgba(79,70,229,0.35)" }}
        >{saved ? "✓ Contexto Salvo!" : "Salvar Contexto"}</button>
      </div>
    </div>
  );
}

// ─── Guided mode ──────────────────────────────────────────────────────────────
function GuidedMode({ th }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [ctx, setCtx] = useState({ industry: "", model: "", avgTicket: "", topClient: "", concentrated: "", goal: "", runway_goal: "", margin_goal: "", risk_tolerance: "", notes: "" });
  const set = (k, v) => setCtx((p) => ({ ...p, [k]: v }));

  const ChipGroup = ({ label, options, field }) => (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => set(field, opt)}
            style={{ padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${ctx[field] === opt ? th.accent : th.border}`, background: ctx[field] === opt ? th.accentBg : "transparent", color: ctx[field] === opt ? th.accentL : th.textS, fontSize: 13, fontWeight: ctx[field] === opt ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const TextInput = ({ label, field, ph }) => (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</label>
      <input value={ctx[field]} onChange={(e) => set(field, e.target.value)} placeholder={ph}
        style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.14s" }}
        onFocus={(e) => (e.target.style.borderColor = th.accent)} onBlur={(e) => (e.target.style.borderColor = th.border)} />
    </div>
  );

  const steps = [
    {
      icon: "🏢", title: "Sobre o negócio", sub: "Contexto básico para a IA entender sua empresa",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <ChipGroup label="Setor de atuação" field="industry" options={["Serviços", "Construção", "Tecnologia", "Saúde", "Varejo", "Indústria", "Agro", "Educação", "Outro"]} />
          <ChipGroup label="Modelo de negócio" field="model" options={["B2B recorrente", "B2B projeto", "B2C", "Marketplace", "SaaS", "Outro"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextInput label="Ticket médio" field="avgTicket" ph="Ex: R$ 15.000 / mês" />
            <TextInput label="Maior cliente (% receita)" field="topClient" ph="Ex: 42%" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Concentração de clientes é um problema?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: "sim", l: "Sim, me preocupa" }, { v: "nao", l: "Não, é normal" }, { v: "parcial", l: "Parcialmente" }].map((o) => (
                <button key={o.v} onClick={() => set("concentrated", o.v)}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${ctx.concentrated === o.v ? th.accent : th.border}`, background: ctx.concentrated === o.v ? th.accentBg : "transparent", color: ctx.concentrated === o.v ? th.accentL : th.textS, fontSize: 12.5, fontWeight: ctx.concentrated === o.v ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: "🎯", title: "Seus objetivos", sub: "A IA vai personalizar as análises para o que importa pra você",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Principal objetivo agora</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { v: "crescer", l: "Crescer receita rapidamente", desc: "Captar novos clientes, expandir" },
                { v: "lucratividade", l: "Aumentar lucratividade", desc: "Melhorar margem, cortar custos" },
                { v: "estabilidade", l: "Estabilizar o caixa", desc: "Aumentar runway, reduzir risco" },
                { v: "expansao", l: "Preparar para expansão", desc: "Levantar capital, abrir filiais" },
              ].map((o) => (
                <button key={o.v} onClick={() => set("goal", o.v)}
                  style={{ padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${ctx.goal === o.v ? th.accent : th.border}`, background: ctx.goal === o.v ? th.accentBg : "transparent", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${ctx.goal === o.v ? th.accent : th.border}`, background: ctx.goal === o.v ? th.accent : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {ctx.goal === o.v && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: ctx.goal === o.v ? 700 : 600, color: ctx.goal === o.v ? th.accentL : th.text }}>{o.l}</div>
                    <div style={{ fontSize: 11.5, color: th.textM }}>{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextInput label="Meta de runway (dias)" field="runway_goal" ph="Ex: 180 dias" />
            <TextInput label="Meta de margem líquida" field="margin_goal" ph="Ex: 35%" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Tolerância a risco</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: "low", l: "Conservador", c: th.green }, { v: "med", l: "Moderado", c: th.amber }, { v: "high", l: "Agressivo", c: th.red }].map((o) => (
                <button key={o.v} onClick={() => set("risk_tolerance", o.v)}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${ctx.risk_tolerance === o.v ? o.c : th.border}`, background: ctx.risk_tolerance === o.v ? o.c + "18" : "transparent", color: ctx.risk_tolerance === o.v ? o.c : th.textS, fontSize: 13, fontWeight: ctx.risk_tolerance === o.v ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: "💬", title: "Contexto adicional", sub: "Opcional — quanto mais a IA sabe, mais precisa fica a análise",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "13px 16px", borderRadius: 12, background: th.accentBg, border: `1px solid ${th.borderA}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: th.accentL, marginBottom: 5 }}>Como esse contexto é usado</div>
            <div style={{ fontSize: 12, color: th.textS, lineHeight: 1.6 }}>A IA vai calibrar os alertas com base no seu perfil. Por exemplo: se você é do setor de construção B2B, ter 1 cliente grande pode ser normal. Se é SaaS, 42% em 1 cliente é crítico.</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: th.textM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Contexto livre (opcional)</label>
            <textarea value={ctx.notes} onChange={(e) => set("notes", e.target.value)}
              placeholder="Ex: Somos uma construtora com contratos anuais. Ter 1 cliente grande não nos preocupa pois temos contratos de longo prazo assinados..."
              rows={5}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: `1px solid ${th.border}`, background: th.bgInput, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, transition: "border-color 0.14s" }}
              onFocus={(e) => (e.target.style.borderColor = th.accent)} onBlur={(e) => (e.target.style.borderColor = th.border)} />
          </div>
          {(ctx.industry || ctx.goal) && (
            <div style={{ padding: "13px 15px", borderRadius: 12, background: th.bgSection, border: `1px solid ${th.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.text, marginBottom: 8 }}>Resumo do contexto</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {ctx.industry && <span style={{ padding: "4px 10px", borderRadius: 20, background: th.accentBg, color: th.accentL, fontSize: 11.5, fontWeight: 600 }}>{ctx.industry}</span>}
                {ctx.model && <span style={{ padding: "4px 10px", borderRadius: 20, background: th.greenBg, color: th.green, fontSize: 11.5, fontWeight: 600 }}>{ctx.model}</span>}
                {ctx.goal && <span style={{ padding: "4px 10px", borderRadius: 20, background: th.amberBg, color: th.amber, fontSize: 11.5, fontWeight: 600 }}>Meta: {ctx.goal}</span>}
                {ctx.risk_tolerance && <span style={{ padding: "4px 10px", borderRadius: 20, background: th.bgSection, color: th.textS, fontSize: 11.5, fontWeight: 600 }}>Risco: {ctx.risk_tolerance}</span>}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Step tabs */}
      <div style={{ display: "flex", gap: 0, background: th.bgSection, borderRadius: 14, padding: 4, border: `1px solid ${th.border}` }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ flex: 1, padding: "10px 6px", borderRadius: 11, border: "none", background: step === i ? th.solidPanel : "transparent", color: step === i ? th.text : th.textM, fontSize: 12.5, fontWeight: step === i ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: step === i ? th.shadowS : "none" }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{s.title}</span>
          </button>
        ))}
      </div>

      <Card>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: th.text, marginBottom: 4 }}>{steps[step].title}</div>
          <div style={{ fontSize: 13, color: th.textM }}>{steps[step].sub}</div>
        </div>
        {steps[step].content}
      </Card>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: "11px 22px", borderRadius: 11, border: `1px solid ${th.border}`, background: "transparent", color: step === 0 ? th.textM : th.textS, fontSize: 13, fontWeight: 600, cursor: step === 0 ? "default" : "pointer", fontFamily: "inherit", opacity: step === 0 ? 0.4 : 1, transition: "all 0.15s" }}>← Anterior</button>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 6, background: i === step ? th.accent : i < step ? th.accentL + "60" : th.border, transition: "all 0.3s" }} />
          ))}
        </div>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            style={{ padding: "11px 22px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#4f46e5,#2563eb)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(79,70,229,0.35)" }}>Próximo →</button>
        ) : (
          <button onClick={() => {
            localStorage.setItem("cfoup_ctx_filled", "true");
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
            style={{ padding: "11px 22px", borderRadius: 11, border: saved ? `1px solid ${th.greenB}` : "none", background: saved ? th.greenBg : "linear-gradient(135deg,#4f46e5,#2563eb)", color: saved ? th.green : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: saved ? "none" : "0 3px 12px rgba(79,70,229,0.35)" }}>
            {saved ? "✓ Contexto Salvo!" : "Salvar Contexto"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function PageContext() {
  const { th } = useC();
  const [mode, setMode] = useState("audio");

  const modes = [
    { id: "audio", icon: "🎤", label: "Falar", desc: "Diga com suas palavras" },
    { id: "text", icon: "✍️", label: "Escrever", desc: "Texto livre" },
    { id: "guided", icon: "🎯", label: "Guiado", desc: "Passo a passo" },
  ];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ padding: "22px 26px", borderRadius: 18, background: `linear-gradient(135deg,rgba(99,102,241,0.12),rgba(37,99,235,0.08))`, border: `1px solid ${th.borderA}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(79,70,229,0.4)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: th.text, letterSpacing: "-0.02em" }}>Contexto do Negócio</div>
            <div style={{ fontSize: 13, color: th.textM, marginTop: 2 }}>Ajude a IA a entender o seu negócio para análises mais precisas</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: th.textS, lineHeight: 1.65, padding: "11px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: `1px solid rgba(255,255,255,0.07)` }}>
          A IA usa esse contexto para calibrar alertas e análises. Por exemplo: concentração de 42% num único cliente pode ser <strong style={{ color: th.text }}>normal para uma construtora</strong> mas <strong style={{ color: th.red }}>crítico para um SaaS</strong>.
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {modes.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{ padding: "16px 14px", borderRadius: 14, border: `2px solid ${mode === m.id ? th.accent : th.border}`, background: mode === m.id ? th.accentBg : th.bgCard, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", textAlign: "center", boxShadow: mode === m.id ? `0 0 0 3px ${th.accent}22` : "none" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: mode === m.id ? th.accentL : th.text, marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 11.5, color: th.textM }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Mode content */}
      <Card>
        {mode === "audio" && <AudioMode th={th} />}
        {mode === "text" && <TextMode th={th} />}
        {mode === "guided" && <GuidedMode th={th} />}
      </Card>
    </div>
  );
}
