// api/spotify-token.js
// Échange le code OAuth contre un access_token + refresh_token
// POST /api/spotify-token  { code, redirect_uri }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Méthode non autorisée" });

  const { code, redirect_uri, refresh_token, grant_type = "authorization_code" } = req.body;

  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Spotify credentials manquants côté serveur" });
  }

  const body = new URLSearchParams();
  body.append("grant_type", grant_type);

  if (grant_type === "authorization_code") {
    body.append("code", code);
    body.append("redirect_uri", redirect_uri);
  } else if (grant_type === "refresh_token") {
    body.append("refresh_token", refresh_token);
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error_description || data.error });

    return res.status(200).json({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_in:    data.expires_in,   // secondes (généralement 3600)
    });

  } catch (err) {
    console.error("Spotify token error:", err);
    return res.status(500).json({ error: "Erreur échange token Spotify" });
  }
}