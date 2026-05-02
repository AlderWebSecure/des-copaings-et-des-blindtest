// src/utils/pickDeezerTracks.js
// Source de vérité : la whitelist ARTISTS_DB
// On pioche les artistes correspondant aux genres/décennies, puis leurs top tracks Deezer

import { ARTISTS_DB } from "../constants/artistsDB";
import { DECADE_RANGES } from "../constants/deezerGenres";

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

// Construit la liste d'artistes à interroger selon les filtres
function selectArtists(genres, decades) {
  const set = new Set();
  const tagged = [];  // [{ artist, genre }]

  for (const genre of genres) {
    const genreDB = ARTISTS_DB[genre];
    if (!genreDB) continue;

    for (const decade of decades) {
      const list = genreDB[decade];
      if (!list) continue;

      for (const a of list) {
        if (!set.has(a)) {
          set.add(a);
          tagged.push({ artist: a, genre });
        }
      }
    }
  }

  return tagged;
}

// Récupère les top tracks d'un artiste via /api/deezer?artist=...
async function fetchArtistTracks(artistName, genreName) {
  try {
    const r = await fetch(`/api/deezer?artist=${encodeURIComponent(artistName)}&limit=8`);
    if (!r.ok) return [];
    const data = await r.json();
    if (!data.tracks) return [];
    return data.tracks
      .filter(t => t.preview)
      .map(t => ({ ...t, _genre: genreName }));
  } catch {
    return [];
  }
}

export async function pickDeezerTracks(genres, decades, count) {
  const ranges  = decades.map(d => DECADE_RANGES[d]).filter(Boolean);
  const yearMin = ranges.length ? Math.min(...ranges.map(r => r[0])) : null;
  const yearMax = ranges.length ? Math.max(...ranges.map(r => r[1])) : null;

  // Sélectionne les artistes pertinents depuis la whitelist
  const taggedArtists = selectArtists(genres, decades);

  if (taggedArtists.length === 0) {
    throw new Error("Aucun artiste référencé pour ces filtres. Essaie d'autres combinaisons.");
  }

  // Mélange et limite à 20 artistes pour ne pas surcharger
  const sample = shuffle(taggedArtists).slice(0, 20);

  // Récupère leurs top tracks en parallèle
  const trackArrays = await Promise.all(
    sample.map(({ artist, genre }) => fetchArtistTracks(artist, genre))
  );

  let allTracks = trackArrays.flat();

  // Déduplique par ID
  const seen = new Set();
  allTracks = allTracks.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  // Filtre par années si possible (la plupart des tracks Deezer ont une année)
  if (yearMin && yearMax) {
    const filtered = allTracks.filter(t => {
      if (!t.year) return true;  // garde si année inconnue
      return t.year >= yearMin && t.year <= yearMax;
    });
    if (filtered.length >= Math.min(count, 5)) {
      allTracks = filtered;
    }
  }

  if (allTracks.length === 0) {
    throw new Error("Aucun titre disponible. Essaie d'autres filtres.");
  }

  // Mélange et complète si pas assez
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