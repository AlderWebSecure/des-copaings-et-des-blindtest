// api/deezer.js
// Vercel Serverless Function — proxy pour éviter le CORS de Deezer
// Appelé depuis le frontend : GET /api/deezer?q=eminem&limit=1

export default async function handler(req, res) {
  // CORS — autorise le frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, limit = 1, type = "track" } = req.query;

  if (!q) return res.status(400).json({ error: "Paramètre q manquant" });

  try {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}&output=json`;
    const response = await fetch(url);
    const data = await response.json();

    // On filtre les pistes sans preview
    const tracks = (data.data || []).filter(t => t.preview);

    if (tracks.length === 0) {
      return res.status(404).json({ error: "Aucun extrait trouvé pour cette recherche" });
    }

    // On retourne la première piste avec les infos utiles
    const track = tracks[0];
    return res.status(200).json({
      id:        track.id,
      title:     track.title,
      artist:    track.artist.name,
      preview:   track.preview,          // URL MP3 30s — jouable directement
      cover:     track.album.cover_medium,
      album:     track.album.title,
    });

  } catch (err) {
    console.error("Deezer proxy error:", err);
    return res.status(500).json({ error: "Erreur proxy Deezer" });
  }
}