// api/deezer.js
// Stratégie : pour chaque genre, on combine plusieurs sources Deezer
//   - le chart du genre (top tracks récents)
//   - les artistes populaires du genre + leurs top tracks
// Cela donne accès à des centaines de morceaux par genre

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, genre, limit = 50, year_min, year_max, suggest } = req.query;

  try {
    // ─── SUGGESTIONS (autocomplete) ────────────────────
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

    // ─── RECHERCHE LIBRE ───────────────────────────────
    if (q) {
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}&output=json`;
      const r = await fetch(url);
      const data = await r.json();
      const tracks = (data.data || []).filter(t => t.preview);
      if (tracks.length === 0) return res.status(404).json({ error: "Aucun extrait" });
      const detailed = await fetchTrackDetail(tracks[0].id);
      return res.status(200).json(formatTrack({ ...tracks[0], ...detailed }));
    }

    // ─── PIOCHE PAR GENRE (avec gros pool d'artistes) ──
    if (genre) {
      // Étape 1 : récupère les artistes populaires du genre
      const artistsUrl  = `https://api.deezer.com/genre/${genre}/artists?output=json`;
      const artistsRes  = await fetch(artistsUrl);
      const artistsData = await artistsRes.json();
      const artists     = (artistsData.data || []).slice(0, 15);

      if (artists.length === 0) {
        return res.status(404).json({ error: "Genre non trouvé sur Deezer" });
      }

      // Étape 2 : récupère 10 top tracks par artiste en parallèle
      const trackArrays = await Promise.all(
        artists.map(async (a) => {
          try {
            const r    = await fetch(`https://api.deezer.com/artist/${a.id}/top?limit=10&output=json`);
            const data = await r.json();
            return (data.data || [])
              .filter(t => t.preview)
              .map(t => ({ ...t, _artistName: a.name }));
          } catch {
            return [];
          }
        })
      );

      let allTracks = trackArrays.flat();

      // Déduplique par ID
      const seen = new Set();
      allTracks = allTracks.filter(t => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });

      if (allTracks.length === 0) {
        return res.status(404).json({ error: "Aucune piste trouvée" });
      }

      // Étape 3 : si on filtre par année, on récupère les détails en parallèle
      if (year_min || year_max) {
        // Limite à 60 pour éviter de spammer Deezer
        const sample = allTracks.slice(0, 60);
        const detailed = await Promise.all(
          sample.map(async (t) => {
            const detail = await fetchTrackDetail(t.id);
            return { ...t, ...detail };
          })
        );

        const filtered = detailed.filter(t => {
          if (!t.year) return false;
          if (year_min && t.year < +year_min) return false;
          if (year_max && t.year > +year_max) return false;
          return true;
        });

        // Si après filtre on a quand même des résultats, on les renvoie
        if (filtered.length > 0) {
          return res.status(200).json({ tracks: filtered.map(formatTrack) });
        }

        // Sinon fallback : renvoie tout sans filtre années (pour ne pas tomber à 0)
        return res.status(200).json({
          tracks: detailed.map(formatTrack),
          warning: "Filtre années trop restrictif, renvoi de tous les titres du genre",
        });
      }

      return res.status(200).json({ tracks: allTracks.slice(0, +limit).map(formatTrack) });
    }

    return res.status(400).json({ error: "Paramètre q, genre ou suggest requis" });

  } catch (err) {
    console.error("Deezer proxy error:", err);
    return res.status(500).json({ error: "Erreur proxy: " + err.message });
  }
}

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
    artist:   t.artist?.name || t._artistName || "",
    preview:  t.preview,
    cover:    t.album?.cover_medium || "",
    album:    t.album?.title || "",
    year:     t.year || (t.release_date ? parseInt(t.release_date.slice(0, 4)) : null),
  };
}