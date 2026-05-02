export default function Badge({ label, color }) {
  const c = color || "var(--primary)";
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 100,
      background: `${c}33`,
      color: c,
      fontSize: 12,
      fontWeight: 700,
      border: `1.5px solid ${c}55`,
      letterSpacing: "0.3px",
    }}>
      {label}
    </span>
  );
}