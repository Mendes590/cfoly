const BASE_MULT = 5.0;

const REVENUE_ARR = {
  micro:  250_000,
  small:  1_250_000,
  mid:    3_500_000,
  large:  10_000_000,
  xlarge: 20_000_000,
};

const MULTIPLIERS = {
  industry: {
    saas: 1.4, services: 1.0, health: 1.1, ecommerce: 0.8, retail: 0.55,
  },
  growthRate: {
    hyper: 1.55, high: 1.28, med: 1.0, low: 0.78,
  },
  recurringRevenuePct: {
    very_high: 1.35, high: 1.0, med: 0.82, low: 0.65,
  },
  concentrationLevel: {
    low: 1.15, med: 0.9, high: 0.7,
  },
  companyStage: {
    early: 0.82, growth: 1.12, scale: 1.35, profitable: 1.1,
  },
};

function calculate(answers) {
  const arr = REVENUE_ARR[answers.revenueRange] || 1_440_000;
  let mult = BASE_MULT;
  const factors = {};

  const applyFactor = (group, key) => {
    const val = MULTIPLIERS[group]?.[key];
    if (val) { mult *= val; factors[group] = val; }
  };

  applyFactor("industry",            answers.industry);
  applyFactor("growthRate",          answers.growthRate);
  applyFactor("recurringRevenuePct", answers.recurringRevenuePct);
  applyFactor("concentrationLevel",  answers.concentrationLevel);
  applyFactor("companyStage",        answers.companyStage);

  const mid = arr * mult;

  return {
    arrMidpoint:  arr,
    multiple:     mult,
    lowEstimate:  Math.round(mid * 0.72),
    midEstimate:  Math.round(mid),
    highEstimate: Math.round(mid * 1.38),
    confidence:   "high",
    factors,
  };
}

module.exports = { calculate };
