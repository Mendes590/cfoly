import { useState, useEffect, useRef } from "react";
import { useC, renderMD } from "../core/context.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";

/* ─── Storage key ────────────────────────────────────────────────────────── */
const STORAGE_KEY = "cfoup_valuation_v1";

/* ─── Questions (6 total) ────────────────────────────────────────────────── */
const QUESTIONS = {
  pt: [
    {
      id: "industry",
      label: "Setor / Indústria",
      hint: "Setores com receita previsível e escalável valem mais no mercado.",
      options: [
        { id: "saas",      label: "SaaS / Software",     mult: 1.4,  arr: null },
        { id: "services",  label: "Serviços de TI",       mult: 1.0,  arr: null },
        { id: "health",    label: "Saúde / HealthTech",   mult: 1.1,  arr: null },
        { id: "ecommerce", label: "E-commerce",            mult: 0.8,  arr: null },
        { id: "retail",    label: "Varejo / Físico",      mult: 0.55, arr: null },
      ],
    },
    {
      id: "revenue",
      label: "Receita Anual Recorrente (ARR)",
      hint: "Base de cálculo do valuation. Use a receita anualizada atual.",
      options: [
        { id: "micro",  label: "Menos de R$500k",     mult: 1.0, arr: 250_000  },
        { id: "small",  label: "R$500k – R$2M",       mult: 1.0, arr: 1_250_000},
        { id: "mid",    label: "R$2M – R$5M",         mult: 1.0, arr: 3_500_000},
        { id: "large",  label: "R$5M – R$15M",        mult: 1.0, arr: 10_000_000},
        { id: "xlarge", label: "Acima de R$15M",      mult: 1.0, arr: 20_000_000},
      ],
    },
    {
      id: "growth",
      label: "Taxa de Crescimento Anual",
      hint: "Crescimento é o maior driver de valuation em empresas de tecnologia.",
      options: [
        { id: "hyper", label: "Mais de 60% a.a.",  mult: 1.55, arr: null },
        { id: "high",  label: "30% – 60% a.a.",    mult: 1.28, arr: null },
        { id: "med",   label: "10% – 30% a.a.",    mult: 1.0,  arr: null },
        { id: "low",   label: "Menos de 10% a.a.", mult: 0.78, arr: null },
      ],
    },
    {
      id: "recurring",
      label: "Receita Recorrente (%)",
      hint: "Receita recorrente reduz risco e aumenta o múltiplo de avaliação.",
      options: [
        { id: "very_high", label: "Acima de 80%",  mult: 1.35, arr: null },
        { id: "high",      label: "50% – 80%",     mult: 1.0,  arr: null },
        { id: "med",       label: "20% – 50%",     mult: 0.82, arr: null },
        { id: "low",       label: "Menos de 20%",  mult: 0.65, arr: null },
      ],
    },
    {
      id: "concentration",
      label: "Concentração no Maior Cliente",
      hint: "Alta dependência de um cliente aumenta o risco percebido.",
      options: [
        { id: "low",  label: "Menos de 20% da receita", mult: 1.15, arr: null },
        { id: "med",  label: "20% – 40%",               mult: 0.90, arr: null },
        { id: "high", label: "Mais de 40%",              mult: 0.70, arr: null },
      ],
    },
    {
      id: "stage",
      label: "Estágio da Empresa",
      hint: "Empresas em fase de escala recebem prêmio de múltiplo dos investidores.",
      options: [
        { id: "early",      label: "Inicial / Validação", mult: 0.82, arr: null },
        { id: "growth",     label: "Crescimento",          mult: 1.12, arr: null },
        { id: "scale",      label: "Escala",               mult: 1.35, arr: null },
        { id: "profitable", label: "Lucrativo / Maduro",   mult: 1.10, arr: null },
      ],
    },
  ],
  en: [
    {
      id: "industry",
      label: "Industry",
      hint: "Industries with predictable and scalable revenue command higher multiples.",
      options: [
        { id: "saas",      label: "SaaS / Software",    mult: 1.4,  arr: null },
        { id: "services",  label: "Tech Services",       mult: 1.0,  arr: null },
        { id: "health",    label: "Health / HealthTech", mult: 1.1,  arr: null },
        { id: "ecommerce", label: "E-commerce",          mult: 0.8,  arr: null },
        { id: "retail",    label: "Retail / Physical",   mult: 0.55, arr: null },
      ],
    },
    {
      id: "revenue",
      label: "Annual Recurring Revenue (ARR)",
      hint: "Basis for the valuation calculation. Use your current annualized revenue.",
      options: [
        { id: "micro",  label: "Under $500k",    mult: 1.0, arr: 250_000   },
        { id: "small",  label: "$500k – $2M",    mult: 1.0, arr: 1_250_000 },
        { id: "mid",    label: "$2M – $5M",      mult: 1.0, arr: 3_500_000 },
        { id: "large",  label: "$5M – $15M",     mult: 1.0, arr: 10_000_000},
        { id: "xlarge", label: "Above $15M",     mult: 1.0, arr: 20_000_000},
      ],
    },
    {
      id: "growth",
      label: "Annual Growth Rate",
      hint: "Growth rate is the biggest driver of valuation in technology companies.",
      options: [
        { id: "hyper", label: "Above 60% p.a.", mult: 1.55, arr: null },
        { id: "high",  label: "30% – 60% p.a.", mult: 1.28, arr: null },
        { id: "med",   label: "10% – 30% p.a.", mult: 1.0,  arr: null },
        { id: "low",   label: "Under 10% p.a.", mult: 0.78, arr: null },
      ],
    },
    {
      id: "recurring",
      label: "Recurring Revenue (%)",
      hint: "Recurring revenue reduces risk and increases your valuation multiple.",
      options: [
        { id: "very_high", label: "Above 80%", mult: 1.35, arr: null },
        { id: "high",      label: "50% – 80%", mult: 1.0,  arr: null },
        { id: "med",       label: "20% – 50%", mult: 0.82, arr: null },
        { id: "low",       label: "Under 20%", mult: 0.65, arr: null },
      ],
    },
    {
      id: "concentration",
      label: "Top Customer Concentration",
      hint: "High dependency on one customer increases perceived risk.",
      options: [
        { id: "low",  label: "Under 20% of revenue", mult: 1.15, arr: null },
        { id: "med",  label: "20% – 40%",             mult: 0.90, arr: null },
        { id: "high", label: "Above 40%",              mult: 0.70, arr: null },
      ],
    },
    {
      id: "stage",
      label: "Company Stage",
      hint: "Companies in the scaling phase command a multiple premium from investors.",
      options: [
        { id: "early",      label: "Early / Validation", mult: 0.82, arr: null },
        { id: "growth",     label: "Growth",              mult: 1.12, arr: null },
        { id: "scale",      label: "Scaling",             mult: 1.35, arr: null },
        { id: "profitable", label: "Profitable / Mature", mult: 1.10, arr: null },
      ],
    },
  ],
  es: [
    {
      id: "industry",
      label: "Sector / Industria",
      hint: "Los sectores con ingresos predecibles y escalables valen más.",
      options: [
        { id: "saas",      label: "SaaS / Software",   mult: 1.4,  arr: null },
        { id: "services",  label: "Servicios de TI",   mult: 1.0,  arr: null },
        { id: "health",    label: "Salud / HealthTech", mult: 1.1,  arr: null },
        { id: "ecommerce", label: "E-commerce",         mult: 0.8,  arr: null },
        { id: "retail",    label: "Retail / Físico",   mult: 0.55, arr: null },
      ],
    },
    {
      id: "revenue",
      label: "Ingresos Anuales Recurrentes (ARR)",
      hint: "Base del cálculo de valuación. Use sus ingresos anualizados actuales.",
      options: [
        { id: "micro",  label: "Menos de $500k",  mult: 1.0, arr: 250_000   },
        { id: "small",  label: "$500k – $2M",     mult: 1.0, arr: 1_250_000 },
        { id: "mid",    label: "$2M – $5M",       mult: 1.0, arr: 3_500_000 },
        { id: "large",  label: "$5M – $15M",      mult: 1.0, arr: 10_000_000},
        { id: "xlarge", label: "Más de $15M",     mult: 1.0, arr: 20_000_000},
      ],
    },
    {
      id: "growth",
      label: "Tasa de Crecimiento Anual",
      hint: "El crecimiento es el mayor driver de valuación en empresas de tecnología.",
      options: [
        { id: "hyper", label: "Más de 60% a.a.", mult: 1.55, arr: null },
        { id: "high",  label: "30% – 60% a.a.", mult: 1.28, arr: null },
        { id: "med",   label: "10% – 30% a.a.", mult: 1.0,  arr: null },
        { id: "low",   label: "Menos de 10% a.a.", mult: 0.78, arr: null },
      ],
    },
    {
      id: "recurring",
      label: "Ingresos Recurrentes (%)",
      hint: "Los ingresos recurrentes reducen el riesgo y aumentan el múltiplo.",
      options: [
        { id: "very_high", label: "Más de 80%", mult: 1.35, arr: null },
        { id: "high",      label: "50% – 80%",  mult: 1.0,  arr: null },
        { id: "med",       label: "20% – 50%",  mult: 0.82, arr: null },
        { id: "low",       label: "Menos de 20%", mult: 0.65, arr: null },
      ],
    },
    {
      id: "concentration",
      label: "Concentración en el Mayor Cliente",
      hint: "Alta dependencia de un cliente aumenta el riesgo percibido.",
      options: [
        { id: "low",  label: "Menos de 20% de ingresos", mult: 1.15, arr: null },
        { id: "med",  label: "20% – 40%",                mult: 0.90, arr: null },
        { id: "high", label: "Más de 40%",               mult: 0.70, arr: null },
      ],
    },
    {
      id: "stage",
      label: "Etapa de la Empresa",
      hint: "Las empresas en fase de escala reciben prima de múltiplo de los inversores.",
      options: [
        { id: "early",      label: "Inicial / Validación", mult: 0.82, arr: null },
        { id: "growth",     label: "Crecimiento",           mult: 1.12, arr: null },
        { id: "scale",      label: "Escalando",             mult: 1.35, arr: null },
        { id: "profitable", label: "Rentable / Maduro",     mult: 1.10, arr: null },
      ],
    },
  ],
};

