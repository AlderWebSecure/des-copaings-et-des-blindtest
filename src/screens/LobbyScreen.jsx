import { useState } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import PlayerRow  from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function LobbyScreen({ config, players, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);
  const roomCode = "KIWI-42";

  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <Card className="fade" style={{ textAlign: "center", marginBottom: 16, padding: "24px" }}>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Code de la room</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "0.15em", color: "#7c6dfa", marginBottom: 12 }}>{roomCode}</div>
        <button onClick={copy} style={{
          padding: "6px 16px", borderRadius: "var(--border-radius-md)", fontSize: 12, fontWeight: 500,
          background: copied ? "#34d39922" : "var(--color-background-secondary)",
          color: copied ? "#34d399" : "var(--color-text-secondary)",
          border: `0.5px solid ${copied ? "#34d399" : "var(--color-border-secondary)"}`,
        }}>
          {copied ? "✓ Copié !" : "Copier le lien"}
        </button>
      </Card>

      <Card className="fade-d1" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Configuration</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {config.genres.slice(0, 4).map(g => <Badge key={g} label={g} color="#7c6dfa" />)}
          {config.genres.length > 4 && <Badge label={`+${config.genres.length - 4} genres`} color="#7c6dfa" />}
          {config.decades.map(d => <Badge key={d} label={d} color="#f472b6" />)}
          <Badge label={`${config.rounds} titres`} color="#fb923c" />
          <Badge label={`${config.timerSec}s`} color="#34d399" />
        </div>
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Joueurs</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "pulse 1.5s ease infinite" }} />
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{players.length} connectés</span>
          </div>
        </div>
        {players.map(p => <PlayerRow key={p.id} player={p} showScore={false} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", color: "var(--color-text-tertiary)", fontSize: 13 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px dashed var(--color-border-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>+</div>
          En attente de joueurs…
        </div>
      </Card>

      <div className="fade-d3" style={{ display: "flex", gap: 8 }}>
        <GhostBtn onClick={onLeave} style={{ flex: 1 }}>Quitter</GhostBtn>
        <PrimaryBtn onClick={onStart} style={{ flex: 2, padding: "13px" }}>Lancer la partie 🎶</PrimaryBtn>
      </div>
    </div>
  );
}import { useState } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import PlayerRow  from "../components/PlayerRow";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function LobbyScreen({ config, players, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);
  const roomCode = "KIWI-42";

  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <Card className="fade" style={{ textAlign: "center", marginBottom: 16, padding: "24px" }}>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Code de la room</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "0.15em", color: "#7c6dfa", marginBottom: 12 }}>{roomCode}</div>
        <button onClick={copy} style={{
          padding: "6px 16px", borderRadius: "var(--border-radius-md)", fontSize: 12, fontWeight: 500,
          background: copied ? "#34d39922" : "var(--color-background-secondary)",
          color: copied ? "#34d399" : "var(--color-text-secondary)",
          border: `0.5px solid ${copied ? "#34d399" : "var(--color-border-secondary)"}`,
        }}>
          {copied ? "✓ Copié !" : "Copier le lien"}
        </button>
      </Card>

      <Card className="fade-d1" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Configuration</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {config.genres.slice(0, 4).map(g => <Badge key={g} label={g} color="#7c6dfa" />)}
          {config.genres.length > 4 && <Badge label={`+${config.genres.length - 4} genres`} color="#7c6dfa" />}
          {config.decades.map(d => <Badge key={d} label={d} color="#f472b6" />)}
          <Badge label={`${config.rounds} titres`} color="#fb923c" />
          <Badge label={`${config.timerSec}s`} color="#34d399" />
        </div>
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Joueurs</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "pulse 1.5s ease infinite" }} />
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{players.length} connectés</span>
          </div>
        </div>
        {players.map(p => <PlayerRow key={p.id} player={p} showScore={false} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", color: "var(--color-text-tertiary)", fontSize: 13 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px dashed var(--color-border-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>+</div>
          En attente de joueurs…
        </div>
      </Card>

      <div className="fade-d3" style={{ display: "flex", gap: 8 }}>
        <GhostBtn onClick={onLeave} style={{ flex: 1 }}>Quitter</GhostBtn>
        <PrimaryBtn onClick={onStart} style={{ flex: 2, padding: "13px" }}>Lancer la partie 🎶</PrimaryBtn>
      </div>
    </div>
  );
}