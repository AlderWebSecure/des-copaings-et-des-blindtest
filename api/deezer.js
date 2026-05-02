// api/deezer.js
// Modes :
//   - ?suggest=mich         → autocomplétion
//   - ?q=eminem             → 1 piste
//   - ?artist=BTS           → top tracks d'un artiste précis (par recherche nom)
//   - ?genre=132            → fallback chart Deezer (pas utilisé désormais)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, genre, artist, limit = 10, suggest } = req.query;

  try {
    // ─── SUGGESTIONS ───────────────────────────────────
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

    // ─── RECHERCHE LIBRE (1 piste) ─────────────────────
    if (q) {
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}&output=json`;
      const r = await fetch(url);
      const data = await r.json();
      const tracks = (data.data || []).filter(t => t.preview);
      if (tracks.length === 0) return res.status(404).json({ error: "Aucun extrait" });
      const detailed = await fetchTrackDetail(tracks[0].id);
      return res.status(200).json(formatTrack({ ...tracks[0], ...detailed }));
    }

    // ─── TOP TRACKS D'UN ARTISTE PAR NOM ───────────────
    if (artist) {
      // 1. Cherche l'artiste par nom
      const searchUrl  = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist)}&limit=1&output=json`;
      const searchRes  = await fetch(searchUrl);
      const searchData = await searchRes.json();
      const found      = searchData.data?.[0];

      if (!found) return res.status(404).json({ error: `Artiste "${artist}" non trouvé` });

      // 2. Récupère ses top tracks
      const topUrl  = `https://api.deezer.com/artist/${found.id}/top?limit=${limit}&output=json`;
      const topRes  = await fetch(topUrl);
      const topData = await topRes.json();
      const tracks  = (topData.data || [])
        .filter(t => t.preview)
        .map(t => ({ ...t, _artistName: found.name }));

      return res.status(200).json({ tracks: tracks.map(formatTrack) });
    }

    // ─── FALLBACK : chart par genre Deezer ─────────────
    if (genre) {
      const url    = `https://api.deezer.com/chart/${genre}/tracks?limit=${limit}&output=json`;
      const r      = await fetch(url);
      const data   = await r.json();
      const tracks = (data.data || []).filter(t => t.preview);
      return res.status(200).json({ tracks: tracks.map(formatTrack) });
    }

    return res.status(400).json({ error: "Paramètre q, artist, genre ou suggest requis" });

  } catch (err) {
    console.error("Deezer proxy error:", err);
    return res.status(500).json({ error: "Erreur proxy: " + err.message });
  }
}

async function fetchTrackDetail(trackId) {
  try {
    const r = await fetch(`https://api.deezer.com/track/${trackId}?output=json`);
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
    artist:   t.artist?.name || t._artistName || "",
    preview:  t.preview,
    cover:    t.album?.cover_medium || "",
    album:    t.album?.title || "",
    year:     t.year || (t.release_date ? parseInt(t.release_date.slice(0, 4)) : null),
  };
}