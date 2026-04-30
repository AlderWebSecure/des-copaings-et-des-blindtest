export default function Avatar({ name, color, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      border: `3px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 800, color: "#1a1a2e",
      flexShrink: 0, letterSpacing: "-0.5px",
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}