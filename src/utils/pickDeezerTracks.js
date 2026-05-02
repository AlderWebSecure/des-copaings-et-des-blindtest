// src/utils/pickDeezerTracks.js
// Pour chaque artiste de la whitelist :
//   - on demande à Deezer ses tracks SORTIES dans la plage d'années demandée
//   - donc AC/DC + 70s → uniquement albums Highway to Hell, Back in Black etc.

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
  const tagged = [];

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

// Récupère les tracks d'un artiste DANS la plage d'années
async function fetchArtistTracksInRange(artistName, genreName, yearMin, yearMax) {
  try {
    const params = new URLSearchParams({
      artist: artistName,
      limit:  "8",
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
  } catch {
    return [];
  }
}

export async function pickDeezerTracks(genres, decades, count, customArtists = []) {
  // Calcule la plage d'années couvrant les décennies sélectionnées
  const ranges  = decades.map(d => DECADE_RANGES[d]).filter(Boolean);
  const yearMin = ranges.length ? Math.min(...ranges.map(r => r[0])) : null;
  const yearMax = ranges.length ? Math.max(...ranges.map(r => r[1])) : null;

  // Combine artistes de la whitelist + artistes custom
  const taggedArtists = selectArtists(genres, decades);

  // Ajoute les artistes choisis manuellement (genre = "Custom")
  for (const a of customArtists) {
    if (!taggedArtists.find(t => t.artist.toLowerCase() === a.name.toLowerCase())) {
      taggedArtists.push({ artist: a.name, genre: "Custom" });
    }
  }

  if (taggedArtists.length === 0) {
    throw new Error("Aucun artiste sélectionné. Choisis des genres ou des artistes spécifiques.");
  }

  // Mélange et limite à 25 artistes pour ne pas surcharger
  const sample = shuffle(taggedArtists).slice(0, 25);

  // Récupère leurs tracks DANS la plage d'années en parallèle
  const trackArrays = await Promise.all(
    sample.map(({ artist, genre }) =>
      fetchArtistTracksInRange(artist, genre, yearMin, yearMax)
    )
  );

  let allTracks = trackArrays.flat();

  // Déduplique
  const seen = new Set();
  allTracks = allTracks.filter(t => {
    const key = `${t.artist}-${t.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (allTracks.length === 0) {
    throw new Error("Aucun titre trouvé dans cette période. Essaie d'autres décennies ou genres.");
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