// src/components/SearchInput.jsx
// Input avec autocomplétion Deezer en temps réel

import { useState, useEffect, useRef } from "react";

export default function SearchInput({ value, onChange, onSubmit, disabled, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open,        setOpen]        = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [loading,     setLoading]     = useState(false);
  const debounceRef   = useRef(null);
  const wrapperRef    = useRef(null);
  const inputRef      = useRef(null);

  // Fetch suggestions debouncé
  useEffect(() => {
    if (disabled) return;
    if (!value || value.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/deezer?suggest=${encodeURIComponent(value)}&limit=8`);
        const data = await r.json();
        setSuggestions(data.suggestions || []);
        setOpen((data.suggestions || []).length > 0);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [value, disabled]);

  // Click outside → ferme
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (sugg) => {
    onChange(sugg.label);
    setOpen(false);
    setActiveIdx(-1);
    setTimeout(() => onSubmit(sugg.label), 50);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIdx >= 0 && suggestions[activeIdx]) {
        pick(suggestions[activeIdx]);
      } else if (value.trim()) {
        setOpen(false);
        onSubmit(value);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", flex: 1 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        style={{
          width: "100%", background: "var(--card-2)",
          border: `2px solid ${disabled ? "var(--success)" : "var(--border)"}`,
          borderRadius: 10, padding: "11px 14px",
          color: "var(--text)", fontSize: 14, fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
        }}
      />

      {/* Loading dot */}
      {loading && (
        <div style={{
          position: "absolute", right: 14, top: "50%",
          transform: "translateY(-50%)",
          width: 12, height: 12, borderRadius: "50%",
          border: "2px solid var(--border)",
          borderTopColor: "var(--primary)",
          animation: "spin 0.6s linear infinite",
        }} />
      )}

      {/* Dropdown suggestions */}
      {open && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          marginTop: 6,
          background: "var(--card)",
          border: "2px solid var(--border)",
          borderRadius: 12,
          maxHeight: 280, overflowY: "auto",
          zIndex: 50,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px",
                cursor: "pointer",
                background: i === activeIdx ? "var(--card-2)" : "transparent",
                borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background .1s",
              }}
            >
              {s.cover ? (
                <img src={s.cover} alt="" style={{
                  width: 36, height: 36, borderRadius: 6,
                  objectFit: "cover", flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: "var(--card-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>🎵</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: "var(--text)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: "var(--text-3)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {s.artist}
                </div>
              </div>
              {i === activeIdx && (
                <span style={{
                  fontSize: 10, color: "var(--text-3)", fontWeight: 700,
                  flexShrink: 0,
                }}>↵</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}