/* ─── Copy strings ───────────────────────────────────────────────────────── */
const COPY = {
  pt: {
    /* locked */
    lockedTitle:    "Valuation da Empresa",
    lockedSub:      "Descubra quanto vale seu negócio",
    lockedHint:     "Responda 6 perguntas rápidas para gerar uma estimativa de valuation personalizada com base no seu modelo de negócio.",
    lockedFeature1: "Estimativa baseada em dados reais de mercado",
    lockedFeature2: "Múltiplo calibrado por 6 fatores do seu negócio",
    lockedFeature3: "Análise de IA com drivers e recomendações",
    lockedCta:      "Calcular Valuation",
    /* quiz */
    stepOf:         (s, t) => `Pergunta ${s} de ${t}`,
    back:           "Voltar",
    next:           "Próximo",
    finish:         "Ver Resultado",
    selectOption:   "Selecione uma opção para continuar",
    /* results */
    resultsTitle:   "Valuation Estimado",
    resultsSub:     "Baseado nas suas respostas — Método: Múltiplo de Receita (ARR)",
    confLabel:      "Confiança",
    confHigh:       "Alta",
    confMed:        "Média",
    confLow:        "Baixa",
    lowLabel:       "Pessimista",
    highLabel:      "Otimista",
    rangeLabel:     "Faixa",
    multipleLabel:  "Múltiplo",
    arrLabel:       "ARR",
    driversTitle:   "Drivers do Valuation",
    driversSub:     "Como cada fator impacta o seu múltiplo",
    aiTitle:        "Análise da IA",
    aiSub:          "Interpretação dos seus resultados",
    aiAnalyzeMore:  "Aprofundar análise",
    aiAnalyzeHide:  "Ocultar análise",
    increaseTitle:  "Como Aumentar seu Valuation",
    increaseSub:    "Ações recomendadas para maximizar o valor da empresa",
    recalculate:    "Recalcular",
    methodNote:     "Estimativa para fins informativos. Não constitui laudo de avaliação.",
    baseMultiple:   "Múltiplo base de mercado",
    industryFactor: "Fator indústria",
    growthFactor:   "Fator crescimento",
    recurringFactor:"Fator recorrência",
    concFactor:     "Fator concentração",
    stageFactor:    "Fator estágio",
  },
  en: {
    lockedTitle:    "Company Valuation",
    lockedSub:      "Find out how much your business is worth",
    lockedHint:     "Answer 6 quick questions to generate a personalized valuation estimate based on your business model.",
    lockedFeature1: "Estimate based on real market data",
    lockedFeature2: "Multiple calibrated by 6 business factors",
    lockedFeature3: "AI analysis with drivers and recommendations",
    lockedCta:      "Calculate Valuation",
    stepOf:         (s, t) => `Question ${s} of ${t}`,
    back:           "Back",
    next:           "Next",
    finish:         "See Result",
    selectOption:   "Select an option to continue",
    resultsTitle:   "Estimated Valuation",
    resultsSub:     "Based on your answers — Method: Revenue Multiple (ARR)",
    confLabel:      "Confidence",
    confHigh:       "High",
    confMed:        "Medium",
    confLow:        "Low",
    lowLabel:       "Pessimistic",
    highLabel:      "Optimistic",
    rangeLabel:     "Range",
    multipleLabel:  "Multiple",
    arrLabel:       "ARR",
    driversTitle:   "Valuation Drivers",
    driversSub:     "How each factor impacts your multiple",
    aiTitle:        "AI Analysis",
    aiSub:          "Interpretation of your results",
    aiAnalyzeMore:  "Deeper analysis",
    aiAnalyzeHide:  "Hide analysis",
    increaseTitle:  "How to Increase Your Valuation",
    increaseSub:    "Recommended actions to maximize company value",
    recalculate:    "Recalculate",
    methodNote:     "Estimate for informational purposes only. Not a formal valuation report.",
    baseMultiple:   "Market base multiple",
    industryFactor: "Industry factor",
    growthFactor:   "Growth factor",
    recurringFactor:"Recurring factor",
    concFactor:     "Concentration factor",
    stageFactor:    "Stage factor",
  },
  es: {
    lockedTitle:    "Valuación de la Empresa",
    lockedSub:      "Descubra cuánto vale su negocio",
    lockedHint:     "Responda 6 preguntas rápidas para generar una estimación de valuación personalizada.",
    lockedFeature1: "Estimación basada en datos reales de mercado",
    lockedFeature2: "Múltiplo calibrado por 6 factores de su negocio",
    lockedFeature3: "Análisis de IA con drivers y recomendaciones",
    lockedCta:      "Calcular Valuación",
    stepOf:         (s, t) => `Pregunta ${s} de ${t}`,
    back:           "Atrás",
    next:           "Siguiente",
    finish:         "Ver Resultado",
    selectOption:   "Seleccione una opción para continuar",
    resultsTitle:   "Valuación Estimada",
    resultsSub:     "Basado en sus respuestas — Método: Múltiplo de Ingresos (ARR)",
    confLabel:      "Confianza",
    confHigh:       "Alta",
    confMed:        "Media",
    confLow:        "Baja",
    lowLabel:       "Pesimista",
    highLabel:      "Optimista",
    rangeLabel:     "Rango",
    multipleLabel:  "Múltiplo",
    arrLabel:       "ARR",
    driversTitle:   "Drivers de Valuación",
    driversSub:     "Cómo cada factor impacta su múltiplo",
    aiTitle:        "Análisis de IA",
    aiSub:          "Interpretación de sus resultados",
    aiAnalyzeMore:  "Análisis más profundo",
    aiAnalyzeHide:  "Ocultar análisis",
    increaseTitle:  "Cómo Aumentar su Valuación",
    increaseSub:    "Acciones recomendadas para maximizar el valor de la empresa",
    recalculate:    "Recalcular",
    methodNote:     "Estimación con fines informativos. No constituye informe de valuación.",
    baseMultiple:   "Múltiplo base de mercado",
    industryFactor: "Factor industria",
    growthFactor:   "Factor crecimiento",
    recurringFactor:"Factor recurrencia",
    concFactor:     "Factor concentración",
    stageFactor:    "Factor etapa",
  },
};

