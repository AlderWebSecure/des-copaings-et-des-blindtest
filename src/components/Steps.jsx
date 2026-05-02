export default function Steps({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 5, flex: 1, borderRadius: 3,
          background: i < current ? "var(--primary)" : i === current ? "var(--primary)" + "88" : "var(--border)",
          transition: "background .3s",
        }} />
      ))}
    </div>
  );
}