// src/components/ArtistPicker.jsx
// Cherche des artistes Deezer + permet d'en sélectionner plusieurs

import { useState, useEffect, useRef } from "react";

export default function ArtistPicker({ selected = [], onChange }) {
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/deezer?artist_search=${encodeURIComponent(query)}`);
        const data = await r.json();
        setResults(data.artists || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const add = (artist) => {
    if (selected.find(a => a.id === artist.id)) return;
    onChange([...selected, artist]);
    setQuery("");
    setOpen(false);
  };

  const remove = (id) => {
    onChange(selected.filter(a => a.id !== id));
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* Sélectionnés */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {selected.map(a => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--card-2)",
              border: "2px solid var(--primary)",
              borderRadius: 50, padding: "4px 6px 4px 12px",
            }}>
              {a.picture && (
                <img src={a.picture} alt="" style={{
                  width: 24, height: 24, borderRadius: "50%", objectFit: "cover",
                }} />
              )}
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{a.name}</span>
              <button onClick={() => remove(a.id)} style={{
                background: "var(--primary)", color: "var(--bg)",
                border: "none", borderRadius: "50%",
                width: 20, height: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, padding: 0,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Cherche un artiste sur Deezer…"
        style={{ width: "100%" }}
      />

      {loading && (
        <div style={{
          position: "absolute", right: 14, top: 14,
          width: 14, height: 14, borderRadius: "50%",
          border: "2px solid var(--border)",
          borderTopColor: "var(--primary)",
          animation: "spin 0.6s linear infinite",
        }} />
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          marginTop: 6,
          background: "var(--card)",
          border: "2px solid var(--primary)",
          borderRadius: 12,
          maxHeight: 280, overflowY: "auto",
          zIndex: 1000,
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        }}>
          {results.map(a => {
            const already = selected.find(s => s.id === a.id);
            return (
              <div
                key={a.id}
                onMouseDown={(e) => { e.preventDefault(); if (!already) add(a); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px",
                  cursor: already ? "default" : "pointer",
                  opacity: already ? 0.4 : 1,
                  borderBottom: "1px solid var(--border)",
                  transition: "background .1s",
                }}
                onMouseEnter={e => !already && (e.currentTarget.style.background = "var(--card-2)")}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {a.picture ? (
                  <img src={a.picture} alt="" style={{
                    width: 36, height: 36, borderRadius: "50%",
                    objectFit: "cover", flexShrink: 0,
                  }} />
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--card-2)", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>🎤</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>
                    {a.nb_fan ? `${(a.nb_fan / 1000).toFixed(0)}k fans` : "Artiste"}
                  </div>
                </div>
                {already && <span style={{ color: "var(--success)", fontSize: 16, fontWeight: 800 }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}