/* ─── Suggestions ────────────────────────────────────────────────────────── */
const INCREASE_ACTIONS = {
  pt: [
    { icon: "◈", title: "Diversifique a base de clientes", priority: "critical", desc: "Alta concentração num único cliente aumenta o risco e reduz o múltiplo em até 30%. Mire em ter 5+ clientes representando menos de 20% cada da receita.", impact: "+20–30%" },
    { icon: "↻", title: "Aumente a receita recorrente", priority: "high", desc: "Converta projetos pontuais em contratos anuais de licença ou serviço. Acima de 80% recorrente, o múltiplo sobe significativamente para o mesmo ARR.", impact: "+25–40%" },
    { icon: "↗", title: "Acelere o crescimento para 30%+ a.a.", priority: "high", desc: "Crescimento acima de 30% eleva o múltiplo de 1.0x para 1.28x no mesmo ARR — uma diferença de 28% no valuation final.", impact: "+15–28%" },
    { icon: "◎", title: "Documente métricas SaaS-ready", priority: "medium", desc: "LTV/CAC > 3x, Churn < 5% a.a., NRR > 110% são benchmarks que justificam múltiplos premium e aceleram processos de due diligence.", impact: "+8–15%" },
    { icon: "◆", title: "Estruture governança e compliance", priority: "medium", desc: "Financeiras organizadas, contratos formalizados e cap table limpo reduzem risco percebido e facilitam M&A e captação.", impact: "+5–12%" },
    { icon: "★", title: "Melhore as margens brutas", priority: "low", desc: "Margens acima de 70% (SaaS) ou 50% (serviços) sinalizam eficiência operacional e atraem múltiplos maiores de investidores estratégicos.", impact: "+10–18%" },
  ],
  en: [
    { icon: "◈", title: "Diversify your client base", priority: "critical", desc: "High concentration in a single client increases risk and reduces the multiple by up to 30%. Target 5+ clients each under 20% of revenue.", impact: "+20–30%" },
    { icon: "↻", title: "Increase recurring revenue", priority: "high", desc: "Convert one-time projects to annual license or service contracts. Above 80% recurring, the multiple rises significantly for the same ARR.", impact: "+25–40%" },
    { icon: "↗", title: "Accelerate growth to 30%+ p.a.", priority: "high", desc: "Growth above 30% raises the multiple from 1.0x to 1.28x on the same ARR — a 28% difference in final valuation.", impact: "+15–28%" },
    { icon: "◎", title: "Document SaaS-ready metrics", priority: "medium", desc: "LTV/CAC > 3x, Churn < 5% p.a., NRR > 110% are benchmarks that justify premium multiples and accelerate due diligence.", impact: "+8–15%" },
    { icon: "◆", title: "Structure governance & compliance", priority: "medium", desc: "Organized financials, formalized contracts and a clean cap table reduce perceived risk and facilitate M&A and fundraising.", impact: "+5–12%" },
    { icon: "★", title: "Improve gross margins", priority: "low", desc: "Margins above 70% (SaaS) or 50% (services) signal operational efficiency and attract higher multiples from strategic investors.", impact: "+10–18%" },
  ],
  es: [
    { icon: "◈", title: "Diversifique la base de clientes", priority: "critical", desc: "Alta concentración en un cliente reduce el múltiplo hasta un 30%. Apunte a tener 5+ clientes por debajo del 20% cada uno.", impact: "+20–30%" },
    { icon: "↻", title: "Aumente los ingresos recurrentes", priority: "high", desc: "Convierta proyectos puntuales en contratos anuales. Por encima del 80% recurrente, el múltiplo sube significativamente.", impact: "+25–40%" },
    { icon: "↗", title: "Acelere el crecimiento al 30%+ a.a.", priority: "high", desc: "Un crecimiento superior al 30% eleva el múltiplo de 1.0x a 1.28x — una diferencia del 28% en la valuación final.", impact: "+15–28%" },
    { icon: "◎", title: "Documente métricas SaaS-ready", priority: "medium", desc: "LTV/CAC > 3x, Churn < 5% a.a., NRR > 110% son benchmarks que justifican múltiplos premium y aceleran el due diligence.", impact: "+8–15%" },
    { icon: "◆", title: "Estructure gobernanza y compliance", priority: "medium", desc: "Finanzas organizadas, contratos formalizados y cap table limpio reducen el riesgo percibido y facilitan M&A.", impact: "+5–12%" },
    { icon: "★", title: "Mejore los márgenes brutos", priority: "low", desc: "Márgenes superiores al 70% (SaaS) o 50% (servicios) señalan eficiencia operativa y atraen múltiplos más altos.", impact: "+10–18%" },
  ],
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtVal(v) {
  if (v >= 1_000_000_000) return "$" + (v / 1_000_000_000).toFixed(1) + "B";
  if (v >= 1_000_000)     return "$" + (v / 1_000_000).toFixed(1) + "M";
  return "$" + Math.round(v / 1000) + "k";
}

const BASE_MULT = 5.0;
const FALLBACK_ARR = 1_440_000;

function calcValuation(answers, qs) {
  // ARR from revenue question
  let arr = FALLBACK_ARR;
  if (answers.revenue && qs) {
    const revQ = qs.find(q => q.id === "revenue");
    const opt  = revQ?.options.find(o => o.id === answers.revenue);
    if (opt?.arr) arr = opt.arr;
  }

  let mult = BASE_MULT;
  const factors = {};

  for (const q of (qs || [])) {
    if (q.id === "revenue") continue; // revenue sets ARR, not mult
    const optId = answers[q.id];
    if (!optId) continue;
    const opt = q.options.find(o => o.id === optId);
    if (opt) {
      mult *= opt.mult;
      factors[q.id] = opt.mult;
    }
  }

  const mid = arr * mult;
  return { arr, low: mid * 0.72, mid, high: mid * 1.38, multiple: mult, factors };
}

function buildAIText(answers, qs, lang) {
  if (!qs) return "";

  const getOptLabel = (qId, optId) => {
    const q   = qs.find(q => q.id === qId);
    const opt = q?.options.find(o => o.id === optId);
    return opt?.label || optId;
  };

  const lines = {
    pt: {
      intro:      "**Análise do Valuation — CFOup AI**\n",
      industry:   (v) => `**Setor:** ${v} — um dos principais determinantes do múltiplo base.`,
      revenue:    (v) => `**ARR estimado:** ${v} — base utilizada para o cálculo multiplicativo.`,
      growth:     (v) => `**Crescimento:** ${v} — fator de forte impacto positivo em valuations de tech.`,
      recurring:  (v) => `**Recorrência:** ${v} — previsibilidade reduz risco e eleva o múltiplo.`,
      concentration: (v) => `**Concentração:** ${v} — quanto maior a concentração, maior o desconto aplicado.`,
      stage:      (v) => `**Estágio:** ${v} — empresas em escala recebem prêmio de mercado.`,
      outro:      "\n**Conclusão:** O valuation estimado combina todos esses fatores multiplicativamente sobre o ARR informado. Para aumentar o valor, priorize diversificação de clientes e aumento da receita recorrente.",
    },
    en: {
      intro:      "**Valuation Analysis — CFOup AI**\n",
      industry:   (v) => `**Industry:** ${v} — one of the main determinants of the base multiple.`,
      revenue:    (v) => `**Estimated ARR:** ${v} — base used for the multiplicative calculation.`,
      growth:     (v) => `**Growth:** ${v} — strong positive impact factor in tech valuations.`,
      recurring:  (v) => `**Recurring revenue:** ${v} — predictability reduces risk and raises the multiple.`,
      concentration: (v) => `**Concentration:** ${v} — higher concentration means a larger discount applied.`,
      stage:      (v) => `**Stage:** ${v} — scaling companies receive a market premium.`,
      outro:      "\n**Conclusion:** The estimated valuation combines all these factors multiplicatively over your stated ARR. To increase value, prioritize client diversification and higher recurring revenue.",
    },
    es: {
      intro:      "**Análisis de Valuación — CFOup AI**\n",
      industry:   (v) => `**Sector:** ${v} — uno de los principales determinantes del múltiplo base.`,
      revenue:    (v) => `**ARR estimado:** ${v} — base utilizada para el cálculo multiplicativo.`,
      growth:     (v) => `**Crecimiento:** ${v} — factor de fuerte impacto positivo en valuaciones de tech.`,
      recurring:  (v) => `**Recurrencia:** ${v} — la predictibilidad reduce el riesgo y eleva el múltiplo.`,
      concentration: (v) => `**Concentración:** ${v} — mayor concentración significa mayor descuento aplicado.`,
      stage:      (v) => `**Etapa:** ${v} — las empresas en escala reciben una prima de mercado.`,
      outro:      "\n**Conclusión:** La valuación estimada combina todos estos factores multiplicativamente sobre el ARR informado. Para aumentar el valor, priorice la diversificación de clientes y mayores ingresos recurrentes.",
    },
  };

  const L = lines[lang] || lines.en;
  const parts = [L.intro];
  if (answers.industry)     parts.push(L.industry(getOptLabel("industry", answers.industry)));
  if (answers.revenue)      parts.push(L.revenue(getOptLabel("revenue", answers.revenue)));
  if (answers.growth)       parts.push(L.growth(getOptLabel("growth", answers.growth)));
  if (answers.recurring)    parts.push(L.recurring(getOptLabel("recurring", answers.recurring)));
  if (answers.concentration)parts.push(L.concentration(getOptLabel("concentration", answers.concentration)));
  if (answers.stage)        parts.push(L.stage(getOptLabel("stage", answers.stage)));
  parts.push(L.outro);
  return parts.join("\n");
}

/* ─── LockedView ─────────────────────────────────────────────────────────── */
function LockedView({ th, cp, onStart }) {
  const features = [cp.lockedFeature1, cp.lockedFeature2, cp.lockedFeature3];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 160px)" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        {/* Lock icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))",
            border: "1px solid rgba(37,99,235,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 16px rgba(37,99,235,0.04), 0 0 0 32px rgba(37,99,235,0.02)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        {/* Text */}
        <div style={{ fontSize: 26, fontWeight: 800, color: th.text, letterSpacing: "-0.04em", marginBottom: 10 }}>
          {cp.lockedTitle}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: th.textM, marginBottom: 10 }}>
          {cp.lockedSub}
        </div>
        <div style={{ fontSize: 13.5, color: th.textS, lineHeight: 1.7, marginBottom: 32, padding: "0 8px" }}>
          {cp.lockedHint}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, textAlign: "left" }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: th.bgCard, border: `1px solid ${th.border}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontSize: 13, color: th.textM }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            width: "100%", height: 52, borderRadius: 14, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
            fontFamily: "inherit",
            boxShadow: "0 8px 32px rgba(37,99,235,0.45)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.45)"; }}
        >
          {cp.lockedCta}
        </button>

        <div style={{ marginTop: 16, fontSize: 11, color: th.textS, opacity: 0.5 }}>{cp.methodNote}</div>
      </div>
    </div>
  );
}

/* ─── QuizView ───────────────────────────────────────────────────────────── */
function QuizView({ th, cp, qs, answers, setAnswers, onFinish, onBack }) {
  const [step, setStep] = useState(0);
  const total = qs.length;
  const q     = qs[step];
  const sel   = answers[q.id];

  const canNext = !!sel;

  const goNext = () => {
    if (step < total - 1) setStep(s => s + 1);
    else onFinish();
  };
  const goBack = () => {
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  const pct = ((step) / total) * 100;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 160px)" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>

        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: th.textM }}>{cp.stepOf(step + 1, total)}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {qs.map((_, i) => (
                <div key={i} style={{
                  width: i === step ? 24 : 8, height: 6, borderRadius: 4,
                  background: i < step ? "#10b981" : i === step ? th.accent : th.border,
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
          <div style={{ height: 3, borderRadius: 3, background: th.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #2563EB, #06b6d4)`, borderRadius: 3, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>

        {/* Question card */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: th.text, letterSpacing: "-0.03em", marginBottom: 6 }}>
              {q.label}
            </div>
            <div style={{ fontSize: 13, color: th.textM, lineHeight: 1.6 }}>
              {q.hint}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map(opt => {
              const active = sel === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                  style={{
                    width: "100%", padding: "14px 18px",
                    borderRadius: 12,
                    border: `1.5px solid ${active ? th.accent : th.border}`,
                    background: active ? "rgba(37,99,235,0.1)" : "transparent",
                    color: active ? th.accentL : th.textM,
                    fontSize: 13.5, fontWeight: active ? 600 : 400,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = th.borderH; e.currentTarget.style.color = th.text; e.currentTarget.style.background = "rgba(148,163,184,0.05)"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textM; e.currentTarget.style.background = "transparent"; } }}
                >
                  <span>{opt.label}</span>
                  {active && (
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: th.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!canNext && (
            <div style={{ marginTop: 14, fontSize: 12, color: th.textS, textAlign: "center", opacity: 0.5 }}>
              {cp.selectOption}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={goBack}
            style={{
              flex: 1, height: 46, borderRadius: 12, border: `1px solid ${th.border}`,
              background: "transparent", color: th.textM, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = th.borderH; e.currentTarget.style.color = th.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textM; }}
          >
            {cp.back}
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{
              flex: 2, height: 46, borderRadius: 12, border: "none",
              background: canNext ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : th.border,
              color: canNext ? "#fff" : th.textS,
              fontSize: 14, fontWeight: 700,
              cursor: canNext ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              boxShadow: canNext ? "0 4px 20px rgba(37,99,235,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {step === total - 1 ? cp.finish : cp.next}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ResultsView ────────────────────────────────────────────────────────── */
function ValuationGauge({ low, mid, high, th }) {
  const total  = high - low || 1;
  const midPct = ((mid - low) / total) * 100;
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 8, background: `linear-gradient(90deg, rgba(239,68,68,0.4) 0%, rgba(245,158,11,0.45) ${midPct - 12}%, rgba(16,185,129,0.5) 100%)`, margin: "12px 0" }}>
      <div style={{ position: "absolute", left: `${midPct}%`, top: "50%", transform: "translate(-50%,-50%)", width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#06b6d4)", border: `2.5px solid ${th.bg}`, boxShadow: "0 0 0 3px rgba(37,99,235,0.3)" }} />
    </div>
  );
}

function DriverBar({ label, mult, isPositive, th }) {
  const pct = Math.min(Math.abs((mult - 1) * 100), 60);
  const color = mult >= 1 ? "#10b981" : "#ef4444";
  const sign  = mult >= 1 ? "+" : "";
  const delta = ((mult - 1) * 100).toFixed(0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 12, color: th.textM, width: 130, flexShrink: 0, lineHeight: 1.3 }}>{label}</div>
      <div style={{ flex: 1, height: 6, borderRadius: 6, background: th.border, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${Math.max(pct, 4)}%`, background: color, borderRadius: 6, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color, width: 42, textAlign: "right", flexShrink: 0 }}>{sign}{delta}%</div>
      <div style={{ fontSize: 11, color: th.textS, width: 32, textAlign: "right", flexShrink: 0 }}>{mult.toFixed(2)}x</div>
    </div>
  );
}

function ResultsView({ th, cp, qs, answers, val, lang, acts, onRecalculate }) {
  const [aiExpanded, setAiExpanded] = useState(false);
  const aiText = buildAIText(answers, qs, lang);

  const totalMult = val.multiple;
  const confPct   = 95; // all 6 answered
  const priorityColor = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: th.textS };

  /* driver rows (excluding revenue which sets ARR not mult) */
  const DRIVER_LABELS = cp;
  const driverDefs = [
    { key: "industry",     label: cp.industryFactor },
    { key: "growth",       label: cp.growthFactor },
    { key: "recurring",    label: cp.recurringFactor },
    { key: "concentration",label: cp.concFactor },
    { key: "stage",        label: cp.stageFactor },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Main valuation card ── */}
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{cp.resultsTitle}</div>
              <Badge color="accent">AI</Badge>
            </div>
            <div style={{ fontSize: 12, color: th.textM }}>{cp.resultsSub}</div>
          </div>
          {/* Confidence */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.08)", flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}>{cp.confLabel}: {cp.confHigh}</span>
            <div style={{ width: 60, height: 4, borderRadius: 4, background: th.border, overflow: "hidden" }}>
              <div style={{ width: "95%", height: "100%", background: "#10b981", borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Big number */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: th.textS, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>{cp.resultsTitle}</div>
          <div style={{
            fontSize: 60, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1,
            background: "linear-gradient(135deg,#60A5FA,#06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {fmtVal(val.mid)}
          </div>
          <div style={{ fontSize: 13.5, color: th.textM, marginTop: 8 }}>
            {totalMult.toFixed(1)}x {cp.arrLabel} · {cp.arrLabel}: {fmtVal(val.arr)}
          </div>
        </div>

        {/* Gauge */}
        <div style={{ maxWidth: 580, margin: "0 auto 28px" }}>
          <ValuationGauge low={val.low} mid={val.mid} high={val.high} th={th} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 10.5, color: th.textM, marginBottom: 2 }}>{cp.lowLabel}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>{fmtVal(val.low)}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10.5, color: th.textM, marginBottom: 2 }}>{cp.rangeLabel}</div>
              <div style={{ fontSize: 12, color: th.textS }}>{fmtVal(val.low)} – {fmtVal(val.high)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10.5, color: th.textM, marginBottom: 2 }}>{cp.highLabel}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>{fmtVal(val.high)}</div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "flex", paddingTop: 20, borderTop: `1px solid ${th.border}` }}>
          {[
            { l: cp.arrLabel,       v: fmtVal(val.arr),               c: th.accent   },
            { l: cp.multipleLabel,  v: totalMult.toFixed(1) + "x",    c: "#8b5cf6"   },
            { l: cp.confLabel,      v: cp.confHigh,                    c: "#10b981"   },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? `1px solid ${th.border}` : "none", padding: "0 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: k.c, letterSpacing: "-0.03em" }}>{k.v}</div>
              <div style={{ fontSize: 10.5, color: th.textM, marginTop: 3 }}>{k.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={onRecalculate}
            style={{ padding: "8px 20px", borderRadius: 10, border: `1px solid ${th.border}`, background: "transparent", color: th.textM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = th.borderH; e.currentTarget.style.color = th.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textM; }}
          >
            {cp.recalculate}
          </button>
        </div>
      </Card>

      {/* ── Drivers ── */}
      <div>
        <SecTitle title={cp.driversTitle} sub={cp.driversSub} />
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Base */}
            <DriverBar label={cp.baseMultiple} mult={BASE_MULT / BASE_MULT} th={th} />
            <div style={{ height: 1, background: th.border }} />
            {driverDefs.map(d => {
              const m = val.factors[d.key];
              if (!m) return null;
              return <DriverBar key={d.key} label={d.label} mult={m} th={th} />;
            })}
            {/* Total */}
            <div style={{ height: 1, background: th.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.text, width: 130, flexShrink: 0 }}>{cp.multipleLabel}</div>
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: 14, fontWeight: 800, color: th.accent, width: 42, textAlign: "right", flexShrink: 0 }}>{totalMult.toFixed(2)}x</div>
              <div style={{ width: 32 }} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── AI Analysis ── */}
      <Card style={{ border: `1px solid ${th.borderA}`, background: th.aiBtnBg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: aiExpanded ? 16 : 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 14px rgba(79,70,229,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{cp.aiTitle}</div>
            <div style={{ fontSize: 11, color: th.textM }}>{cp.aiSub}</div>
          </div>
          <Badge color="accent" pulse>AI</Badge>
          <button
            onClick={() => setAiExpanded(v => !v)}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${th.border}`, background: "transparent", color: th.textM, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = th.borderH; e.currentTarget.style.color = th.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textM; }}
          >
            {aiExpanded ? cp.aiAnalyzeHide : cp.aiAnalyzeMore}
          </button>
        </div>
        {aiExpanded && (
          <div style={{ fontSize: 13, color: th.textS, lineHeight: 1.8, paddingTop: 4 }}>
            {renderMD(aiText)}
          </div>
        )}
      </Card>

      {/* ── How to increase ── */}
      <div>
        <SecTitle title={cp.increaseTitle} right={<Badge color="green">AI</Badge>} />
        <div style={{ fontSize: 13, color: th.textM, marginBottom: 14 }}>{cp.increaseSub}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {acts.map((a, i) => {
            const pc = { critical: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" }, high: { bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)" }, medium: { bg: "rgba(37,99,235,0.07)", border: th.border }, low: { bg: "transparent", border: th.border } }[a.priority];
            return (
              <div key={i} style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1, color: th.textM }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: th.text, letterSpacing: "-0.01em" }}>{a.title}</span>
                      <span style={{ padding: "2px 9px", borderRadius: 20, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", fontSize: 10.5, fontWeight: 700, color: "#10b981" }}>{a.impact}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: th.textM, lineHeight: 1.65 }}>{a.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: th.textS, opacity: 0.4, paddingBottom: 8 }}>{cp.methodNote}</div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export function PageValuation() {
  const { th, lang } = useC();
  const cp   = COPY[lang]            || COPY.en;
  const qs   = QUESTIONS[lang]       || QUESTIONS.en;
  const acts = INCREASE_ACTIONS[lang]|| INCREASE_ACTIONS.en;

  /* Load saved state */
  const [phase, setPhase] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const p = JSON.parse(s); if (p.phase === "results") return "results"; }
    } catch {}
    return "locked";
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const p = JSON.parse(s); return p.answers || {}; }
    } catch {}
    return {};
  });

  /* Persist answers + phase */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, answers })); }
    catch {}
  }, [phase, answers]);

  const val = calcValuation(answers, qs);

  const handleFinish = () => {
    setPhase("results");
  };

  const handleRecalculate = () => {
    setAnswers({});
    setPhase("locked");
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  if (phase === "locked") return <LockedView th={th} cp={cp} onStart={() => setPhase("quiz")} />;
  if (phase === "quiz")   return <QuizView   th={th} cp={cp} qs={qs} answers={answers} setAnswers={setAnswers} onFinish={handleFinish} onBack={() => setPhase("locked")} />;
  return <ResultsView th={th} cp={cp} qs={qs} answers={answers} val={val} lang={lang} acts={acts} onRecalculate={handleRecalculate} />;
}
