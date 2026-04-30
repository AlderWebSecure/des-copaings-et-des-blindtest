import { useState } from "react";

export default function SourceScreen({ onSelect, onBack, spotifyConnected, onSpotifyLogin }) {
  const [chosen, setChosen] = useState(null);

  const choose = (src) => {
    setChosen(src);
    if (src === "spotify" && !spotifyConnected) {
      onSpotifyLogin();
      return;
    }
    onSelect(src);
  };

  const Panel = ({ children, selected, onClick }) => (
    <div onClick={onClick} style={{
      background: selected ? "#16213e" : "#0f3460",
      borderRadius: 20,
      padding: "1.6rem",
      border: `2px solid ${selected ? "#e94560" : "#ffffff15"}`,
      cursor: "pointer",
      transition: "all .2s",
      transform: selected ? "scale(1.02)" : "scale(1)",
      boxShadow: selected ? "0 8px 32px #e9456033" : "none",
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#1a1a2e",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 20px", fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎧</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
            Source musicale
          </h2>
          <p style={{ fontSize: 14, color: "#ffffffaa", fontWeight: 600, lineHeight: 1.6 }}>
            Le host choisit comment la musique est jouée.<br />
            Les joueurs n'ont besoin de rien.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>

          <Panel selected={chosen === "deezer"} onClick={() => setChosen("deezer")}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, #ef5466, #a238d4)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>🎵</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Deezer</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800,
                    background: "#6bcb7733", color: "#6bcb77", border: "1.5px solid #6bcb7755",
                  }}>GRATUIT</span>
                </div>
                <p style={{ fontSize: 13, color: "#ffffffaa", fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                  Extraits 30 secondes sur des millions de titres. Aucun compte requis.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["✓ Aucun compte", "✓ 90M+ titres", "✓ Extraits 30s"].map(f => (
                    <span key={f} style={{
                      fontSize: 11, fontWeight: 700, color: "#6bcb77",
                      background: "#6bcb7718", borderRadius: 50, padding: "3px 10px",
                    }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel selected={chosen === "spotify"} onClick={() => setChosen("spotify")}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "#1ed760",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>♫</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Spotify</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800,
                    background: "#ffd93d33", color: "#ffd93d", border: "1.5px solid #ffd93d55",
                  }}>PREMIUM</span>
                </div>
                <p style={{ fontSize: 13, color: "#ffffffaa", fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                  Lecture complète depuis ton compte Spotify Premium.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["✓ Titres complets", "✓ Haute qualité", "⚠ Premium requis"].map(f => (
                    <span key={f} style={{
                      fontSize: 11, fontWeight: 700,
                      color: f.startsWith("⚠") ? "#ffd93d" : "#1ed760",
                      background: (f.startsWith("⚠") ? "#ffd93d" : "#1ed760") + "18",
                      borderRadius: 50, padding: "3px 10px",
                    }}>{f}</span>
                  ))}
                </div>
                {spotifyConnected && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#1ed760", fontWeight: 700 }}>
                    ✓ Compte connecté
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} style={{
            flex: 1, background: "transparent", color: "#ffffffaa",
            border: "2px solid #ffffff22", borderRadius: 14,
            padding: "13px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}>
            ← Retour
          </button>
          <button
            onClick={() => chosen && choose(chosen)}
            disabled={!chosen}
            style={{
              flex: 2, background: chosen ? "#e94560" : "#ffffff22",
              color: chosen ? "#1a1a2e" : "#ffffff55",
              border: "none", borderRadius: 14,
              padding: "13px", fontSize: 15, fontWeight: 800,
              cursor: chosen ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: chosen ? "0 4px 0 #e9456088" : "none",
            }}
          >
            {chosen === "spotify" && !spotifyConnected
              ? "Se connecter à Spotify →"
              : chosen ? "Confirmer →" : "Choisir une source"}
          </button>
        </div>
      </div>
    </div>
  );
}