// src/hooks/useDeezer.js
// Une SEULE instance Audio partagée — évite tout overlap

import { useRef, useState, useCallback, useEffect } from "react";

export function useDeezer() {
  const audioRef    = useRef(null);
  const playPromise = useRef(null);
  const tokenRef    = useRef(0);    // anti race condition
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [track,   setTrack]   = useState(null);

  // Crée une instance unique au mount
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = 0.8;
    audio.preload = "auto";

    audio.addEventListener("ended",  () => setPlaying(false));
    audio.addEventListener("pause",  () => setPlaying(false));
    audio.addEventListener("play",   () => setPlaying(true));
    audio.addEventListener("error",  () => setError("Erreur de lecture"));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audio.load();
      audioRef.current = null;
    };
  }, []);

  // Coupe net : pause + reset src
  const safeStop = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (playPromise.current) await playPromise.current.catch(() => {});
    } catch {}
    a.pause();
    a.removeAttribute("src");
    a.load();          // force le navigateur à libérer le buffer
    setPlaying(false);
    playPromise.current = null;
  }, []);

  // Joue une nouvelle URL (réutilise l'audio existant)
  const playUrl = async (url, trackData, token) => {
    const a = audioRef.current;
    if (!a) return;

    // Si entre-temps un autre play a été lancé, on abandonne
    if (token !== tokenRef.current) return;

    a.pause();
    a.src = url;
    a.load();

    if (token !== tokenRef.current) return;

    setTrack(trackData);
    try {
      playPromise.current = a.play();
      await playPromise.current;
      playPromise.current = null;
    } catch (err) {
      if (err.name === "AbortError") return;
      throw err;
    }
  };

  const playTrack = useCallback(async (trackData) => {
    const myToken = ++tokenRef.current;
    setLoading(true); setError(null);

    try {
      if (!trackData?.preview) throw new Error("Pas d'extrait disponible");
      await safeStop();
      if (myToken !== tokenRef.current) return;
      await playUrl(trackData.preview, trackData, myToken);
    } catch (err) {
      if (err.name === "AbortError") return;
      // Fallback : recherche fraîche si l'URL preview est expirée
      try {
        const r = await fetch(`/api/deezer?q=${encodeURIComponent(trackData.artist + " " + trackData.title)}`);
        const fresh = await r.json();
        if (fresh.preview && myToken === tokenRef.current) {
          await playUrl(fresh.preview, { ...trackData, preview: fresh.preview }, myToken);
          return;
        }
      } catch {}
      setError("Extrait indisponible — clique ▶ pour relancer");
      console.error("Deezer playback error:", err);
    } finally {
      setLoading(false);
    }
  }, [safeStop]);

  const play = useCallback(async (query) => {
    const myToken = ++tokenRef.current;
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/deezer?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      if (myToken !== tokenRef.current) return;
      await safeStop();
      await playUrl(data.preview, data, myToken);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [safeStop]);

  const pause = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playPromise.current) await playPromise.current.catch(() => {});
    a.pause();
  }, []);

  const resume = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.src) return;
    playPromise.current = a.play();
    playPromise.current.catch(() => {});
  }, []);

  const stop = useCallback(async () => {
    tokenRef.current++;     // invalide tout play en cours
    await safeStop();
    setTrack(null);
    setError(null);
  }, [safeStop]);

  const setVolume = useCallback((v) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  return { play, playTrack, pause, resume, stop, setVolume, playing, loading, error, track };
}