export default function Steps({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 5, flex: 1, borderRadius: 3,
          background: i < current ? "#e94560" : i === current ? "#e9456088" : "#ffffff15",
          transition: "background .3s",
        }} />
      ))}
    </div>
  );
}