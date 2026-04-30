export default function Waveform({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 40 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: active
            ? `hsl(${250 + i * 3}, 80%, ${55 + Math.sin(i) * 10}%)`
            : "var(--color-border-secondary)",
          height: active ? `${14 + Math.sin(i * 0.8 + 1) * 12}px` : "6px",
          animation: active ? `waveBar ${.5 + (i % 5) * .12}s ${i * .04}s ease-in-out infinite` : "none",
          transition: "height .4s ease",
        }} />
      ))}
    </div>
  );
}