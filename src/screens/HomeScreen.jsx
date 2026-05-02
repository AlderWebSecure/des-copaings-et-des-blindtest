import { useState } from "react";
import Card        from "../components/Card";
import PrimaryBtn  from "../components/PrimaryBtn";
import ThemePicker from "../components/ThemePicker";

export default function HomeScreen({ onCreate, onJoin, theme, onThemeChange }) {
  const [code, setCode] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 20px", position: "relative", overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Sélecteur de thème en haut à droite */}
      <ThemePicker current={theme} onChange={onThemeChange} />

      {/* Background blobs */}
      {[
        ["-10%", "10%", "var(--primary)"],
        ["70%", "60%",  "var(--info)"],
        ["30%", "80%",  "var(--secondary)"],
      ].map(([x, y, c], i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y,
          width: 320, height: 320, borderRadius: "50%",
          background: c, filter: "blur(90px)", opacity: 0.15,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ maxWidth: 460, width: "100%", position: "relative", zIndex: 1 }}>

        <div className="fade" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
              boxShadow: "0 6px 0 var(--primary)", filter: "brightness(1)",
              animation: "float 3s ease-in-out infinite",
            }}>🎵</div>
            <span style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", letterSpacing: "-1px" }}>
              blind<span style={{ color: "var(--primary)" }}>drop</span>
            </span>
          </div>

          <h1 style={{
            fontSize: 38, fontWeight: 900, color: "var(--text)",
            lineHeight: 1.1, marginBottom: 12, letterSpacing: "-1px",
          }}>
            Le blindtest<br />
            <span style={{ color: "var(--secondary)" }}>entre potes.</span>
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6 }}>
            Un host lance la musique — tout le monde joue.<br />
            Aucun compte requis pour les joueurs !
          </p>
        </div>

        <div className="fade-d1" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          <PrimaryBtn onClick={onCreate} style={{ fontSize: 17, padding: "16px", width: "100%" }}>
            🎮 Créer une partie
          </PrimaryBtn>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Code room — ex: KIWI-42"
              onKeyDown={e => e.key === "Enter" && code && onJoin(code)}
              style={{ flex: 1 }}
            />
            <PrimaryBtn onClick={() => code && onJoin(code)} disabled={!code} color="var(--info)" style={{ flexShrink: 0, padding: "12px 20px" }}>
              →
            </PrimaryBtn>
          </div>
        </div>

        <div className="fade-d2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { icon: "🎸", t: "12 genres" },
            { icon: "📅", t: "60s–2020s" },
            { icon: "👥", t: "20 joueurs" },
          ].map(f => (
            <Card key={f.t} style={{ textAlign: "center", padding: "16px 8px" }}>
              <div style={{ fontSize: 24, marginBottom: 6, animation: "float 3s ease-in-out infinite" }}>{f.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>{f.t}</div>
            </Card>
          ))}
        </div>

        <div className="fade-d3" style={{
          padding: "14px 18px",
          background: "var(--card)",
          borderRadius: 16,
          border: "2px solid var(--border)",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: "var(--text-3)",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
          }}>
            🎨 Personnalise ton expérience
          </div>
          <div style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 600 }}>
            6 thèmes funky disponibles · clique sur la palette en haut à droite
          </div>
        </div>
      </div>
    </div>
  );
}