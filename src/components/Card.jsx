export default function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--card)",
      border: "2px solid var(--border)",
      borderRadius: 20,
      padding: "1.2rem 1.4rem",
      ...style,
    }}>
      {children}
    </div>
  );
}