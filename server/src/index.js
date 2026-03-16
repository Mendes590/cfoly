require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const authRoutes            = require("./routes/auth");
const businessProfileRoutes = require("./routes/businessProfile");
const valuationRoutes       = require("./routes/valuation");
const { errorHandler }      = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ── */
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

/* ── Health check ── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ── Routes ── */
app.use("/api/auth",             authRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/valuation",        valuationRoutes);

/* ── Error handler (must be last) ── */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CFOly server running on http://localhost:${PORT}`);
});
