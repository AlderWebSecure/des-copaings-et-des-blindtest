// src/hooks/usePlayer.js
// Identité du joueur local (persistée en sessionStorage)

import { useState, useCallback } from "react";
import { generatePlayerId } from "../utils/roomCode";

export function usePlayer() {
  const [player, setPlayerState] = useState(() => {
    const stored = sessionStorage.getItem("blinddrop_player");
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const setPlayer = useCallback((data) => {
    const newPlayer = {
      id: data.id || generatePlayerId(),
      name: data.name,
      color: data.color,
      isHost: data.isHost || false,
    };
    sessionStorage.setItem("blinddrop_player", JSON.stringify(newPlayer));
    setPlayerState(newPlayer);
    return newPlayer;
  }, []);

  const clearPlayer = useCallback(() => {
    sessionStorage.removeItem("blinddrop_player");
    setPlayerState(null);
  }, []);

  return { player, setPlayer, clearPlayer };
}