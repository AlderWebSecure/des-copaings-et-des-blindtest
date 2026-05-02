// api/deezer.js
// Source de vérité : on récupère les artistes du genre, puis on
// VALIDE leur appartenance via l'endpoint artist (qui contient ses genres réels)

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

    // ─── PIOCHE PAR GENRE (avec validation stricte) ───
    if (genre) {
      const genreId = +genre;

      // 1. Récupère les artistes proposés par Deezer pour ce genre
      const artistsUrl  = `https://api.deezer.com/genre/${genreId}/artists?output=json`;
      const artistsRes  = await fetch(artistsUrl);
      const artistsData = await artistsRes.json();
      const candidateArtists = (artistsData.data || []).slice(0, 25);

      if (candidateArtists.length === 0) {
        return res.status(404).json({ error: "Genre non trouvé" });
      }

      // 2. Valide chaque artiste : récupère ses vrais genres
      // Deezer expose /artist/{id} mais pas les genres directement
      // Par contre /artist/{id}/albums donne les genres de chaque album
      // On utilise une heuristique : on regarde le 1er album et son genre_id
      const validatedArtists = await Promise.all(
        candidateArtists.map(async (a) => {
          try {
            const albumsRes = await fetch(`https://api.deezer.com/artist/${a.id}/albums?limit=3&output=json`);
            const albumsData = await albumsRes.json();
            const albums = albumsData.data || [];
            if (albums.length === 0) return null;

            // Récupère le genre de l'album le plus connu
            const detailRes = await fetch(`https://api.deezer.com/album/${albums[0].id}?output=json`);
            const detail   = await detailRes.json();
            const albumGenreId = detail.genre_id || detail.genres?.data?.[0]?.id;

            // L'artiste est valide si l'ID genre matche
            if (albumGenreId === genreId) {
              return a;
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const validArtists = validatedArtists.filter(Boolean);

      // Si validation trop stricte (rien), on garde les premiers de la liste Deezer
      const finalArtists = validArtists.length >= 5 ? validArtists : candidateArtists.slice(0, 15);

      // 3. Pour chaque artiste validé, récupère ses top tracks
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

      // 4. Si filtre années, on récupère les détails et filtre strict
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
        // Sinon renvoie tout sans filtre années (au moins le genre est bon)
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