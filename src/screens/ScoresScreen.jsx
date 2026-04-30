import Card      from "../components/Card";
import Avatar    from "../components/Avatar";
import PlayerRow from "../components/PlayerRow";
import { PrimaryBtn, GhostBtn } from "../components/PrimaryBtn";

export default function ScoresScreen({ players, totalRounds, onPlayAgain, onHome }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <div className="pop" style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
        <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 4 }}>Bravo {winner.name} !</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
          {winner.score} points sur {totalRounds * 100} possibles
        </p>
      </div>

      {/* podium */}
      <div className="fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[sorted[1], sorted[0], sorted[2]].map((p, i) => {
          if (!p) return <div key={i} />;
          const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
          const medals = ["🥇", "🥈", "🥉"];
          const heights = [100, 130, 80];
          return (
            <div key={p.id} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                <Avatar name={p.name} color={p.color} size={40} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div style={{
                borderRadius: "var(--border-radius-md) var(--border-radius-md) 0 0",
                background: "#7c6dfa22", border: "0.5px solid #7c6dfa44",
                height: heights[i], display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-start", paddingTop: 12,
              }}>
                <div style={{ fontSize: 22 }}>{medals[rank - 1]}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#7c6dfa", marginTop: 4 }}>{p.score} pts</div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="fade-d1" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Classement complet</div>
        {sorted.map((p, i) => <PlayerRow key={p.id} player={p} rank={i + 1} />)}
      </Card>

      <div className="fade-d2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Manches",  value: totalRounds },
          { label: "Joueurs",  value: players.length },
          { label: "Pts max",  value: Math.max(...players.map(p => p.score)) },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="fade-d3" style={{ display: "flex", gap: 8 }}>
        <GhostBtn onClick={onHome} style={{ flex: 1 }}>Accueil</GhostBtn>
        <PrimaryBtn onClick={onPlayAgain} style={{ flex: 2, padding: "13px" }}>Rejouer 🎶</PrimaryBtn>
      </div>
    </div>
  );
}