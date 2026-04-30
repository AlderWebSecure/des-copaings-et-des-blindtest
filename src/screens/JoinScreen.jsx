import { useState } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function JoinScreen({ code: initCode, onBack, onJoin }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(initCode || "");

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
      <div className="fade" style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>👋</div>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>Rejoindre une room</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Entre le code et ton pseudo pour commencer</p>
      </div>
      <div className="fade-d1" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Code room — KIWI-42" style={{ textAlign: "center", fontSize: 16, letterSpacing: "0.1em" }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton pseudo" />
      </div>
      <div className="fade-d2" style={{ display: "flex", gap: 8 }}>
        <GhostBtn onClick={onBack} style={{ flex: 1 }}>Retour</GhostBtn>
        <PrimaryBtn onClick={() => code && name && onJoin(code, name)} disabled={!code || !name} style={{ flex: 2 }}>
          Rejoindre →
        </PrimaryBtn>
      </div>
    </div>
  );
}