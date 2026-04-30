import { useState } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import PlayerRow  from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function LobbyScreen({ config, players, source, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);
  const roomCode = "KIWI-42";

  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* ROOM CODE */}
        <Card className="fade" style={{
          textAlign: "center", marginBottom: 14, padding: "28px 20px",
          background: "linear-gradient(135deg, #16213e, #0f3460)",
        }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Code de la room
          </div>
          <div style={{
            fontSize: 42, fontWeight: 900, color: "#ffd93d",
            letterSpacing: "0.15em", marginBottom: 12,
          }}>
            {roomCode}
          </div>
          <button onClick={copy} style={{
            padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif", border: "none",
            background: copied ? "#6bcb77" : "#0f3460",
            color: copied ? "#1a1a2e" : "#ffffffaa",
            transition: "all .2s",
          }}>
            {copied ? "✓ Copié !" : "📋 Copier le code"}
          </button>
        </Card>

        {/* SOURCE BADGE */}
        <Card className="fade-d1" style={{ marginBottom: 14, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: source === "spotify" ? "#1ed760" : "linear-gradient(135deg, #ef5466, #a238d4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>
              {source === "spotify" ? "♫" : "🎵"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Source musicale
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                {source === "spotify" ? "Spotify Premium" : "Deezer · extraits 30s"}
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 50,
              background: source === "spotify" ? "#1ed76033" : "#6bcb7733",
              color:      source === "spotify" ? "#1ed760"   : "#6bcb77",
            }}>
              {source === "spotify" ? "PREMIUM" : "GRATUIT"}
            </span>
          </div>
        </Card>

        {/* CONFIG */}
        <Card className="fade-d2" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Configuration
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {config.genres.slice(0, 4).map(g => <Badge key={g} label={g} color="#e94560" />)}
            {config.genres.length > 4 && <Badge label={`+${config.genres.length - 4}`} color="#e94560" />}
            {config.decades.map(d => <Badge key={d} label={d} color="#ffd93d" />)}
            <Badge label={`${config.rounds} titres`} color="#6bcb77" />
            <Badge label={`${config.timerSec}s`} color="#4d96ff" />
          </div>
        </Card>

        {/* PLAYERS */}
        <Card className="fade-d2" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Joueurs
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6bcb77", animation: "pulse 1.5s ease infinite" }} />
              <span style={{ fontSize: 12, color: "#ffffff55", fontWeight: 700 }}>{players.length} connectés</span>
            </div>
          </div>
          {players.map(p => <PlayerRow key={p.id} player={p} showScore={false} />)}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            color: "#ffffff55", fontSize: 13, fontWeight: 600,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "2px dashed #ffffff22",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>+</div>
            En attente de joueurs…
          </div>
        </Card>

        <div className="fade-d3" style={{ display: "flex", gap: 10 }}>
          <GhostBtn onClick={onLeave} style={{ flex: 1 }}>Quitter</GhostBtn>
          <PrimaryBtn onClick={onStart} style={{ flex: 2, padding: "14px", fontSize: 16 }}>
            Lancer ! 🎶
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}