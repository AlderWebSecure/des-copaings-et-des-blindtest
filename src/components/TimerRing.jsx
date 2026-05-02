export default function TimerRing({ seconds, total }) {
  const r = 32, circ = 2 * Math.PI * r;
  const frac = seconds / total;
  const hue  = Math.round(frac * 120);
  return (
    <div style={{ position: "relative", width: 76, height: 76 }}>
      <svg width={76} height={76} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="var(--border)" strokeWidth={7} />
        <circle cx={38} cy={38} r={r} fill="none"
          stroke={`hsl(${hue}, 90%, 60%)`} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={circ - frac * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 1s" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: 22,
        color: seconds <= 5 ? "#ff6b6b" : "var(--text)",
        fontFamily: "'Nunito', sans-serif",
      }}>
        {seconds}
      </div>
    </div>
  );
}