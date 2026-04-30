export default function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "#16213e",
      border: "2px solid #ffffff0f",
      borderRadius: 20,
      padding: "1.2rem 1.4rem",
      ...style,
    }}>
      {children}
    </div>
  );
}