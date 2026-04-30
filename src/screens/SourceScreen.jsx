// src/screens/SourceScreen.jsx
// Écran de choix de la source musicale : Spotify Premium ou Deezer gratuit

import { useState } from "react";

const BG   = "#1a1a2e";
const CARD = "#16213e";
const ACC  = "#e94560";
const YEL  = "#ffd93d";
const GRN  = "#6bcb77";
const BLU  = "#4d96ff";
const txt  = "#ffffff";
const txt2 = "#ffffffaa";
const txt3 = "#ffffff55";

const Panel = ({ children, style = {}, onClick, selected }) => (
  <div onClick={onClick} style={{
    background: selected ? CARD : "#0f3460",
    borderRadius: 20,
    padding: "1.6rem",
    border: `2px solid ${selected ? ACC : "#ffffff15"}`,
    cursor: onClick ? "pointer" : "default",
    transition: "all .2s",
    transform: selected ? "scale(1.02)" : "scale(1)",
    boxShadow: selected ? `0 8px 32px ${ACC}33` : "none",
    ...style,
  }}>
    {children}
  </div>
);

export default function SourceScreen({ onSelect, onBack, spotifyConnected, onSpotifyLogin }) {
  const [chosen, setChosen] = useState(null); // "spotify" | "deezer"

  const choose = (src) => {
    setChosen(src);
    if (src === "spotify" && !spotifyConnected) {
      onSpotifyLogin();
      return;
    }
    onSelect(src);
  };

  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 20px", fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎧</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: txt, marginBottom: 8 }}>
            Choix de la source musicale
          </h2>
          <p style={{ fontSize: 14, color: txt2, fontWeight: 600, lineHeight: 1.6 }}>
            Le host choisit comment la musique est jouée.<br />
            Les joueurs n'ont besoin de rien.
          </p>
        </div>

        {/* options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>

          {/* DEEZER */}
          <Panel selected={chosen === "deezer"} onClick={() => setChosen("deezer")} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, #ef5466, #a238d4)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>🎵</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: txt }}>Deezer</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800,
                    background: GRN + "33", color: GRN, border: `1.5px solid ${GRN}55`,
                  }}>GRATUIT</span>
                </div>
                <p style={{ fontSize: 13, color: txt2, fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                  Extraits 30 secondes sur des millions de titres. Aucun compte requis, fonctionne immédiatement.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["✓ Aucun compte", "✓ 90M+ titres", "✓ Extraits 30s", "✓ Immédiat"].map(f => (
                    <span key={f} style={{
                      fontSize: 11, fontWeight: 700, color: GRN,
                      background: GRN + "18", borderRadius: 50, padding: "3px 10px",
                    }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          {/* SPOTIFY */}
          <Panel selected={chosen === "spotify"} onClick={() => setChosen("spotify")} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "#1ed760",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>♫</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: txt }}>Spotify</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800,
                    background: YEL + "33", color: YEL, border: `1.5px solid ${YEL}55`,
                  }}>PREMIUM</span>
                </div>
                <p style={{ fontSize: 13, color: txt2, fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                  Lecture complète des titres depuis ton compte Spotify Premium. Qualité maximale, catalogue complet.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["✓ Titres complets", "✓ Haute qualité", "✓ Catalogue complet", "⚠ Premium requis"].map(f => (
                    <span key={f} style={{
                      fontSize: 11, fontWeight: 700,
                      color: f.startsWith("⚠") ? YEL : "#1ed760",
                      background: (f.startsWith("⚠") ? YEL : "#1ed760") + "18",
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

        {/* comparison table */}
        <div style={{
          background: "#0f3460", borderRadius: 16, padding: "16px 20px",
          marginBottom: 24, border: "1px solid #ffffff0f",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: txt3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Comparaison rapide
          </div>
          <table style={{ width: "100%", fontSize: 12, fontWeight: 700, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", color: txt3, paddingBottom: 8, fontWeight: 800 }}>Critère</th>
                <th style={{ textAlign: "center", color: "#ef5466", paddingBottom: 8, fontWeight: 800 }}>Deezer</th>
                <th style={{ textAlign: "center", color: "#1ed760", paddingBottom: 8, fontWeight: 800 }}>Spotify</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Compte requis", "Non", "Premium"],
                ["Durée extrait", "30s", "Illimité"],
                ["Qualité audio", "Bonne", "Excellente"],
                ["Catalogue", "90M+", "100M+"],
                ["Setup", "Immédiat", "OAuth login"],
              ].map(([label, dz, sp]) => (
                <tr key={label} style={{ borderTop: "1px solid #ffffff08" }}>
                  <td style={{ padding: "7px 0", color: txt2 }}>{label}</td>
                  <td style={{ textAlign: "center", color: dz === "Non" || dz === "Immédiat" ? GRN : txt2 }}>{dz}</td>
                  <td style={{ textAlign: "center", color: sp === "Premium" ? YEL : sp === "OAuth login" ? YEL : GRN }}>{sp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} style={{
            flex: 1, background: "transparent", color: txt2,
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
              flex: 2, background: chosen ? ACC : "#ffffff22",
              color: chosen ? "#1a1a2e" : txt3,
              border: "none", borderRadius: 14,
              padding: "13px", fontSize: 15, fontWeight: 800,
              cursor: chosen ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: chosen ? `0 4px 0 ${ACC}88` : "none",
              transition: "all .15s",
            }}
          >
            {chosen === "spotify" && !spotifyConnected
              ? "Se connecter à Spotify →"
              : chosen ? "Confirmer le choix →" : "Choisir une source"}
          </button>
        </div>
      </div>
    </div>
  );
}