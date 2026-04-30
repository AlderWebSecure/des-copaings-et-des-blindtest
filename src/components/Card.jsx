export default function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "1rem 1.25rem",
      ...style,
    }}>
      {children}
    </div>
  );
}