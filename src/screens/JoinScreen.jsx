import { useState } from "react";
import Card       from "../components/Card";
import PrimaryBtn from "../components/PrimaryBtn";
import GhostBtn   from "../components/GhostBtn";

export default function JoinScreen({ code: initCode, onBack, onJoin, loading, error }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(initCode || "");

  const submit = () => {
    if (!loading && code.trim() && name.trim()) onJoin(code.trim(), name.trim());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div className="fade" style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>👋</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Rejoindre une room</h2>
          <p style={{ fontSize: 14, color: "#ffffffaa", fontWeight: 600 }}>Entre le code et ton pseudo pour jouer</p>
        </div>

        {error && (
          <Card className="fade" style={{ marginBottom: 14, borderColor: "#ff6b6b66", background: "#ff6b6b11" }}>
            <div style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700 }}>⚠ {error}</div>
          </Card>
        )}

        <div className="fade-d1" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Code room — ex: KIWI-42"
            onKeyDown={e => e.key === "Enter" && submit()}
            maxLength={20}
            style={{ fontSize: 18, fontWeight: 900, textAlign: "center", letterSpacing: "0.1em" }}
          />
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ton pseudo"
            onKeyDown={e => e.key === "Enter" && submit()}
            maxLength={20}
            style={{ fontSize: 14, fontWeight: 700, textAlign: "center" }}
          />
        </div>

        <div className="fade-d2" style={{ display: "flex", gap: 8 }}>
          <GhostBtn onClick={onBack} style={{ flex: 1 }}>Retour</GhostBtn>
          <PrimaryBtn
            onClick={submit}
            disabled={loading || !code.trim() || !name.trim()}
            color="#6bcb77"
            style={{ flex: 2 }}
          >
            {loading ? "Connexion..." : "Rejoindre 🚀"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}