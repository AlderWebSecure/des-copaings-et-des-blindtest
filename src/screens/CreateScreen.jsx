import { useState } from "react";
import Card         from "../components/Card";
import PrimaryBtn   from "../components/PrimaryBtn";
import GhostBtn     from "../components/GhostBtn";
import ArtistPicker from "../components/ArtistPicker";
import { GENRES, DECADES } from "../constants/genres";

export default function CreateScreen({ onBack, onCreate, loading, error }) {
  const [mode,     setMode]     = useState("genres");  // "genres" | "artists" | "mixed"
  const [genres,   setGenres]   = useState(["Pop", "Hip-Hop"]);
  const [decades,  setDecades]  = useState(["2010s", "2020s"]);
  const [artists,  setArtists]  = useState([]);
  const [rounds,   setRounds]   = useState(10);
  const [timerSec, setTimerSec] = useState(25);
  const [name,     setName]     = useState("");

  const toggle = (arr, set, val) =>
    set(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const useGenres  = mode === "genres" || mode === "mixed";
  const useArtists = mode === "artists" || mode === "mixed";

  const ok =
    name.trim() &&
    ((useGenres && genres.length > 0 && decades.length > 0) ||
     (useArtists && artists.length > 0));

  const submit = () => {
    if (!ok || loading) return;
    onCreate({
      genres:   useGenres  ? genres   : [],
      decades:  useGenres  ? decades  : DECADES,
      artists:  useArtists ? artists  : [],
      rounds,
      timerSec,
      hostName: name,
      mode,
    });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <div className="fade" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <GhostBtn onClick={onBack} style={{ padding: "8px 16px", fontSize: 13 }}>← Retour</GhostBtn>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)" }}>Créer une partie</h2>
            <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>Configure et invite tes amis</div>
          </div>
        </div>

        {error && (
          <Card className="fade" style={{ marginBottom: 12, borderColor: "#ff6b6b66", background: "#ff6b6b11" }}>
            <div style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700 }}>⚠ {error}</div>
          </Card>
        )}

        <Card className="fade" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Ton pseudo</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Orel" maxLength={20} />
        </Card>

        <Card className="fade-d1" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Type de partie
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { key: "genres",  label: "Genres",   icon: "🎸", desc: "Par style et époque" },
              { key: "artists", label: "Artistes", icon: "🎤", desc: "Tes artistes préférés" },
              { key: "mixed",   label: "Mix",      icon: "🎲", desc: "Les deux combinés" },
            ].map(m => {
              const sel = mode === m.key;
              return (
                <button key={m.key} onClick={() => setMode(m.key)} style={{
                  background: sel ? "var(--primary)" + "22" : "var(--card-2)",
                  border: sel ? "2px solid var(--primary)" : "2px solid var(--border)",
                  borderRadius: 14, padding: "12px 8px",
                  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                  textAlign: "center",
                  transition: "all .15s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: sel ? "var(--primary)" : "var(--text)" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, marginTop: 2 }}>
                    {m.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {useArtists && (
          <Card className="fade-d1" style={{ marginBottom: 12, position: "relative", zIndex: 50, overflow: "visible" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              Artistes choisis
              {artists.length > 0 && <span style={{ color: "var(--primary)" }}> · {artists.length}</span>}
            </div>
            <ArtistPicker selected={artists} onChange={setArtists} />
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 8, fontWeight: 600 }}>
              💡 Tape le nom d'un artiste pour le rechercher sur Deezer
            </div>
          </Card>
        )}

        {useGenres && (
          <>
            <Card className="fade-d1" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                Genres {genres.length > 0 && <span style={{ color: "var(--primary)" }}>· {genres.length} choisis</span>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {GENRES.map(g => {
                  const s = genres.includes(g);
                  return <button key={g} onClick={() => toggle(genres, setGenres, g)} style={{
                    padding: "7px 15px", borderRadius: 50, fontFamily: "'Nunito', sans-serif",
                    border: s ? "2px solid var(--primary)" : "2px solid var(--border)",
                    background: s ? "var(--primary)" + "22" : "transparent",
                    color: s ? "var(--primary)" : "var(--text-2)",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>{g}</button>;
                })}
              </div>
            </Card>

            <Card className="fade-d1" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Époques</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {DECADES.map(d => {
                  const s = decades.includes(d);
                  return <button key={d} onClick={() => toggle(decades, setDecades, d)} style={{
                    padding: "7px 15px", borderRadius: 50, fontFamily: "'Nunito', sans-serif",
                    border: s ? "2px solid var(--secondary)" : "2px solid var(--border)",
                    background: s ? "var(--secondary)" + "22" : "transparent",
                    color: s ? "var(--secondary)" : "var(--text-2)",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>{d}</button>;
                })}
              </div>
            </Card>
          </>
        )}

        <Card className="fade-d2" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Paramètres</div>
          {[
            { label: "Manches", val: rounds, set: setRounds, min: 5, max: 20, color: "var(--success)", suffix: "" },
            { label: "Temps / manche", val: timerSec, set: setTimerSec, min: 10, max: 45, color: "var(--info)", suffix: "s" },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val}{s.suffix}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(+e.target.value)} />
            </div>
          ))}
        </Card>

        <PrimaryBtn
          onClick={submit}
          disabled={!ok || loading}
          style={{ width: "100%", padding: "15px", fontSize: 16 }}
        >
          {loading ? "Création..." : "Créer la room →"}
        </PrimaryBtn>
      </div>
    </div>
  );
}