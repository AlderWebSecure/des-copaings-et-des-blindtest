// api/deezer.js
// Modes :
//   - ?suggest=mich                                          → autocomplétion tracks
//   - ?artist_search=vald                                    → autocomplétion artistes
//   - ?q=eminem                                              → 1 piste (recherche libre)
//   - ?artist=AC/DC&year_min=1970&year_max=1979              → tracks d'un artiste DANS la plage

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, artist, artist_search, year_min, year_max, limit = 8, suggest } = req.query;

  try {
    // ─── RECHERCHE D'ARTISTES ──────────────────────────
    if (artist_search) {
      if (artist_search.length < 2) return res.status(200).json({ artists: [] });
      const url  = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist_search)}&limit=8&output=json`;
      const r    = await fetch(url);
      const data = await r.json();
      const artists = (data.data || []).map(a => ({
        id:      a.id,
        name:    a.name,
        picture: a.picture_medium,
        nb_fan:  a.nb_fan || 0,
      }));
      return res.status(200).json({ artists });
    }

    // ─── SUGGESTIONS TRACKS ────────────────────────────
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

    // ─── ARTISTE (+ DÉCENNIE optionnelle) ──────────────
    if (artist) {
      const searchUrl  = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist)}&limit=1&output=json`;
      const searchRes  = await fetch(searchUrl);
      const searchData = await searchRes.json();
      const found      = searchData.data?.[0];
      if (!found) return res.status(404).json({ error: `Artiste "${artist}" non trouvé` });

      // Sans filtre années → top tracks classiques
      if (!year_min && !year_max) {
        const topRes  = await fetch(`https://api.deezer.com/artist/${found.id}/top?limit=${limit}&output=json`);
        const topData = await topRes.json();
        const tracks  = (topData.data || [])
          .filter(t => t.preview)
          .map(t => ({ ...t, _artistName: found.name }));
        return res.status(200).json({ tracks: tracks.map(formatTrack) });
      }

      // Avec filtre années → albums dans la plage
      const albumsRes  = await fetch(`https://api.deezer.com/artist/${found.id}/albums?limit=100&output=json`);
      const albumsData = await albumsRes.json();
      const allAlbums  = albumsData.data || [];

      const albumsInRange = allAlbums.filter(alb => {
        if (!alb.release_date) return false;
        const y = parseInt(alb.release_date.slice(0, 4));
        if (year_min && y < +year_min) return false;
        if (year_max && y > +year_max) return false;
        return true;
      });

      if (albumsInRange.length === 0) {
        return res.status(200).json({ tracks: [] });
      }

      const sampleAlbums = albumsInRange.slice(0, 8);
      const trackArrays  = await Promise.all(
        sampleAlbums.map(async (alb) => {
          try {
            const r = await fetch(`https://api.deezer.com/album/${alb.id}/tracks?limit=20&output=json`);
            const d = await r.json();
            return (d.data || [])
              .filter(t => t.preview)
              .map(t => ({
                ...t,
                _artistName:  found.name,
                _albumYear:   parseInt(alb.release_date.slice(0, 4)),
                _albumTitle:  alb.title,
                _cover:       alb.cover_medium,
              }));
          } catch {
            return [];
          }
        })
      );

      let tracks = trackArrays.flat();

      // Déduplique par titre
      const seen = new Set();
      tracks = tracks.filter(t => {
        const key = t.title.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      tracks = tracks.slice(0, +limit);
      return res.status(200).json({
        tracks: tracks.map(t => ({
          id:      t.id,
          title:   t.title,
          artist:  found.name,
          preview: t.preview,
          cover:   t._cover || "",
          album:   t._albumTitle || "",
          year:    t._albumYear || null,
        })),
      });
    }

    return res.status(400).json({ error: "Paramètre q, artist, artist_search ou suggest requis" });

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