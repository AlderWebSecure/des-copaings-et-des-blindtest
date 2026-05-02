// src/components/ThemePicker.jsx
// Sélecteur de thème (palette de couleurs) — bouton flottant + panneau

import { useState } from "react";
import { THEMES } from "../styles/themes";

export default function ThemePicker({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const themeKeys = Object.keys(THEMES);

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
      <button
        onClick={() => setOpen(!open)}
        title="Changer le thème"
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--card)",
          border: "2px solid var(--border)",
          color: "var(--text)",
          fontSize: 20,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Nunito', sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        🎨
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
          />

          <div style={{
            position: "absolute",
            top: 56, right: 0,
            background: "var(--card)",
            border: "2px solid var(--border)",
            borderRadius: 16,
            padding: 14,
            minWidth: 240,
            zIndex: 101,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800,
              color: "var(--text-3)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              🎨 Choisir un thème
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {themeKeys.map(key => {
                const t = THEMES[key];
                const sel = key === current;
                return (
                  <button
                    key={key}
                    onClick={() => { onChange(key); setOpen(false); }}
                    style={{
                      background: t.bgGradient || t.bg,
                      border: sel ? `3px solid ${t.primary}` : "2px solid var(--border)",
                      borderRadius: 12,
                      padding: "10px 8px",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                      transform: sel ? "scale(1.02)" : "scale(1)",
                      fontFamily: "'Nunito', sans-serif",
                      textAlign: "center",
                      color: t.text,
                    }}
                    onMouseEnter={e => !sel && (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={e => !sel && (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{t.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{t.name}</div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 6 }}>
                      {[t.primary, t.secondary, t.success, t.info].map((c, i) => (
                        <div key={i} style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: c,
                        }} />
                      ))}
                    </div>

                    {sel && (
                      <div style={{
                        fontSize: 10, fontWeight: 800,
                        color: t.primary, marginTop: 4,
                      }}>✓ Actif</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}