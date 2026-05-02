// src/utils/pickDeezerTracks.js
// Pioche N tracks aléatoires depuis Deezer selon les genres/décennies choisis
// Stratégie : tente plusieurs fallbacks plutôt que d'échouer

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

async function fetchGenrePool(genreName, genreId, yearMin, yearMax) {
  // Tentative 1 : avec filtre années
  try {
    const url1 = yearMin && yearMax
      ? `/api/deezer?genre=${genreId}&limit=50&year_min=${yearMin}&year_max=${yearMax}`
      : `/api/deezer?genre=${genreId}&limit=50`;
    const r1 = await fetch(url1);
    if (r1.ok) {
      const d1 = await r1.json();
      if (d1.tracks?.length > 0) return d1.tracks.map(t => ({ ...t, _genre: genreName }));
    }
  } catch (e) { console.warn(`Genre ${genreName} attempt 1 failed:`, e); }

  // Tentative 2 : sans filtre années
  try {
    const r2 = await fetch(`/api/deezer?genre=${genreId}&limit=50`);
    if (r2.ok) {
      const d2 = await r2.json();
      if (d2.tracks?.length > 0) return d2.tracks.map(t => ({ ...t, _genre: genreName }));
    }
  } catch (e) { console.warn(`Genre ${genreName} attempt 2 failed:`, e); }

  // Tentative 3 : recherche libre par mot-clé du genre
  try {
    const r3 = await fetch(`/api/deezer?suggest=${encodeURIComponent(genreName)}&limit=20`);
    if (r3.ok) {
      const d3 = await r3.json();
      if (d3.suggestions?.length > 0) {
        return d3.suggestions.map(s => ({
          id:      s.id,
          title:   s.title,
          artist:  s.artist,
          cover:   s.cover,
          preview: null,
          year:    null,
          _genre:  genreName,
        }));
      }
    }
  } catch (e) { console.warn(`Genre ${genreName} fallback failed:`, e); }

  return [];
}

export async function pickDeezerTracks(genres, decades, count) {
  // Plage d'années
  const ranges  = decades.map(d => DECADE_RANGES[d]).filter(Boolean);
  const yearMin = ranges.length ? Math.min(...ranges.map(r => r[0])) : null;
  const yearMax = ranges.length ? Math.max(...ranges.map(r => r[1])) : null;

  // Récupère les pools de chaque genre en parallèle
  const pools = await Promise.all(
    genres.map(g => {
      const id = DEEZER_GENRES[g];
      if (!id) return Promise.resolve([]);
      return fetchGenrePool(g, id, yearMin, yearMax);
    })
  );

  let allTracks = pools.flat().filter(t => t.preview);

  // Déduplique
  const seen = new Set();
  allTracks = allTracks.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  if (allTracks.length === 0) {
    throw new Error("Aucun titre avec extrait audio trouvé. Essaie d'autres genres.");
  }

  // Si pas assez après filtre, on duplique pour compléter
  let picked = shuffle(allTracks).slice(0, count);
  while (picked.length < count && picked.length > 0) {
    picked = [...picked, ...shuffle(allTracks).slice(0, count - picked.length)];
  }

  return picked.slice(0, count).map((t, i) => ({
    id:       i,
    deezerId: t.id,
    title:    t.title,
    artist:   t.artist,
    preview:  t.preview,
    cover:    t.cover,
    year:     t.year || null,
    genre:    t._genre,
    decade:   decadeFromYear(t.year),
    emoji:    GENRE_EMOJI[t._genre] || "🎶",
  }));
}