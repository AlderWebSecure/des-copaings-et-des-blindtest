import Avatar from "./Avatar";
import Badge  from "./Badge";

export default function PlayerRow({ player, rank, showScore = true, delta = 0 }) {
  return (
    <div className="fade" style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
    }}>
      {rank != null && (
        <div style={{
          width: 28, textAlign: "center", fontSize: 13,
          color: "var(--color-text-tertiary)", fontWeight: 500, flexShrink: 0,
        }}>
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`}
        </div>
      )}
      <Avatar name={player.name} color={player.color} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
          {player.name}
          {player.host && <Badge label="host" color="#7c6dfa" />}
        </div>
      </div>
      {showScore && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{player.score} pts</div>
          {delta > 0 && <div style={{ fontSize: 12, color: "#34d399", fontWeight: 500 }}>+{delta}</div>}
        </div>
      )}
    </div>
  );
}