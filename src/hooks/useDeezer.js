// src/hooks/useDeezer.js
// Joue un extrait Deezer 30s — gère proprement les race conditions play/pause

import { useRef, useState, useCallback } from "react";

export function useDeezer() {
  const audioRef    = useRef(null);
  const playPromise = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [track,   setTrack]   = useState(null);

  // Stop propre — attend que le play() en cours finisse avant de pause()
  const safeStop = async () => {
    if (audioRef.current) {
      try {
        if (playPromise.current) {
          await playPromise.current.catch(() => {});
        }
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      } catch {}
      audioRef.current = null;
      playPromise.current = null;
    }
  };

  const playTrack = useCallback(async (trackData) => {
    setLoading(true); setError(null);

    try {
      if (!trackData?.preview) throw new Error("Pas d'extrait disponible pour cette piste");

      await safeStop();

      const audio = new Audio(trackData.preview);
      audio.volume = 0.8;
      audioRef.current = audio;
      setTrack(trackData);

      audio.onended = () => setPlaying(false);
      audio.onerror = () => { setError("Erreur de lecture"); setPlaying(false); };
      audio.onpause = () => setPlaying(false);
      audio.onplay  = () => setPlaying(true);

      // Garde la promesse pour l'attendre avant un futur pause/stop
      playPromise.current = audio.play();
      await playPromise.current;
      playPromise.current = null;
      setPlaying(true);
    } catch (err) {
      // AbortError = on a stop avant que play termine, ignore-le
      if (err.name === "AbortError") return;
      setError(err.message || "Erreur Deezer");
    } finally {
      setLoading(false);
    }
  }, []);

  const play = useCallback(async (query) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/deezer?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      await playTrack(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playTrack]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    if (playPromise.current) {
      await playPromise.current.catch(() => {});
    }
    audioRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    if (!audioRef.current) return;
    playPromise.current = audioRef.current.play();
    playPromise.current.catch(() => {});
  }, []);

  const stop = useCallback(async () => {
    await safeStop();
    setPlaying(false);
    setTrack(null);
  }, []);

  const setVolume = useCallback((v) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  return { play, playTrack, pause, resume, stop, setVolume, playing, loading, error, track };
}