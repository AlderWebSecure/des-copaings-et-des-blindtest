// src/hooks/useDeezer.js
// Gère la recherche + lecture des extraits Deezer (30s)
// Utilise notre proxy /api/deezer pour éviter le CORS

import { useRef, useState, useCallback } from "react";

export function useDeezer() {
  const audioRef  = useRef(null);
  const [playing, setPlaying]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const [track,   setTrack]     = useState(null); // { title, artist, preview, cover }

  // Cherche une piste via notre proxy et lance la lecture
  const play = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(`/api/deezer?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Stop l'audio précédent
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(data.preview);
      audio.volume = 0.8;
      audioRef.current = audio;
      setTrack(data);

      audio.onended  = () => setPlaying(false);
      audio.onerror  = () => { setError("Erreur de lecture audio"); setPlaying(false); };
      audio.onpause  = () => setPlaying(false);
      audio.onplay   = () => setPlaying(true);

      await audio.play();
      setPlaying(true);

    } catch (err) {
      setError(err.message || "Erreur Deezer");
    } finally {
      setLoading(false);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlaying(false);
    setTrack(null);
  }, []);

  // Retourne le volume courant (0-1)
  const setVolume = useCallback((v) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  return { play, pause, resume, stop, setVolume, playing, loading, error, track };
}