export default function Steps({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, flex: 1, borderRadius: 2,
          background: i < current ? "#7c6dfa" : i === current ? "#7c6dfa66" : "var(--color-border-tertiary)",
          transition: "background .3s",
        }} />
      ))}
    </div>
  );
}