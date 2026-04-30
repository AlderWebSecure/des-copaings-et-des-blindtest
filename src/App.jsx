import { useEffect, useState } from "react";
import "./styles/global.css";

import HomeScreen   from "./screens/HomeScreen";
import SourceScreen from "./screens/SourceScreen";
import CreateScreen from "./screens/CreateScreen";
import JoinScreen   from "./screens/JoinScreen";
import LobbyScreen  from "./screens/LobbyScreen";
import GameScreen   from "./screens/GameScreen";
import RevealScreen from "./screens/RevealScreen";
import ScoresScreen from "./screens/ScoresScreen";

import { useDeezer  } from "./hooks/useDeezer";
import { useSpotify } from "./hooks/useSpotify";
import { useRoom    } from "./hooks/useRoom";
import { usePlayer  } from "./hooks/usePlayer";
import { generatePlayerId, generatePlayerColor } from "./utils/roomCode";

export default function App() {
  // ─── Routing local ───────────────────────────────────────────
  const [screen,         setScreen]         = useState("home");   // local UI screen
  const [pendingConfig,  setPendingConfig]  = useState(null);
  const [pendingSource,  setPendingSource]  = useState(null);
  const [pendingJoinCode,setPendingJoinCode]= useState("");

  // ─── Identité joueur + room temps réel ───────────────────────
  const { player, setPlayer, clearPlayer } = usePlayer();
  const { room, code, error, loading,
          createRoom, joinRoom, leaveRoom,
          startGame, nextRound, revealRound, submitAnswer, restartGame } = useRoom();

  // ─── Sources musicales ───────────────────────────────────────
  const deezer  = useDeezer();
  const spotify = useSpotify();
  const source  = room?.meta?.source || pendingSource;
  const music   = source === "spotify" ? spotify : deezer;
  const isHost  = player && room?.meta?.hostId === player.id;

  // ─── Sync screen avec l'état de la room ──────────────────────
  useEffect(() => {
    if (!room) return;
    if (room.meta.status === "lobby")    setScreen("lobby");
    if (room.meta.status === "playing")  setScreen("game");
    if (room.meta.status === "reveal")   setScreen("reveal");
    if (room.meta.status === "finished") setScreen("scores");
  }, [room?.meta?.status]);

  // ─── Lecture audio quand un nouveau round commence (host only) ──
  useEffect(() => {
    if (!isHost || !room || room.meta.status !== "playing") return;
    const track = room.tracks[room.current.roundIndex];
    if (!track) return;
    music.play(`${track.artist} ${track.title}`);
  }, [room?.current?.roundIndex, room?.meta?.status, isHost]);

  // ─── Callback Spotify OAuth ──────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      spotify.handleCallback(codeParam).then(() => {
        setPendingSource("spotify");
        setScreen("create");
      });
    }
  }, []);

  // ─── HANDLERS ────────────────────────────────────────────────
  const handleSelectSource = (src) => {
    setPendingSource(src);
    setScreen("create");
  };

  const handleCreateRoom = async (config) => {
    // crée le joueur host
    const hostPlayer = setPlayer({
      id:     player?.id || generatePlayerId(),
      name:   config.hostName,
      color:  generatePlayerColor(),
      isHost: true,
    });
    const newCode = await createRoom(config, hostPlayer, pendingSource);
    if (newCode) setScreen("lobby");
  };

  const handleJoinRoom = async (roomCode, name) => {
    const p = setPlayer({
      id:     player?.id || generatePlayerId(),
      name,
      color:  "#888",     // sera réassigné par useRoom
      isHost: false,
    });
    const result = await joinRoom(roomCode, p);
    if (result) {
      // met à jour la couleur attribuée
      setPlayer({ ...p, color: result.color });
      setScreen("lobby");
    }
  };

  const handleLeave = async () => {
    music.stop();
    if (player) await leaveRoom(player.id);
    clearPlayer();
    setScreen("home");
  };

  const handleSubmitAnswer = async (answer, timeLeft) => {
    if (!player || !room) return;
    await submitAnswer(player.id, answer, timeLeft, room.config.timerSec);
  };

  const handleRoundTimeout = async () => {
    music.stop();
    if (isHost) await revealRound();
  };

  const handleNext = async () => {
    if (!isHost) return;
    music.stop();
    await nextRound(room.current.roundIndex, room.config.rounds);
  };

  const handleReveal = async () => {
    if (!isHost) return;
    music.stop();
    await revealRound();
  };

  const handleRestart = async () => {
    if (!isHost) return;
    await restartGame();
  };

  // ─── ROUTER ──────────────────────────────────────────────────
  if (screen === "home")
    return <HomeScreen
      onCreate={() => setScreen("source")}
      onJoin={(c) => { setPendingJoinCode(c || ""); setScreen("join"); }}
    />;

  if (screen === "source")
    return <SourceScreen
      onBack={() => setScreen("home")}
      spotifyConnected={spotify.connected}
      onSpotifyLogin={spotify.login}
      onSelect={handleSelectSource}
    />;

  if (screen === "create")
    return <CreateScreen
      onBack={() => setScreen("source")}
      onCreate={handleCreateRoom}
      loading={loading}
      error={error}
    />;

  if (screen === "join")
    return <JoinScreen
      code={pendingJoinCode}
      onBack={() => setScreen("home")}
      onJoin={handleJoinRoom}
      loading={loading}
      error={error}
    />;

  if (!room) return <HomeScreen onCreate={() => setScreen("source")} onJoin={(c) => { setPendingJoinCode(c || ""); setScreen("join"); }} />;

  // À partir d'ici, on a une vraie room synchronisée
  const players       = room.players ? Object.entries(room.players).map(([id, p]) => ({ id, ...p })) : [];
  const sortedPlayers = [...players].sort((a,b) => b.score - a.score);
  const totalRounds   = room.config.rounds;
  const currentIdx    = room.current.roundIndex;
  const currentTrack  = room.tracks[currentIdx];
  const myAnswer      = room.answers?.[currentIdx]?.[player.id];

  if (screen === "lobby")
    return <LobbyScreen
      roomCode={code}
      config={room.config}
      players={players}
      source={source}
      isHost={isHost}
      onStart={startGame}
      onLeave={handleLeave}
    />;

  if (screen === "game")
    return <GameScreen
      round={currentTrack}
      roundIndex={currentIdx}
      totalRounds={totalRounds}
      players={sortedPlayers}
      me={player}
      timerSec={room.config.timerSec}
      music={music}
      source={source}
      isHost={isHost}
      answers={room.answers?.[currentIdx] || {}}
      myAnswer={myAnswer}
      onSubmit={handleSubmitAnswer}
      onTimeout={handleRoundTimeout}
      onReveal={handleReveal}
    />;

  if (screen === "reveal")
    return <RevealScreen
      round={currentTrack}
      roundIndex={currentIdx}
      totalRounds={totalRounds}
      players={sortedPlayers}
      me={player}
      answers={room.answers?.[currentIdx] || {}}
      isHost={isHost}
      isLast={currentIdx >= totalRounds - 1}
      onNext={handleNext}
    />;

  if (screen === "scores")
    return <ScoresScreen
      players={sortedPlayers}
      totalRounds={totalRounds}
      isHost={isHost}
      onPlayAgain={handleRestart}
      onHome={handleLeave}
    />;
}