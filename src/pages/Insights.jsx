import { useC } from "../core/context.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { SecTitle } from "../components/ui/Card.jsx";
import { InsCard, ScoreGauge } from "../components/widgets/InsightCards.jsx";
import { ChatBot } from "../panels/ChatBot.jsx";

export function PageInsights() {
  const { th, t } = useC();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 13 }}>
        <ScoreGauge score={t.scores.cash} />
        <ScoreGauge score={t.scores.growth} />
        <ScoreGauge score={t.scores.risk} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.55fr)", gap: 13 }}>
        <Card>
          <SecTitle title={t.insTitle} right={<Badge color="accent" pulse>{t.insLive}</Badge>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {t.insCards.map((ins, i) => <InsCard key={i} ins={ins} />)}
          </div>
        </Card>

        <Card noPad style={{ display: "flex", flexDirection: "column", minHeight: 500 }}>
          <div style={{ padding: "16px 18px 14px", borderBottom: `1px solid ${th.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#4f46e5,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(79,70,229,0.45)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: th.text }}>{t.chatTitle}</div>
              <div style={{ fontSize: 11.5, color: th.textM }}>{t.chatSub}</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Badge color="accent" pulse>{t.insLive}</Badge></div>
          </div>
          <ChatBot />
        </Card>
      </div>
    </div>
  );
}
