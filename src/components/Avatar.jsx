export default function Avatar({ name, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 500, color: "#fff", flexShrink: 0,
      letterSpacing: "-0.5px",
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}