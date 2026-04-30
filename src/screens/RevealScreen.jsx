import Card      from "../components/Card";
import Badge     from "../components/Badge";
import Avatar    from "../components/Avatar";
import PlayerRow from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";

export default function RevealScreen({
  round, roundIndex, totalRounds, players, me, answers, isHost, isLast, onNext,
}) {
  // Construit les résultats triés par points
  const results = players.map(p => ({
    player: p,
    answer: answers[p.id]?.answer || "—",
    pts:    answers[p.id]?.points || 0,
  })).sort((a, b) => b.pts - a.pts);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <div className="pop" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 90, height: 90, borderRadius: 24,
            background: "linear-gradient(135deg, #e9456044, #ffd93d22)",
            border: "3px solid #e9456055",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, margin: "0 auto 16px",
            animation: "float 3s ease-in-out infinite",
          }}>
            {round?.emoji || "🎵"}
          </div>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            C'était
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>
            {round?.title}
          </h2>
          <div style={{ fontSize: 18, color: "#ffd93d", fontWeight: 800, marginBottom: 10 }}>
            {round?.artist}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <Badge label={String(round?.year)} color="#ffd93d" />
            <Badge label={round?.genre} color="#e94560" />
          </div>
        </div>

        <Card className="fade-d1" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Résultats de la manche
          </div>
          {results.map((r, i) => (
            <div key={r.player.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0",
              borderBottom: i < results.length - 1 ? "1.5px solid #ffffff08" : "none",
              background: r.player.id === me?.id ? "#e9456008" : "transparent",
              borderRadius: 8,
            }}>
              <div style={{ width: 22, fontSize: 14, textAlign: "center", flexShrink: 0 }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </div>
              <Avatar name={r.player.name} color={r.player.color} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {r.player.name}
                  {r.player.id === me?.id && <span style={{ marginLeft: 6, color: "#e94560", fontSize: 11 }}>(toi)</span>}
                </div>
                <div style={{ fontSize: 11, color: "#ffffff55", fontStyle: "italic" }}>"{r.answer}"</div>
              </div>
              <div style={{
                fontSize: 15, fontWeight: 800,
                color: r.pts >= 100 ? "#6bcb77" : r.pts > 0 ? "#ffd93d" : "#ffffff55",
              }}>
                {r.pts > 0 ? `+${r.pts}` : "-"}
              </div>
            </div>
          ))}
        </Card>

        <Card className="fade-d2" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Classement
          </div>
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={i + 1} delta={answers[p.id]?.points || 0} />
          ))}
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          {isHost ? (
            isLast
              ? <PrimaryBtn onClick={onNext} color="#ffd93d" style={{ flex: 1, padding: "14px", fontSize: 16 }}>
                  Voir le classement final 🏆
                </PrimaryBtn>
              : <>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", fontSize: 13, color: "#ffffff55", fontWeight: 700 }}>
                    {roundIndex + 1} / {totalRounds}
                  </div>
                  <PrimaryBtn onClick={onNext} style={{ flex: 2, padding: "14px", fontSize: 15 }}>
                    Manche suivante →
                  </PrimaryBtn>
                </>
          ) : (
            <div style={{
              flex: 1, padding: "14px", fontSize: 14, fontWeight: 700,
              background: "#16213e", borderRadius: 14, color: "#ffffff77",
              textAlign: "center", border: "2px solid #ffffff15",
            }}>
              ⏳ En attente du host…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}