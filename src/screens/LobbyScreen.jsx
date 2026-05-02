import { useState } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import PlayerRow  from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function LobbyScreen({ roomCode, config, players, source, isHost, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);

  // Sécurise l'accès aux propriétés
  const safeGenres   = config?.genres   || [];
  const safeDecades  = config?.decades  || [];
  const safeArtists  = config?.artists  || [];
  const safeRounds   = config?.rounds   || 10;
  const safeTimerSec = config?.timerSec || 25;

  const copy = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const url = `${window.location.origin}?room=${roomCode}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <Card className="fade" style={{
          textAlign: "center", marginBottom: 14, padding: "28px 20px",
          background: "linear-gradient(135deg, var(--card), var(--card-2))",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Code de la room
          </div>
          <div style={{
            fontSize: 42, fontWeight: 900, color: "var(--secondary)",
            letterSpacing: "0.15em", marginBottom: 12,
          }}>{roomCode}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={copy} style={{
              padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif", border: "none",
              background: copied ? "var(--success)" : "var(--card-2)",
              color: copied ? "var(--bg)" : "var(--text-2)",
            }}>{copied ? "✓ Copié !" : "📋 Copier code"}</button>
            <button onClick={shareLink} style={{
              padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif", border: "none",
              background: "var(--card-2)", color: "var(--text-2)",
            }}>🔗 Partager lien</button>
          </div>
        </Card>

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
              <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Source
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>
                {source === "spotify" ? "Spotify Premium" : "Deezer · extraits 30s"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="fade-d2" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Configuration
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {safeGenres.slice(0, 4).map(g => <Badge key={g} label={g} color="var(--primary)" />)}
            {safeGenres.length > 4 && <Badge label={`+${safeGenres.length - 4}`} color="var(--primary)" />}

            {safeArtists.slice(0, 4).map(a => <Badge key={a.id || a.name} label={`🎤 ${a.name}`} color="var(--info)" />)}
            {safeArtists.length > 4 && <Badge label={`+${safeArtists.length - 4} artistes`} color="var(--info)" />}

            {safeDecades.map(d => <Badge key={d} label={d} color="var(--secondary)" />)}
            <Badge label={`${safeRounds} titres`} color="var(--success)" />
            <Badge label={`${safeTimerSec}s`} color="var(--info)" />
          </div>
        </Card>

        <Card className="fade-d2" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Joueurs · {players.length}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", animation: "pulse 1.5s ease infinite" }} />
              <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 700 }}>en direct</span>
            </div>
          </div>
          {players.map(p => <PlayerRow key={p.id} player={p} showScore={false} />)}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            color: "var(--text-3)", fontSize: 13, fontWeight: 600,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "2px dashed var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>+</div>
            En attente d'autres joueurs…
          </div>
        </Card>

        <div className="fade-d3" style={{ display: "flex", gap: 10 }}>
          <GhostBtn onClick={onLeave} style={{ flex: 1 }}>Quitter</GhostBtn>
          {isHost ? (
            <PrimaryBtn onClick={onStart} disabled={players.length < 1} style={{ flex: 2, padding: "14px", fontSize: 16 }}>
              Lancer ! 🎶
            </PrimaryBtn>
          ) : (
            <div style={{
              flex: 2, padding: "14px", fontSize: 14, fontWeight: 700,
              background: "var(--card)", borderRadius: 14, color: "var(--text-2)",
              textAlign: "center", border: "2px solid var(--border)",
            }}>
              ⏳ En attente du host…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}