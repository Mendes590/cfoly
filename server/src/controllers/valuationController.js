const prisma              = require("../lib/prisma");
const valuationService    = require("../services/valuationService");

async function get(req, res, next) {
  try {
    const company = req.user.company;
    if (!company) return res.status(404).json({ message: "No company profile found" });

    const latest = await prisma.valuation.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return res.status(404).json({ message: "No valuation found" });
    res.json({ valuation: latest });
  } catch (err) {
    next(err);
  }
}

async function save(req, res, next) {
  try {
    const company = req.user.company;
    if (!company) return res.status(400).json({ message: "Create a company profile first" });

    const answers = req.body; // { industry, revenueRange, growthRate, recurringRevenuePct, concentrationLevel, companyStage }
    const result  = valuationService.calculate(answers);

    const valuation = await prisma.valuation.upsert({
      where: { id: (await prisma.valuation.findFirst({ where: { companyId: company.id }, orderBy: { createdAt: "desc" }, select: { id: true } }))?.id || "nonexistent" },
      update: {
        ...answers,
        ...result,
        factors: JSON.stringify(result.factors),
      },
      create: {
        companyId: company.id,
        ...answers,
        ...result,
        factors: JSON.stringify(result.factors),
      },
    });

    res.json({ valuation, result });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, save };
