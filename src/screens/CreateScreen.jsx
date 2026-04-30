import { useState } from "react";
import Card            from "../components/Card";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";
import { GENRES, DECADES }      from "../constants/genres";

export default function CreateScreen({ onBack, onCreate }) {
  const [genres,   setGenres]   = useState(["Pop", "Hip-Hop"]);
  const [decades,  setDecades]  = useState(["2010s", "2020s"]);
  const [rounds,   setRounds]   = useState(10);
  const [timerSec, setTimerSec] = useState(25);
  const [name,     setName]     = useState("");

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const canCreate = genres.length > 0 && decades.length > 0 && name.trim();

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <div className="fade" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <GhostBtn onClick={onBack} style={{ padding: "8px 14px", fontSize: 13 }}>← Retour</GhostBtn>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 500 }}>Créer une partie</h2>
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Configure et invite tes amis</div>
        </div>
      </div>

      <Card className="fade-d1" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Ton pseudo</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Pseudo du host" />
      </Card>

      <Card className="fade-d1" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Genres musicaux
          {genres.length > 0 && <span style={{ marginLeft: 6, color: "#7c6dfa", fontWeight: 500 }}>{genres.length} sélectionnés</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GENRES.map(g => {
            const sel = genres.includes(g);
            return (
              <button key={g} onClick={() => toggle(genres, setGenres, g)} style={{
                padding: "6px 14px", borderRadius: 100,
                border: sel ? "0.5px solid #7c6dfa" : "0.5px solid var(--color-border-secondary)",
                background: sel ? "#7c6dfa22" : "transparent",
                color: sel ? "#7c6dfa" : "var(--color-text-secondary)",
                fontSize: 13, fontWeight: 500,
              }}>{g}</button>
            );
          })}
        </div>
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>Époques</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {DECADES.map(d => {
            const sel = decades.includes(d);
            return (
              <button key={d} onClick={() => toggle(decades, setDecades, d)} style={{
                padding: "6px 14px", borderRadius: 100,
                border: sel ? "0.5px solid #f472b6" : "0.5px solid var(--color-border-secondary)",
                background: sel ? "#f472b622" : "transparent",
                color: sel ? "#f472b6" : "var(--color-text-secondary)",
                fontSize: 13, fontWeight: 500,
              }}>{d}</button>
            );
          })}
        </div>
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>Paramètres</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Nombre de manches</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#7c6dfa" }}>{rounds}</span>
            </div>
            <input type="range" min={5} max={20} value={rounds} onChange={e => setRounds(+e.target.value)} style={{ width: "100%", padding: 0, background: "none", border: "none" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Temps par manche</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#7c6dfa" }}>{timerSec}s</span>
            </div>
            <input type="range" min={10} max={45} value={timerSec} onChange={e => setTimerSec(+e.target.value)} style={{ width: "100%", padding: 0, background: "none", border: "none" }} />
          </div>
        </div>
      </Card>

      <Card className="fade-d3" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1ed760", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>♫</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Connecter Spotify</div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Seul le host a besoin d'un compte Premium</div>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: "var(--border-radius-md)", background: "#1ed760", color: "#000", fontSize: 13, fontWeight: 500, border: "none", flexShrink: 0 }}>
            Connecter
          </button>
        </div>
      </Card>

      <PrimaryBtn
        onClick={() => canCreate && onCreate({ genres, decades, rounds, timerSec, hostName: name })}
        disabled={!canCreate}
        style={{ width: "100%", padding: "14px", fontSize: 15 }}
      >
        Créer la room →
      </PrimaryBtn>
    </div>
  );
}