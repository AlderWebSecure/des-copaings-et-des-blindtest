export default function PrimaryBtn({ children, onClick, disabled, style = {}, color }) {
  const c = color || "var(--primary)";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "none"; } }}
      onMouseUp={e   => { if (!disabled) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 0 ${c}88`; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 0 ${c}88`; } }}
      style={{
        background: disabled ? "var(--border)" : c,
        color: disabled ? "var(--text-3)" : "#1a1a2e",
        border: "none",
        borderRadius: 14,
        padding: "13px 28px",
        fontSize: 15,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Nunito', sans-serif",
        letterSpacing: "0.3px",
        boxShadow: disabled ? "none" : `0 4px 0 ${c}88`,
        transform: "translateY(0)",
        transition: "all .1s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}