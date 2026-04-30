import { useState, useEffect, useRef } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import Avatar     from "../components/Avatar";
import Waveform   from "../components/Waveform";
import TimerRing  from "../components/TimerRing";
import Steps      from "../components/Steps";
import PrimaryBtn from "../components/PrimaryBtn";

export default function GameScreen({
  round, roundIndex, totalRounds, players, me, timerSec, music, source,
  isHost, answers, myAnswer, onSubmit, onTimeout, onReveal,
}) {
  const [timer,  setTimer]  = useState(timerSec);
  const [answer, setAnswer] = useState("");
  const intervalRef = useRef(null);

  const submitted = !!myAnswer;
  const answeredCount = Object.keys(answers).length;
  const allAnswered   = answeredCount >= players.length;

  // Reset à chaque nouveau round
  useEffect(() => {
    setTimer(timerSec);
    setAnswer("");
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          if (isHost) onTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [roundIndex]);

  // Auto-reveal si tout le monde a répondu (host)
  useEffect(() => {
    if (isHost && allAnswered && answeredCount > 0) {
      clearInterval(intervalRef.current);
      const timeoutId = setTimeout(() => onReveal(), 800);
      return () => clearTimeout(timeoutId);
    }
  }, [allAnswered, isHost]);

  const submit = () => {
    if (submitted || !answer.trim()) return;
    onSubmit(answer, timer);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "28px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <div className="fade" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ background: "#16213e", borderRadius: 14, padding: "10px 16px" }}>
            <div style={{ fontSize: 10, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Manche</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
              {roundIndex + 1}<span style={{ color: "#ffffff55", fontSize: 14, fontWeight: 700 }}> / {totalRounds}</span>
            </div>
          </div>
          <TimerRing seconds={timer} total={timerSec} />
          <div style={{ background: "#16213e", borderRadius: 14, padding: "10px 16px", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Score</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#ffd93d" }}>
              {players.find(p => p.id === me?.id)?.score || 0}
            </div>
          </div>
        </div>

        <div className="fade" style={{ marginBottom: 18 }}>
          <Steps current={roundIndex} total={totalRounds} />
        </div>

        <Card className="fade-d1" style={{
          textAlign: "center", padding: "28px", marginBottom: 12,
          background: "linear-gradient(135deg, #16213e, #0f3460)",
          border: "2px solid #e9456033",
        }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            {source === "spotify" ? "♫ via Spotify" : "🎵 via Deezer"}
            {!isHost && <span style={{ color: "#ffd93d", marginLeft: 8 }}>· Le host joue la musique</span>}
          </div>

          {music?.loading && isHost && (
            <div style={{ color: "#ffffffaa", fontSize: 13, marginBottom: 12 }}>Chargement…</div>
          )}

          {music?.error && isHost && (
            <div style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              ⚠ {music.error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Waveform active={isHost ? (music?.playing && !submitted) : timer > 0} />
          </div>

          {isHost && (
            <button onClick={() => music?.playing ? music?.pause() : music?.resume()} style={{
              padding: "10px 24px", borderRadius: 50, fontSize: 14, fontWeight: 800,
              background: "#ffffff15", color: "#ffffffaa", border: "none", cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}>
              {music?.playing ? "⏸ Pause" : "▶ Lecture"}
            </button>
          )}
        </Card>

        <Card className="fade-d1" style={{ marginBottom: 12, padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22 }}>{round?.emoji || "🎵"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800 }}>Indice</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{round?.genre}</div>
            </div>
            <Badge label={String(round?.year || "")} color="#ffd93d" />
          </div>
        </Card>

        <Card className="fade-d2" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#ffffff55", fontWeight: 800, marginBottom: 8 }}>TA RÉPONSE</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Artiste ou titre du morceau…"
              disabled={submitted}
              style={{
                flex: 1, background: "#0f3460",
                border: `2px solid ${submitted ? "#6bcb77" : "#ffffff22"}`,
                borderRadius: 10, padding: "11px 14px",
                color: "#fff", fontSize: 14, fontWeight: 700,
              }}
            />
            <PrimaryBtn onClick={submit} disabled={submitted || !answer.trim()} color="#6bcb77" style={{ flexShrink: 0, padding: "10px 20px", fontSize: 16 }}>
              {submitted ? "✓" : "↵"}
            </PrimaryBtn>
          </div>
          {submitted && <div style={{ fontSize: 12, color: "#6bcb77", fontWeight: 700, marginTop: 8 }}>✓ Réponse envoyée !</div>}
        </Card>

        <Card className="fade-d3">
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, marginBottom: 10 }}>
            STATUT · {answeredCount}/{players.length} ont répondu
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {players.map(p => {
              const has = !!answers[p.id];
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "#0f3460", borderRadius: 50, padding: "6px 12px",
                }}>
                  <Avatar name={p.name} color={p.color} size={22} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ffffffaa" }}>{p.name}</span>
                  {has
                    ? <span style={{ fontSize: 12, color: "#6bcb77", fontWeight: 800 }}>✓</span>
                    : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff33", animation: "pulse 1.5s ease infinite" }} />
                  }
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}