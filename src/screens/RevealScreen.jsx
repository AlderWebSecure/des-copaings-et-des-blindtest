import Card      from "../components/Card";
import Badge     from "../components/Badge";
import Avatar    from "../components/Avatar";
import PlayerRow from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function RevealScreen({ round, roundIndex, totalRounds, players, myAnswer, roundDeltas, onNext, onFinish }) {
  const isLast = roundIndex >= totalRounds - 1;
  const mockResults = [
    { player: players[0], answer: myAnswer || "—", pts: roundDeltas[0] || 0 },
    { player: players[1], answer: "eminem rap",    pts: 60 },
    { player: players[2], answer: "8 mile?",       pts: 20 },
    { player: players[3], answer: "—",             pts: 0  },
  ].sort((a, b) => b.pts - a.pts);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <div className="pop" style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "#7c6dfa22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px" }}>
          {round.emoji}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>C'était</div>
        <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 4 }}>{round.title}</h2>
        <div style={{ fontSize: 16, color: "#7c6dfa", fontWeight: 500, marginBottom: 8 }}>{round.artist}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <Badge label={String(round.year)} color="#fb923c" />
          <Badge label={round.genre} color="#7c6dfa" />
        </div>
      </div>

      <Card className="fade-d1" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Résultats de la manche</div>
        {mockResults.map((r, i) => (
          <div key={r.player.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < mockResults.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 20, fontSize: 13, color: "var(--color-text-tertiary)", textAlign: "center" }}>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
            </div>
            <Avatar name={r.player.name} color={r.player.color} size={30} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.player.name}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontStyle: "italic" }}>"{r.answer}"</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: r.pts >= 100 ? "#34d399" : r.pts > 0 ? "#fb923c" : "var(--color-text-tertiary)" }}>
              {r.pts > 0 ? `+${r.pts}` : "-"}
            </div>
          </div>
        ))}
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Classement général</div>
        {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
          <PlayerRow key={p.id} player={p} rank={i + 1} delta={roundDeltas[i] || 0} />
        ))}
      </Card>

      <div style={{ display: "flex", gap: 8 }}>
        {isLast
          ? <PrimaryBtn onClick={onFinish} style={{ flex: 1, padding: "13px", fontSize: 15 }}>Voir le classement final 🏆</PrimaryBtn>
          : <>
              <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", flex: 1 }}>
                Manche {roundIndex + 1} / {totalRounds}
              </div>
              <PrimaryBtn onClick={onNext} style={{ flex: 2, padding: "13px" }}>Manche suivante →</PrimaryBtn>
            </>
        }
      </div>
    </div>
  );
}