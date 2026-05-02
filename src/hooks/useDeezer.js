// src/hooks/useDeezer.js
// Lecture extraits Deezer 30s avec gestion robuste des erreurs

import { useRef, useState, useCallback } from "react";

export function useDeezer() {
  const audioRef    = useRef(null);
  const playPromise = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [track,   setTrack]   = useState(null);

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

  // Joue une URL audio en gérant les erreurs
  const playUrl = async (url, trackData) => {
    await safeStop();

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";  // important pour Deezer
      audio.volume = 0.8;
      audio.preload = "auto";

      const cleanup = () => {
        audio.onerror = null;
        audio.oncanplay = null;
      };

      audio.onerror = (e) => {
        cleanup();
        reject(new Error("Audio error: " + (audio.error?.message || "unknown")));
      };

      audio.oncanplay = async () => {
        cleanup();
        audioRef.current = audio;
        setTrack(trackData);

        audio.onended = () => setPlaying(false);
        audio.onpause = () => setPlaying(false);
        audio.onplay  = () => setPlaying(true);

        try {
          playPromise.current = audio.play();
          await playPromise.current;
          playPromise.current = null;
          setPlaying(true);
          resolve();
        } catch (err) {
          if (err.name === "AbortError") return resolve();
          reject(err);
        }
      };

      audio.src = url;
      audio.load();
    });
  };

  // Joue une track depuis ses données pré-chargées
  const playTrack = useCallback(async (trackData) => {
    setLoading(true); setError(null);
    try {
      if (!trackData?.preview) throw new Error("Pas d'extrait disponible");

      try {
        await playUrl(trackData.preview, trackData);
      } catch (err) {
        // Fallback : retente une recherche fraîche si l'URL preview a expiré
        console.warn("Preview URL failed, retrying search:", err);
        const r = await fetch(`/api/deezer?q=${encodeURIComponent(trackData.artist + " " + trackData.title)}`);
        const fresh = await r.json();
        if (fresh.error || !fresh.preview) throw new Error("Extrait indisponible");
        await playUrl(fresh.preview, { ...trackData, preview: fresh.preview });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Erreur Deezer");
        console.error("Deezer playback error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche libre + lecture
  const play = useCallback(async (query) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/deezer?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      await playTrack(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playTrack]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    if (playPromise.current) await playPromise.current.catch(() => {});
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