import { useState, useEffect, useRef } from "react";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import Avatar     from "../components/Avatar";
import Waveform   from "../components/Waveform";
import TimerRing  from "../components/TimerRing";
import Steps      from "../components/Steps";
import PrimaryBtn from "../components/PrimaryBtn";

export default function GameScreen({ round, roundIndex, totalRounds, players, timerSec, music, source, onSubmit, onTimeout }) {
  const [timer,     setTimer]     = useState(timerSec);
  const [answer,    setAnswer]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimer(timerSec);
    setAnswer("");
    setSubmitted(false);

    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          onTimeout();
          return 0;
        }
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

  const togglePlay = () => {
    if (music.playing) music.pause();
    else music.resume();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "28px 20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* TOP BAR */}
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
            <div style={{ fontSize: 22, fontWeight: 900, color: "#ffd93d" }}>{players[0].score}</div>
          </div>
        </div>

        <div className="fade" style={{ marginBottom: 18 }}>
          <Steps current={roundIndex} total={totalRounds} />
        </div>

        {/* AUDIO PLAYER */}
        <Card className="fade-d1" style={{
          textAlign: "center", padding: "28px", marginBottom: 12,
          background: "linear-gradient(135deg, #16213e, #0f3460)",
          border: "2px solid #e9456033",
        }}>
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            {source === "spotify" ? "♫ via Spotify" : "🎵 via Deezer (extrait 30s)"}
          </div>

          {music.loading && (
            <div style={{ color: "#ffffffaa", fontSize: 13, marginBottom: 12 }}>Chargement de la piste…</div>
          )}

          {music.error && (
            <div style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              ⚠ {music.error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Waveform active={music.playing && !submitted} />
          </div>

          <button onClick={togglePlay} disabled={!music.track && !music.playing} style={{
            padding: "10px 24px", borderRadius: 50, fontSize: 14, fontWeight: 800,
            background: "#ffffff15", color: "#ffffffaa", border: "none", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
          }}>
            {music.playing ? "⏸ Pause" : "▶ Lecture"}
          </button>
        </Card>

        {/* HINT */}
        <Card className="fade-d1" style={{ marginBottom: 12, padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22 }}>{round.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800 }}>Indice</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{round.genre}</div>
            </div>
            <Badge label={String(round.year)} color="#ffd93d" />
          </div>
        </Card>

        {/* ANSWER INPUT */}
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
                fontFamily: "'Nunito', sans-serif", transition: "border-color .2s",
              }}
            />
            <PrimaryBtn onClick={submit} disabled={submitted || !answer.trim()} style={{ flexShrink: 0, padding: "10px 20px", fontSize: 16 }}>
              {submitted ? "✓" : "↵"}
            </PrimaryBtn>
          </div>
          {submitted && <div style={{ fontSize: 12, color: "#6bcb77", fontWeight: 700, marginTop: 8 }}>✓ Réponse envoyée !</div>}
        </Card>

        {/* OTHER PLAYERS */}
        <Card className="fade-d3">
          <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 800, marginBottom: 10 }}>STATUT DES JOUEURS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {players.slice(1).map((p, i) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#0f3460", borderRadius: 50, padding: "6px 12px",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < 2 ? "#6bcb77" : "#ffffff33",
                  animation: i < 2 ? "pulse 1.5s ease infinite" : "none",
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#ffffffaa" }}>{p.name}</span>
                {i < 2 && <span style={{ fontSize: 11, color: "#6bcb77", fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}