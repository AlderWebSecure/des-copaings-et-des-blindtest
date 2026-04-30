export default function Badge({ label, color = "#e94560" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 100,
      background: color + "33",
      color: color,
      fontSize: 12,
      fontWeight: 700,
      border: `1.5px solid ${color}55`,
      letterSpacing: "0.3px",
    }}>
      {label}
    </span>
  );
}