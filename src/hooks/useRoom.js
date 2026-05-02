// src/hooks/useRoom.js
// Sync temps réel d'une room Firebase + pioche dynamique Deezer

import { useState, useEffect, useCallback } from "react";
import {
  ref, set, get, update, remove, onValue, onDisconnect,
} from "firebase/database";
import { db } from "../lib/firebase";
import { generateRoomCode, generatePlayerColor } from "../utils/roomCode";
import { pickDeezerTracks } from "../utils/pickDeezerTracks";
import { scoreAnswer } from "../utils/scoring";

export function useRoom() {
  const [room,    setRoom]    = useState(null);
  const [code,    setCode]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  // ── ÉCOUTE TEMPS RÉEL ──────────────────────────────
  useEffect(() => {
    if (!code) return;
    const roomRef = ref(db, `rooms/${code}`);
    const unsub = onValue(roomRef, (snap) => {
      const data = snap.val();
      if (!data) { setRoom(null); setError("Room introuvable"); return; }
      setRoom(data);
    }, (err) => setError(err.message));
    return () => unsub();
  }, [code]);

  // ── CRÉER UNE ROOM (host) ──────────────────────────
  const createRoom = useCallback(async (config, hostPlayer, source) => {
    setLoading(true); setError(null);
    try {
      // Génère un code unique
      let newCode, exists = true, attempts = 0;
      while (exists && attempts < 10) {
        newCode = generateRoomCode();
        const snap = await get(ref(db, `rooms/${newCode}/meta`));
        exists = snap.exists();
        attempts++;
      }
      if (exists) throw new Error("Impossible de générer un code unique");

      // Pioche les titres dynamiquement depuis Deezer
      const tracks = await pickDeezerTracks(config.genres, config.decades, config.rounds);
      if (!tracks || tracks.length === 0) {
        throw new Error("Aucun titre trouvé pour ces filtres. Essaie d'autres genres/époques.");
      }

      const roomData = {
        meta: {
          hostId:    hostPlayer.id,
          createdAt: Date.now(),
          source,
          status:    "lobby",
        },
        config,
        tracks,
        current: { roundIndex: 0, startedAt: null, revealAt: null },
        players: {
          [hostPlayer.id]: {
            name:     hostPlayer.name,
            color:    hostPlayer.color,
            score:    0,
            isHost:   true,
            joinedAt: Date.now(),
          },
        },
      };

      await set(ref(db, `rooms/${newCode}`), roomData);

      // Auto-leave si déconnexion
      onDisconnect(ref(db, `rooms/${newCode}/players/${hostPlayer.id}`)).remove();

      setCode(newCode);
      return newCode;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── REJOINDRE UNE ROOM ─────────────────────────────
  const joinRoom = useCallback(async (roomCode, player) => {
    setLoading(true); setError(null);
    try {
      const upper = roomCode.toUpperCase();
      const snap  = await get(ref(db, `rooms/${upper}`));
      if (!snap.exists()) throw new Error("Room introuvable");
      const data = snap.val();
      if (data.meta.status === "finished") throw new Error("Cette partie est terminée");

      // Vérifie que le pseudo est unique
      const existingNames = Object.values(data.players || {}).map(p => p.name.toLowerCase());
      if (existingNames.includes(player.name.toLowerCase())) {
        throw new Error("Ce pseudo est déjà pris dans la room");
      }

      // Couleur unique
      const existingColors = Object.values(data.players || {}).map(p => p.color);
      const color = generatePlayerColor(existingColors);

      const playerData = {
        name:     player.name,
        color,
        score:    0,
        isHost:   false,
        joinedAt: Date.now(),
      };

      await set(ref(db, `rooms/${upper}/players/${player.id}`), playerData);
      onDisconnect(ref(db, `rooms/${upper}/players/${player.id}`)).remove();

      setCode(upper);
      return { code: upper, color };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── QUITTER LA ROOM ────────────────────────────────
  const leaveRoom = useCallback(async (playerId) => {
    if (!code) return;
    try {
      await remove(ref(db, `rooms/${code}/players/${playerId}`));
      const snap = await get(ref(db, `rooms/${code}/players`));
      if (!snap.exists() || Object.keys(snap.val()).length === 0) {
        await remove(ref(db, `rooms/${code}`));
      }
    } catch (e) { /* ignore */ }
    setCode(null);
    setRoom(null);
  }, [code]);

  // ── HOST : LANCER LA PARTIE ────────────────────────
  const startGame = useCallback(async () => {
    if (!code) return;
    await update(ref(db, `rooms/${code}/meta`), { status: "playing" });
    await update(ref(db, `rooms/${code}/current`), {
      roundIndex: 0,
      startedAt:  Date.now(),
      revealAt:   null,
    });
  }, [code]);

  // ── HOST : MANCHE SUIVANTE ─────────────────────────
  const nextRound = useCallback(async (currentIdx, totalRounds) => {
    if (!code) return;
    const next = currentIdx + 1;
    if (next >= totalRounds) {
      await update(ref(db, `rooms/${code}/meta`), { status: "finished" });
    } else {
      await update(ref(db, `rooms/${code}/meta`), { status: "playing" });
      await update(ref(db, `rooms/${code}/current`), {
        roundIndex: next,
        startedAt:  Date.now(),
        revealAt:   null,
      });
    }
  }, [code]);

  // ── HOST : RÉVÉLER LA RÉPONSE ──────────────────────
  const revealRound = useCallback(async () => {
    if (!code) return;
    await update(ref(db, `rooms/${code}/meta`), { status: "reveal" });
    await update(ref(db, `rooms/${code}/current`), { revealAt: Date.now() });
  }, [code]);

  // ── JOUEUR : SOUMETTRE UNE RÉPONSE ─────────────────
  const submitAnswer = useCallback(async (playerId, answer, timeLeft, totalTime) => {
    if (!code || !room) return 0;
    const idx   = room.current.roundIndex;
    const track = room.tracks[idx];
    const pts   = scoreAnswer(answer, track);
    const bonus = pts > 0 ? Math.round((timeLeft / totalTime) * 20) : 0;
    const total = pts + bonus;

    await set(ref(db, `rooms/${code}/answers/${idx}/${playerId}`), {
      answer,
      points: total,
      submittedAt: Date.now(),
    });

    // Met à jour le score cumulé
    const playerRef = ref(db, `rooms/${code}/players/${playerId}/score`);
    const snap      = await get(playerRef);
    await set(playerRef, (snap.val() || 0) + total);

    return total;
  }, [code, room]);

  // ── HOST : RESET POUR REJOUER ──────────────────────
  const restartGame = useCallback(async () => {
    if (!code || !room) return;
    setLoading(true); setError(null);
    try {
      const newTracks = await pickDeezerTracks(
        room.config.genres,
        room.config.decades,
        room.config.rounds
      );
      if (!newTracks || newTracks.length === 0) {
        throw new Error("Aucun titre trouvé. Change les filtres.");
      }

      const resetPlayers = {};
      Object.entries(room.players).forEach(([pid, p]) => {
        resetPlayers[pid] = { ...p, score: 0 };
      });

      await update(ref(db, `rooms/${code}`), {
        meta:    { ...room.meta, status: "lobby" },
        tracks:  newTracks,
        current: { roundIndex: 0, startedAt: null, revealAt: null },
        players: resetPlayers,
        answers: null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [code, room]);

  return {
    room, code, error, loading,
    createRoom, joinRoom, leaveRoom,
    startGame, nextRound, revealRound, submitAnswer, restartGame,
  };
}