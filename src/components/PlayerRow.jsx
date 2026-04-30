import Avatar from "./Avatar";
import Badge  from "./Badge";

export default function PlayerRow({ player, rank, showScore = true, delta = 0 }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0",
      borderBottom: "1.5px solid #ffffff08",
    }}>
      {rank != null && (
        <div style={{ width: 28, textAlign: "center", fontSize: 14, flexShrink: 0 }}>
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`}
        </div>
      )}
      <Avatar name={player.name} color={player.color} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
          {player.name}
          {player.host && <Badge label="host" color="#ffd93d" />}
        </div>
      </div>
      {showScore && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>{player.score} pts</div>
          {delta > 0 && <div style={{ fontSize: 12, color: "#6bcb77", fontWeight: 700 }}>+{delta}</div>}
        </div>
      )}
    </div>
  );
}