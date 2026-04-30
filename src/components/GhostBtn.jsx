export default function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent",
      color: "var(--color-text-secondary)",
      border: "0.5px solid var(--color-border-secondary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "11px 24px",
      fontSize: 14,
      fontWeight: 500,
      ...style,
    }}>
      {children}
    </button>
  );
}