import { useState } from "react";
import Card       from "../components/Card";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function HomeScreen({ onCreate, onJoin }) {
  const [code, setCode] = useState("");
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 20px" }}>
      <div className="fade" style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#7c6dfa",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🎵</div>
          <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px" }}>
            Blind<span style={{ color: "#7c6dfa" }}>drop</span>
          </span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 8 }}>
          Le blindtest<br />entre amis.
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Un host, une enceinte, tout le monde joue.<br />
          Aucun compte requis pour les joueurs.
        </p>
      </div>

      <div className="fade-d1" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        <PrimaryBtn onClick={onCreate} style={{ width: "100%", padding: "14px", fontSize: 15 }}>
          Créer une partie
        </PrimaryBtn>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Code room — ex: KIWI-42"
            style={{ flex: 1 }}
            onKeyDown={e => e.key === "Enter" && code && onJoin(code)}
          />
          <PrimaryBtn onClick={() => code && onJoin(code)} disabled={!code} style={{ flexShrink: 0, padding: "10px 18px" }}>
            Rejoindre
          </PrimaryBtn>
        </div>
      </div>

      <div className="fade-d2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          { icon: "🎸", title: "12 genres" },
          { icon: "📅", title: "60s → 2020s" },
          { icon: "👥", title: "20 joueurs max" },
        ].map(f => (
          <Card key={f.title} style={{ textAlign: "center", padding: "14px 8px" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>{f.title}</div>
          </Card>
        ))}
      </div>

      <div className="fade-d3" style={{ marginTop: 32 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", marginBottom: 12, textTransform: "uppercase" }}>
          Comment ça marche
        </div>
        {[
          ["1", "Le host crée une room et configure les genres"],
          ["2", "Les joueurs rejoignent avec le code room"],
          ["3", "Le host lance la musique, tout le monde répond"],
          ["4", "Le score final est révélé après toutes les manches"],
        ].map(([n, t]) => (
          <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: "#7c6dfa22",
              color: "#7c6dfa", fontSize: 11, fontWeight: 500, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
            }}>{n}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}