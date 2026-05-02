export default function Waveform({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height: 48 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          width: 5, borderRadius: 3,
          background: active ? `hsl(${340 + i * 4}, 90%, 65%)` : "var(--border)",
          height: active ? `${16 + Math.sin(i * 0.9 + 1) * 14}px` : "5px",
          animation: active ? `waveBar ${.45 + (i % 5) * .13}s ${i * .05}s ease-in-out infinite` : "none",
          transition: "height .3s ease",
        }} />
      ))}
    </div>
  );
}