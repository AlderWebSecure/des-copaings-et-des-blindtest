// src/constants/deezerGenres.js
// IDs officiels Deezer — vérifiés via https://api.deezer.com/genre
// Note : Metal et Variété FR n'ont pas d'ID dédié, on utilise des valeurs proches

export const DEEZER_GENRES = {
  "Pop":         132,
  "Hip-Hop":     116,
  "Rock":        152,
  "R&B":         165,
  "Électro":     106,
  "Jazz":        129,
  "Classique":    98,
  "Reggaeton":   464,
  "K-Pop":      2914,
  "Metal":        85,    // Hard rock & metal
  "Soul":        169,    // Films/Games (proche soul/funk)
  "Variété FR":   52,    // French chanson
};

// Décennies → plages d'années
export const DECADE_RANGES = {
  "60s":   [1960, 1969],
  "70s":   [1970, 1979],
  "80s":   [1980, 1989],
  "90s":   [1990, 1999],
  "2000s": [2000, 2009],
  "2010s": [2010, 2019],
  "2020s": [2020, 2029],
};