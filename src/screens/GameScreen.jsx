import { useState, useEffect, useRef } from "react";
import Card      from "../components/Card";
import Badge     from "../components/Badge";
import Avatar    from "../components/Avatar";
import Waveform  from "../components/Waveform";
import TimerRing from "../components/TimerRing";
import Steps     from "../components/Steps";
import { PrimaryBtn } from "../components/PrimaryBtn";

export default function GameScreen({ round, roundIndex, totalRounds, players, timerSec, onSubmit, onTimeout }) {
  const [timer,     setTimer]     = useState(timerSec);
  const [answer,    setAnswer]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [playing,   setPlaying]   = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimer(timerSec); setAnswer(""); setSubmitted(false); setPlaying(true);
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(intervalRef.current); onTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [round]);

  const submit = () => {
    if (submitted || !answer.trim()) return;
    clearInterval(intervalRef.current);
    setSubmitted(true);
    setTimeout(() => onSubmit(answer, timer), 600);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <div className="fade" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Manche</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>
            {roundIndex + 1}<span style={{ color: "var(--color-text-tertiary)", fontSize: 14, fontWeight: 400 }}> / {totalRounds}</span>
          </div>
        </div>
        <TimerRing seconds={timer} total={timerSec} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Ton score</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#7c6dfa" }}>{players[0].score}</div>
        </div>
      </div>

      <div className="fade" style={{ marginBottom: 20 }}>
        <Steps current={roundIndex} total={totalRounds} />
      </div>

      <Card className="fade-d1" style={{ textAlign: "center", padding: "28px 20px", marginBottom: 12, borderColor: "#7c6dfa44", background: "#7c6dfa08" }}>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>En cours de lecture</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Waveform active={playing && !submitted} />
        </div>
        <button onClick={() => setPlaying(p => !p)} style={{
          padding: "6px 16px", borderRadius: "var(--border-radius-md)", fontSize: 12,
          background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
          border: "0.5px solid var(--color-border-secondary)",
        }}>
          {playing ? "⏸ Pause" : "▶ Lecture"}
        </button>
      </Card>

      <Card className="fade-d1" style={{ marginBottom: 12, padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 18 }}>{round.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Indice genre</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{round.genre}</div>
          </div>
          <Badge label={round.year} color="#fb923c" />
        </div>
      </Card>

      <Card className="fade-d2" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Ta réponse :</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={answer} onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Artiste et/ou titre du morceau…"
            disabled={submitted}
            style={{ flex: 1, borderColor: submitted ? "#34d399" : undefined, background: submitted ? "#34d39911" : undefined }}
          />
          <PrimaryBtn onClick={submit} disabled={submitted || !answer.trim()} style={{ flexShrink: 0, padding: "10px 18px" }}>
            {submitted ? "✓" : "OK"}
          </PrimaryBtn>
        </div>
        {submitted && <div style={{ fontSize: 12, color: "#34d399", marginTop: 6 }}>Réponse envoyée !</div>}
      </Card>

      <Card className="fade-d3">
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>Statut des joueurs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {players.slice(1).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={p.name} color={p.color} size={28} />
              <div style={{ flex: 1, fontSize: 13, color: "var(--color-text-secondary)" }}>{p.name}</div>
              {i < 2
                ? <Badge label="a répondu" color="#34d399" />
                : <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-tertiary)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-border-secondary)", animation: "pulse 1.5s ease infinite" }} />
                    en cours…
                  </div>
              }
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}