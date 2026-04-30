export default function Badge({ label, color = "#7c6dfa" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 100,
      background: color + "22", color, fontSize: 12, fontWeight: 500, letterSpacing: "0.2px",
    }}>
      {label}
    </span>
  );
}