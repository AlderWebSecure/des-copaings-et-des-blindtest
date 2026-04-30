import Card       from "../components/Card";
import Avatar     from "../components/Avatar";
import PlayerRow  from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function ScoresScreen({ players, totalRounds, isHost, onPlayAgain, onHome }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "40px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <div className="pop" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Bravo <span style={{ color: "#ffd93d" }}>{winner?.name}</span> !
          </h2>
          <p style={{ fontSize: 14, color: "#ffffffaa", fontWeight: 600 }}>
            {winner?.score} pts sur {totalRounds * 100} possibles
          </p>
        </div>

        <div className="fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          {[sorted[1], sorted[0], sorted[2]].map((p, i) => {
            if (!p) return <div key={i} />;
            const rank    = i === 1 ? 1 : i === 0 ? 2 : 3;
            const medals  = ["🥇", "🥈", "🥉"];
            const heights = [90, 120, 70];
            const colors  = ["#ffd93d", "#e94560", "#6bcb77"];
            return (
              <div key={p.id} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                  <Avatar name={p.name} color={p.color} size={40} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{p.name}</div>
                <div style={{
                  borderRadius: "12px 12px 0 0",
                  background: colors[rank - 1] + "22",
                  border: `2px solid ${colors[rank - 1]}44`,
                  height: heights[i],
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-start", paddingTop: 12,
                }}>
                  <div style={{ fontSize: 24 }}>{medals[rank - 1]}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: colors[rank - 1], marginTop: 4 }}>
                    {p.score} pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="fade-d1" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Classement complet
          </div>
          {sorted.map((p, i) => <PlayerRow key={p.id} player={p} rank={i + 1} />)}
        </Card>

        <div className="fade-d2" style={{ display: "flex", gap: 10 }}>
          <GhostBtn onClick={onHome} style={{ flex: 1 }}>Accueil</GhostBtn>
          {isHost ? (
            <PrimaryBtn onClick={onPlayAgain} style={{ flex: 2, padding: "14px", fontSize: 16 }}>
              Rejouer 🎶
            </PrimaryBtn>
          ) : (
            <div style={{
              flex: 2, padding: "14px", fontSize: 14, fontWeight: 700,
              background: "#16213e", borderRadius: 14, color: "#ffffff77",
              textAlign: "center", border: "2px solid #ffffff15",
            }}>
              ⏳ Le host peut relancer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}