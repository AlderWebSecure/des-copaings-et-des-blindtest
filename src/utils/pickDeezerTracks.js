// src/utils/pickDeezerTracks.js
// Pioche stricte par genre (validation côté API)

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

async function fetchGenrePool(genreName, cfg, yearMin, yearMax) {
  try {
    const params = new URLSearchParams({
      genre: cfg.id,
      limit: "80",
      strict: cfg.strict ? "true" : "false",
    });
    if (yearMin) params.set("year_min", yearMin);
    if (yearMax) params.set("year_max", yearMax);

    const r = await fetch(`/api/deezer?${params}`);
    if (!r.ok) return [];
    const data = await r.json();
    if (!data.tracks) return [];

    return data.tracks
      .filter(t => t.preview)
      .map(t => ({ ...t, _genre: genreName }));
  } catch (e) {
    console.warn(`Pool ${genreName} failed:`, e);
    return [];
  }
}

export async function pickDeezerTracks(genres, decades, count) {
  const ranges  = decades.map(d => DECADE_RANGES[d]).filter(Boolean);
  const yearMin = ranges.length ? Math.min(...ranges.map(r => r[0])) : null;
  const yearMax = ranges.length ? Math.max(...ranges.map(r => r[1])) : null;

  const pools = await Promise.all(
    genres.map(async (g) => {
      const cfg = DEEZER_GENRES[g];
      if (!cfg) return [];
      return fetchGenrePool(g, cfg, yearMin, yearMax);
    })
  );

  let allTracks = pools.flat();

  // Déduplique
  const seen = new Set();
  allTracks = allTracks.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  // Validation stricte des années
  if (yearMin && yearMax) {
    const strict = allTracks.filter(t => t.year && t.year >= yearMin && t.year <= yearMax);
    if (strict.length >= Math.min(count, 5)) {
      allTracks = strict;
    }
  }

  if (allTracks.length === 0) {
    throw new Error("Aucun titre trouvé. Essaie d'autres filtres.");
  }

  let picked = shuffle(allTracks);
  while (picked.length < count) picked = [...picked, ...shuffle(allTracks)];
  picked = picked.slice(0, count);

  return picked.map((t, i) => ({
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