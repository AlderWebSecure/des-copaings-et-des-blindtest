// src/constants/deezerGenres.js
// strict: true  → on valide via genre majoritaire des albums
// strict: false → on fait confiance à la liste Deezer /genre/{id}/artists

export const DEEZER_GENRES = {
  "Pop":         { id:  132, strict: false },
  "Hip-Hop":     { id:  116, strict: false },
  "Rock":        { id:  152, strict: true  },
  "R&B":         { id:  165, strict: true  },
  "Électro":     { id:  106, strict: true  },
  "Jazz":        { id:  129, strict: true  },
  "Classique":   { id:   98, strict: true  },
  "Reggaeton":   { id:  464, strict: true  },
  "K-Pop":       { id: 2914, strict: true  },
  "Metal":       { id:  464, strict: true  },
  "Soul":        { id:  169, strict: true  },
  "Variété FR":  { id:   52, strict: false },  // trop varié pour valider
};

export const DECADE_RANGES = {
  "60s":   [1960, 1969],
  "70s":   [1970, 1979],
  "80s":   [1980, 1989],
  "90s":   [1990, 1999],
  "2000s": [2000, 2009],
  "2010s": [2010, 2019],
  "2020s": [2020, 2029],
};