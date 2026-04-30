import { useState } from "react";
import Card       from "../components/Card";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";
import { GENRES, DECADES } from "../constants/genres";

export default function CreateScreen({ onBack, onCreate, loading, error }) {
  const [genres,   setGenres]   = useState(["Pop", "Hip-Hop"]);
  const [decades,  setDecades]  = useState(["2010s", "2020s"]);
  const [rounds,   setRounds]   = useState(10);
  const [timerSec, setTimerSec] = useState(25);
  const [name,     setName]     = useState("");

  const toggle = (arr, set, val) =>
    set(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const ok = genres.length > 0 && decades.length > 0 && name.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="fade" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <GhostBtn onClick={onBack} style={{ padding: "8px 16px", fontSize: 13 }}>← Retour</GhostBtn>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Créer une partie</h2>
            <div style={{ fontSize: 13, color: "#ffffff55", fontWeight: 600 }}>Configure et invite tes amis</div>
          </div>
        </div>

        {error && (
          <Card className="fade" style={{ marginBottom: 12, borderColor: "#ff6b6b66", background: "#ff6b6b11" }}>
            <div style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700 }}>⚠ {error}</div>
          </Card>
        )}

        <Card className="fade" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#ffffff55", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Ton pseudo</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Orel"
            style={{ fontSize: 14, fontWeight: 700 }} maxLength={20} />
        </Card>

        <Card className="fade-d1" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#ffffff55", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Genres {genres.length > 0 && <span style={{ color: "#e94560" }}>· {genres.length} choisis</span>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {GENRES.map(g => {
              const s = genres.includes(g);
              return <button key={g} onClick={() => toggle(genres, setGenres, g)} style={{
                padding: "7px 15px", borderRadius: 50, fontFamily: "'Nunito', sans-serif",
                border: s ? "2px solid #e94560" : "2px solid #ffffff18",
                background: s ? "#e9456022" : "transparent",
                color: s ? "#e94560" : "#ffffffaa",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>{g}</button>;
            })}
          </div>
        </Card>

        <Card className="fade-d1" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#ffffff55", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Époques</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {DECADES.map(d => {
              const s = decades.includes(d);
              return <button key={d} onClick={() => toggle(decades, setDecades, d)} style={{
                padding: "7px 15px", borderRadius: 50, fontFamily: "'Nunito', sans-serif",
                border: s ? "2px solid #ffd93d" : "2px solid #ffffff18",
                background: s ? "#ffd93d22" : "transparent",
                color: s ? "#ffd93d" : "#ffffffaa",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>{d}</button>;
            })}
          </div>
        </Card>

        <Card className="fade-d2" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#ffffff55", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Paramètres</div>
          {[
            { label: "Manches", val: rounds, set: setRounds, min: 5, max: 20, color: "#6bcb77", suffix: "" },
            { label: "Temps / manche", val: timerSec, set: setTimerSec, min: 10, max: 45, color: "#4d96ff", suffix: "s" },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffffaa" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val}{s.suffix}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(+e.target.value)}
                style={{ accentColor: s.color }} />
            </div>
          ))}
        </Card>

        <PrimaryBtn
          onClick={() => ok && !loading && onCreate({ genres, decades, rounds, timerSec, hostName: name })}
          disabled={!ok || loading}
          style={{ width: "100%", padding: "15px", fontSize: 16 }}
        >
          {loading ? "Création..." : "Créer la room →"}
        </PrimaryBtn>
      </div>
    </div>
  );
}