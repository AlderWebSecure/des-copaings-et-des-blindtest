// api/deezer.js
// Modes :
//   1. ?q=eminem            → 1 piste
//   2. ?genre=132&limit=50  → top du genre (avec year via détails parallèles)
//   3. ?suggest=mich        → autocomplétion

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, genre, limit = 1, year_min, year_max, suggest } = req.query;

  try {
    // ─── MODE SUGGESTIONS (autocomplete) ───────────────
    if (suggest) {
      if (suggest.length < 2) return res.status(200).json({ suggestions: [] });

      const url  = `https://api.deezer.com/search?q=${encodeURIComponent(suggest)}&limit=${limit}&output=json`;
      const r    = await fetch(url);
      const data = await r.json();

      const seen = new Set();
      const suggestions = [];

      for (const t of data.data || []) {
        const combined = `${t.artist?.name || ""} - ${t.title}`;
        if (!seen.has(combined.toLowerCase())) {
          seen.add(combined.toLowerCase());
          suggestions.push({
            id:     t.id,
            title:  t.title,
            artist: t.artist?.name || "",
            cover:  t.album?.cover_small || "",
            label:  combined,
          });
        }
        if (suggestions.length >= +limit) break;
      }

      return res.status(200).json({ suggestions });
    }

    // ─── MODE 1 : recherche libre (1 piste) ────────────
    if (q) {
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}&output=json`;
      const r = await fetch(url);
      const data = await r.json();
      const tracks = (data.data || []).filter(t => t.preview);
      if (tracks.length === 0) return res.status(404).json({ error: "Aucun extrait" });

      // Enrichit avec l'année
      const detailed = await fetchTrackDetail(tracks[0].id);
      return res.status(200).json(formatTrack({ ...tracks[0], ...detailed }));
    }

    // ─── MODE 2 : chart par genre (avec années en parallèle) ───
    if (genre) {
      const url    = `https://api.deezer.com/chart/${genre}/tracks?limit=${limit}&output=json`;
      const r      = await fetch(url);
      const data   = await r.json();
      let baseTracks = (data.data || []).filter(t => t.preview);

      if (baseTracks.length === 0) {
        return res.status(404).json({ error: "Aucune piste trouvée pour ce genre" });
      }

      // Récupère les détails (release_date) en parallèle pour avoir les années
      const detailedTracks = await Promise.all(
        baseTracks.map(async (t) => {
          const detail = await fetchTrackDetail(t.id);
          return { ...t, ...detail };
        })
      );

      // Filtre par plage d'années si demandé
      let filtered = detailedTracks;
      if (year_min || year_max) {
        filtered = detailedTracks.filter(t => {
          if (!t.year) return false;
          if (year_min && t.year < +year_min) return false;
          if (year_max && t.year > +year_max) return false;
          return true;
        });

        // Si filtre trop strict, on garde tout
        if (filtered.length === 0) filtered = detailedTracks;
      }

      return res.status(200).json({ tracks: filtered.map(formatTrack) });
    }

    return res.status(400).json({ error: "Paramètre q, genre ou suggest requis" });

  } catch (err) {
    console.error("Deezer proxy error:", err);
    return res.status(500).json({ error: "Erreur proxy Deezer: " + err.message });
  }
}

// Récupère release_date pour une piste donnée
async function fetchTrackDetail(trackId) {
  try {
    const r    = await fetch(`https://api.deezer.com/track/${trackId}?output=json`);
    const data = await r.json();
    return {
      year:         data.release_date ? parseInt(data.release_date.slice(0, 4)) : null,
      release_date: data.release_date,
    };
  } catch {
    return { year: null };
  }
}

function formatTrack(t) {
  return {
    id:       t.id,
    title:    t.title,
    artist:   t.artist?.name || "",
    preview:  t.preview,
    cover:    t.album?.cover_medium || "",
    album:    t.album?.title || "",
    year:     t.year || (t.release_date ? parseInt(t.release_date.slice(0, 4)) : null),
  };
}