// api/deezer.js
// Modes :
//   1. ?q=eminem            → 1 piste pour lecture
//   2. ?genre=132&limit=50  → top du genre
//   3. ?suggest=mich&limit=8 → autocomplétion (titres + artistes)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, genre, limit = 1, year_min, year_max, suggest } = req.query;

  try {
    // ─── MODE 3 : SUGGESTIONS (autocomplete) ───────────────
    if (suggest) {
      if (suggest.length < 2) return res.status(200).json({ suggestions: [] });

      const url  = `https://api.deezer.com/search?q=${encodeURIComponent(suggest)}&limit=${limit}&output=json`;
      const r    = await fetch(url);
      const data = await r.json();

      const seen = new Set();
      const suggestions = [];

      for (const t of data.data || []) {
        // Suggestion combinée artiste + titre
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

    // ─── MODE 1 : recherche libre ──────────────────────────
    if (q) {
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}&output=json`;
      const r = await fetch(url);
      const data = await r.json();
      const tracks = (data.data || []).filter(t => t.preview);
      if (tracks.length === 0) return res.status(404).json({ error: "Aucun extrait" });
      return res.status(200).json(formatTrack(tracks[0]));
    }

    // ─── MODE 2 : chart par genre ──────────────────────────
    if (genre) {
      const url = `https://api.deezer.com/chart/${genre}/tracks?limit=${limit}&output=json`;
      const r    = await fetch(url);
      const data = await r.json();
      let tracks = (data.data || []).filter(t => t.preview);

      if (year_min || year_max) {
        const detailed = await Promise.all(
          tracks.slice(0, 30).map(t =>
            fetch(`https://api.deezer.com/track/${t.id}?output=json`).then(r => r.json()).catch(() => null)
          )
        );
        tracks = detailed.filter(t => {
          if (!t || !t.release_date) return false;
          const y = parseInt(t.release_date.slice(0, 4));
          if (year_min && y < +year_min) return false;
          if (year_max && y > +year_max) return false;
          return true;
        });
      }

      if (tracks.length === 0) return res.status(404).json({ error: "Aucune piste trouvée" });
      return res.status(200).json({ tracks: tracks.map(formatTrack) });
    }

    return res.status(400).json({ error: "Paramètre q, genre ou suggest requis" });
 
  } catch (err) {
    console.error("Deezer proxy error:", err);
    return res.status(500).json({ error: "Erreur proxy Deezer" });
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
    year:     t.release_date ? parseInt(t.release_date.slice(0, 4)) : null,
  };
}