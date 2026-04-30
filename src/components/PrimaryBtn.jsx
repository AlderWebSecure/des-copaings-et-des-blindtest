export default function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "var(--color-border-tertiary)" : "#7c6dfa",
      color: disabled ? "var(--color-text-tertiary)" : "#fff",
      border: "none",
      borderRadius: "var(--border-radius-lg)",
      padding: "12px 28px",
      fontSize: 14,
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style,
    }}>
      {children}
    </button>
  );
}