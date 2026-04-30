export default function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent",
      color: "#ffffffaa",
      border: "2px solid #ffffff22",
      borderRadius: 14,
      padding: "12px 24px",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Nunito', sans-serif",
      transition: "all .15s",
      ...style,
    }}>
      {children}
    </button>
  );
}