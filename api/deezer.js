// api/deezer.js
// Validation stricte : on regarde le genre majoritaire des albums de l'artiste
// Si la majorité ne matche pas le genre demandé, on rejette.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, genre, limit = 50, year_min, year_max, suggest } = req.query;

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

    // ─── PIOCHE PAR GENRE ──────────────────────────────
    if (genre) {
      const genreId = +genre;
      const strict  = req.query.strict !== "false";  // par défaut on valide

      // 1. Artistes proposés par Deezer pour ce genre
      const artistsRes  = await fetch(`https://api.deezer.com/genre/${genreId}/artists?output=json`);
      const artistsData = await artistsRes.json();
      const candidates  = (artistsData.data || []).slice(0, 25);

      if (candidates.length === 0) {
        return res.status(404).json({ error: "Genre non trouvé" });
      }

      let finalArtists;

      if (strict) {
        // 2. Validation par genre majoritaire des 5 derniers albums
        const validated = await Promise.all(
          candidates.map(async (a) => {
            try {
              const albumsRes = await fetch(`https://api.deezer.com/artist/${a.id}/albums?limit=5&output=json`);
              const albumsData = await albumsRes.json();
              const albums = (albumsData.data || []).slice(0, 5);
              if (albums.length === 0) return null;

              const albumGenres = await Promise.all(
                albums.map(async (alb) => {
                  try {
                    const r = await fetch(`https://api.deezer.com/album/${alb.id}?output=json`);
                    const d = await r.json();
                    return d.genre_id ?? d.genres?.data?.[0]?.id ?? null;
                  } catch { return null; }
                })
              );

              const matches = albumGenres.filter(g => g === genreId).length;
              const total   = albumGenres.filter(g => g !== null).length;

              if (total > 0 && matches / total >= 0.5) {
                return { ...a, _matchRatio: matches / total };
              }
              return null;
            } catch {
              return null;
            }
          })
        );

        const validArtists = validated.filter(Boolean);
        finalArtists = validArtists.length >= 3
          ? validArtists
          : candidates.slice(0, 15);  // fallback : sans validation
      } else {
        // Mode non-strict : on fait confiance à Deezer
        finalArtists = candidates.slice(0, 20);
      }

      // 3. Top tracks pour chaque artiste
      const trackArrays = await Promise.all(
        finalArtists.map(async (a) => {
          try {
            const r = await fetch(`https://api.deezer.com/artist/${a.id}/top?limit=10&output=json`);
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

      // Déduplique
      const seen = new Set();
      allTracks = allTracks.filter(t => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });

      if (allTracks.length === 0) {
        return res.status(404).json({ error: "Aucune piste trouvée" });
      }

      // 4. Filtre par années si demandé
      if (year_min || year_max) {
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

        if (filtered.length > 0) {
          return res.status(200).json({ tracks: filtered.map(formatTrack) });
        }
        return res.status(200).json({ tracks: detailed.map(formatTrack) });
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