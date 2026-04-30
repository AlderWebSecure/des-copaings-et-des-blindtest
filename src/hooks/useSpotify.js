// src/hooks/useSpotify.js
// Intègre le Spotify Web Playback SDK
// Gère : OAuth login, SDK init, play/pause/search

import { useRef, useState, useEffect, useCallback } from "react";

const CLIENT_ID    = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
].join(" ");

// Charge le SDK Spotify dans le DOM (une seule fois)
function loadSpotifySDK() {
  return new Promise((resolve) => {
    if (window.Spotify) return resolve();
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = resolve;
  });
}

export function useSpotify() {
  const playerRef   = useRef(null);
  const deviceIdRef = useRef(null);

  const [accessToken,  setAccessToken]  = useState(() => sessionStorage.getItem("sp_token") || null);
  const [refreshToken, setRefreshToken] = useState(() => sessionStorage.getItem("sp_refresh") || null);
  const [ready,    setReady]    = useState(false);
  const [playing,  setPlaying]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [track,    setTrack]    = useState(null);

  // ── 1. OAUTH LOGIN ──────────────────────────────────────────────
  const login = useCallback(() => {
    const params = new URLSearchParams({
      client_id:     CLIENT_ID,
      response_type: "code",
      redirect_uri:  REDIRECT_URI,
      scope:         SCOPES,
      show_dialog:   "true",
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }, []);

  // ── 2. ÉCHANGE DU CODE (appelé depuis App.jsx après redirect) ───
  const handleCallback = useCallback(async (code) => {
    try {
      const res  = await fetch("/api/spotify-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      sessionStorage.setItem("sp_token",   data.access_token);
      sessionStorage.setItem("sp_refresh", data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      // Nettoie l'URL
      window.history.replaceState({}, "", "/");
    } catch (err) {
      setError("Connexion Spotify échouée : " + err.message);
    }
  }, []);

  // ── 3. REFRESH TOKEN ────────────────────────────────────────────
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return null;
    try {
      const res  = await fetch("/api/spotify-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ grant_type: "refresh_token", refresh_token: refreshToken }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      sessionStorage.setItem("sp_token", data.access_token);
      setAccessToken(data.access_token);
      return data.access_token;
    } catch {
      return null;
    }
  }, [refreshToken]);

  // ── 4. INIT SDK ─────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;

    let player;
    loadSpotifySDK().then(() => {
      player = new window.Spotify.Player({
        name:       "Blinddrop Host",
        volume:     0.8,
        getOAuthToken: async (cb) => {
          const token = await refreshAccessToken() || accessToken;
          cb(token);
        },
      });

      player.addListener("ready", ({ device_id }) => {
        deviceIdRef.current = device_id;
        setReady(true);
      });

      player.addListener("not_ready", () => setReady(false));

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        setPlaying(!state.paused);
        const item = state.track_window?.current_track;
        if (item) setTrack({ title: item.name, artist: item.artists[0]?.name, cover: item.album?.images[0]?.url });
      });

      player.addListener("initialization_error", ({ message }) => setError(message));
      player.addListener("authentication_error",  ({ message }) => setError(message));
      player.addListener("account_error",         ({ message }) => setError("Compte Spotify Premium requis"));

      player.connect();
      playerRef.current = player;
    });

    return () => { player?.disconnect(); };
  }, [accessToken]);

  // ── 5. RECHERCHE + LECTURE ──────────────────────────────────────
  const play = useCallback(async (query) => {
    if (!accessToken || !deviceIdRef.current) return;
    setLoading(true); setError(null);

    try {
      // Recherche la piste sur Spotify
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const searchData = await searchRes.json();
      const uri = searchData.tracks?.items?.[0]?.uri;
      if (!uri) throw new Error("Piste non trouvée sur Spotify");

      // Lance la lecture sur le device du SDK
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ uris: [uri] }),
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const pause  = useCallback(() => playerRef.current?.pause(),  []);
  const resume = useCallback(() => playerRef.current?.resume(), []);
  const stop   = useCallback(() => { playerRef.current?.pause(); setTrack(null); }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("sp_token");
    sessionStorage.removeItem("sp_refresh");
    setAccessToken(null);
    playerRef.current?.disconnect();
    setReady(false);
  }, []);

  return {
    login, logout, handleCallback,
    play, pause, resume, stop,
    playing, loading, error, track,
    ready, connected: !!accessToken,
  };
}