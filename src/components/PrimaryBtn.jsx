export default function PrimaryBtn({ children, onClick, disabled, style = {}, color = "#e94560" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "none"; } }}
      onMouseUp={e   => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = disabled ? "none" : `0 4px 0 ${color}88`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = disabled ? "none" : `0 4px 0 ${color}88`; }}
      style={{
        background: disabled ? "#ffffff22" : color,
        color: disabled ? "#ffffff55" : "#1a1a2e",
        border: "none",
        borderRadius: 14,
        padding: "13px 28px",
        fontSize: 15,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Nunito', sans-serif",
        letterSpacing: "0.3px",
        boxShadow: disabled ? "none" : `0 4px 0 ${color}88`,
        transform: "translateY(0)",
        transition: "all .1s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}