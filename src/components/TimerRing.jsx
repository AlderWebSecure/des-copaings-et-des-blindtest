export default function TimerRing({ seconds, total }) {
  const r = 34, circ = 2 * Math.PI * r;
  const frac = seconds / total;
  const hue  = Math.round(frac * 120);
  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none"
          stroke={`hsl(${hue},75%,55%)`} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={circ - frac * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 1s" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontWeight: 500, fontSize: 20,
        color: seconds <= 5 ? "#ef4444" : "var(--color-text-primary)",
      }}>
        {seconds}
      </div>
    </div>
  );
}