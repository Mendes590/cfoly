const prisma = require("../lib/prisma");

async function get(req, res, next) {
  try {
    const company = req.user.company;
    if (!company) return res.status(404).json({ message: "No business profile found" });
    res.json({ company });
  } catch (err) {
    next(err);
  }
}

async function upsert(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      name, cnpj, industry, revenueModel, employees, stage,
      recurringRevenuePct, concentrationLevel, goalType,
      runwayGoalDays, marginGoalPct, riskTolerance, notes, contextText,
    } = req.body;

    const existing = await prisma.company.findUnique({ where: { userId } });

    const data = {
      name:               name || req.user.name + "'s Company",
      cnpj,               industry,       revenueModel,
      employees,          stage,          recurringRevenuePct,
      concentrationLevel, goalType,       runwayGoalDays,
      marginGoalPct,      riskTolerance,  notes,
      contextText,
    };

    // remove undefined keys to avoid overwriting with null
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    let company;
    if (existing) {
      company = await prisma.company.update({ where: { userId }, data });
    } else {
      company = await prisma.company.create({ data: { ...data, userId } });
    }

    res.json({ company });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, upsert };
