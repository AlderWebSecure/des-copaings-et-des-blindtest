import { useState, useEffect } from "react";
import "./styles/global.css";

import HomeScreen   from "./screens/HomeScreen";
import SourceScreen from "./screens/SourceScreen";
import CreateScreen from "./screens/CreateScreen";
import JoinScreen   from "./screens/JoinScreen";
import LobbyScreen  from "./screens/LobbyScreen";
import GameScreen   from "./screens/GameScreen";
import RevealScreen from "./screens/RevealScreen";
import ScoresScreen from "./screens/ScoresScreen";

import { useSpotify } from "./hooks/useSpotify";
import { useDeezer  } from "./hooks/useDeezer";

import { MOCK_PLAYERS, MOCK_ROUNDS } from "./constants/mockData";
import { scoreAnswer }               from "./utils/scoring";

export default function App() {
  const [screen,      setScreen]      = useState("home");
  const [config,      setConfig]      = useState(null);
  const [source,      setSource]      = useState(null); // "spotify" | "deezer"
  const [players,     setPlayers]     = useState(MOCK_PLAYERS);
  const [roundIdx,    setRoundIdx]    = useState(0);
  const [myAnswer,    setMyAnswer]    = useState("");
  const [roundDeltas, setRoundDeltas] = useState([0, 0, 0, 0]);

  const spotify = useSpotify();
  const deezer  = useDeezer();

  // Détermine le hook actif selon la source choisie
  const music = source === "spotify" ? spotify : deezer;

  // ── Gestion du callback OAuth Spotify ──────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("code");
    if (code) {
      spotify.handleCallback(code).then(() => {
        setSource("spotify");
        setScreen("create");
      });
    }
  }, []);

  const currentRound = MOCK_ROUNDS[roundIdx % MOCK_ROUNDS.length];
  const totalRounds  = config?.rounds  ?? 10;
  const timerSec     = config?.timerSec ?? 25;

  const resetGame = (cfg) => {
    setConfig(cfg);
    setPlayers(MOCK_PLAYERS.map(p => ({ ...p, score: 0 })));
    setRoundIdx(0); setMyAnswer(""); setRoundDeltas([0, 0, 0, 0]);
  };

  // ── Lance la lecture du round courant ──────────────────────────
  const playCurrentRound = (round) => {
    const query = `${round.artist} ${round.title}`;
    music.play(query);
  };

  const handleSubmit = (answer, timeLeft) => {
    music.stop();
    const pts        = scoreAnswer(answer, currentRound);
    const speedBonus = pts > 0 ? Math.round((timeLeft / timerSec) * 20) : 0;
    const total      = pts + speedBonus;
    const deltas     = [total, Math.floor(Math.random() * 60 + 20), Math.floor(Math.random() * 30), 0];
    setMyAnswer(answer); setRoundDeltas(deltas);
    setPlayers(prev => prev.map((p, i) => ({ ...p, score: p.score + deltas[i] })));
    setScreen("reveal");
  };

  const handleTimeout = () => {
    music.stop();
    const deltas = [0, Math.floor(Math.random() * 60), Math.floor(Math.random() * 40), 0];
    setMyAnswer(""); setRoundDeltas(deltas);
    setPlayers(prev => prev.map((p, i) => ({ ...p, score: p.score + deltas[i] })));
    setScreen("reveal");
  };

  const handleNext = () => {
    const next = roundIdx + 1;
    if (next >= totalRounds) { setScreen("scores"); return; }
    setRoundIdx(next); setMyAnswer(""); setScreen("game");
  };

  const def = { genres: ["Pop", "Hip-Hop"], decades: ["2010s"], rounds: 10, timerSec: 25, hostName: "Orel" };

  // ── ROUTER ─────────────────────────────────────────────────────
  if (screen === "home")
    return <HomeScreen onCreate={() => setScreen("source")} onJoin={() => setScreen("join")} />;

  if (screen === "source")
    return (
      <SourceScreen
        onBack={() => setScreen("home")}
        spotifyConnected={spotify.connected}
        onSpotifyLogin={spotify.login}
        onSelect={(src) => { setSource(src); setScreen("create"); }}
      />
    );

  if (screen === "create")
    return <CreateScreen onBack={() => setScreen("source")} onCreate={cfg => { resetGame(cfg); setScreen("lobby"); }} />;

  if (screen === "join")
    return <JoinScreen code="" onBack={() => setScreen("home")} onJoin={() => { resetGame(def); setScreen("lobby"); }} />;

  if (screen === "lobby")
    return <LobbyScreen config={config || def} players={players} source={source} onStart={() => { playCurrentRound(currentRound); setScreen("game"); }} onLeave={() => setScreen("home")} />;

  if (screen === "game")
    return (
      <GameScreen
        round={currentRound} roundIndex={roundIdx} totalRounds={totalRounds}
        players={players} timerSec={timerSec}
        music={music} source={source}
        onSubmit={handleSubmit} onTimeout={handleTimeout}
      />
    );

  if (screen === "reveal")
    return (
      <RevealScreen
        round={currentRound} roundIndex={roundIdx} totalRounds={totalRounds}
        players={players} myAnswer={myAnswer} roundDeltas={roundDeltas}
        onNext={() => { handleNext(); if (screen !== "scores") playCurrentRound(MOCK_ROUNDS[(roundIdx + 1) % MOCK_ROUNDS.length]); }}
        onFinish={() => setScreen("scores")}
      />
    );

  if (screen === "scores")
    return <ScoresScreen players={players} totalRounds={totalRounds} onPlayAgain={() => { resetGame(config); setScreen("lobby"); }} onHome={() => setScreen("home")} />;
}