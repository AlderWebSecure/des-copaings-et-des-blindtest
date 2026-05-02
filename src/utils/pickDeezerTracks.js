// src/utils/pickDeezerTracks.js
// Pioche N tracks aléatoires depuis Deezer selon les genres/décennies choisis

import { DEEZER_GENRES, DECADE_RANGES } from "../constants/deezerGenres";

const GENRE_EMOJI = {
  "Pop": "🎵", "Hip-Hop": "🎤", "Rock": "🎸", "R&B": "🎵",
  "Électro": "🎹", "Jazz": "🎷", "Classique": "🎼", "Reggaeton": "🥁",
  "K-Pop": "💜", "Metal": "🤘", "Soul": "🎙️", "Variété FR": "🇫🇷",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function decadeFromYear(year) {
  if (!year) return null;
  if (year < 1970) return "60s";
  if (year < 1980) return "70s";
  if (year < 1990) return "80s";
  if (year < 2000) return "90s";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "2020s";
}

/**
 * Pioche `count` tracks dans Deezer selon les filtres
 * @param {string[]} genres   ex: ["Pop", "Hip-Hop"]
 * @param {string[]} decades  ex: ["2010s", "2020s"]
 * @param {number}   count    ex: 10
 * @returns {Promise<Track[]>}
 */
export async function pickDeezerTracks(genres, decades, count) {
  const allTracks = [];

  // Calcule la plage d'années couverte par les décennies sélectionnées
  const ranges  = decades.map(d => DECADE_RANGES[d]).filter(Boolean);
  const yearMin = ranges.length ? Math.min(...ranges.map(r => r[0])) : null;
  const yearMax = ranges.length ? Math.max(...ranges.map(r => r[1])) : null;

  // Récupère 50 tracks par genre depuis le chart Deezer (avec preview ET année)
  for (const genreName of genres) {
    const genreId = DEEZER_GENRES[genreName];
    if (!genreId) continue;

    try {
      // On demande une bonne quantité pour avoir le choix après filtre
      const url = yearMin && yearMax
        ? `/api/deezer?genre=${genreId}&limit=50&year_min=${yearMin}&year_max=${yearMax}`
        : `/api/deezer?genre=${genreId}&limit=50`;

      const r = await fetch(url);
      if (!r.ok) continue;
      const data = await r.json();
      if (!data.tracks) continue;

      // On marque chaque track avec son genre source
      const tagged = data.tracks
        .filter(t => t.preview)
        .map(t => ({ ...t, _genre: genreName }));

      allTracks.push(...tagged);
    } catch (err) {
      console.warn(`Erreur récupération genre ${genreName}:`, err);
    }
  }

  if (allTracks.length === 0) {
    throw new Error("Aucun titre trouvé pour ces filtres. Essaie d'autres genres/époques.");
  }

  // Déduplique par ID
  const seen = new Set();
  const unique = allTracks.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  // Mélange et prend les N premiers
  const picked = shuffle(unique).slice(0, count);

  // Format final
  return picked.map((t, i) => ({
    id:      i,
    deezerId: t.id,
    title:   t.title,
    artist:  t.artist,
    preview: t.preview,
    cover:   t.cover,
    year:    t.year || null,
    genre:   t._genre,
    decade:  decadeFromYear(t.year),
    emoji:   GENRE_EMOJI[t._genre] || "🎶",
  }));
}