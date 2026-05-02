// src/constants/deezerGenres.js
// Pour chaque genre :
//   - id Deezer (pour /chart/{id} et /genre/{id}/artists)
//   - searchTerms : termes utilisés dans les recherches Deezer (q=...)
//   - excludedArtists : liste des artistes à filtrer (cas pollution genre)

export const DEEZER_GENRES = {
  "Pop": {
    id: 132,
    searchTerms: ["pop hits", "pop music"],
  },
  "Hip-Hop": {
    id: 116,
    searchTerms: ["rap fr", "rap us", "hip hop"],
  },
  "Rock": {
    id: 152,
    searchTerms: ["rock", "classic rock"],
  },
  "R&B": {
    id: 165,
    searchTerms: ["rnb", "r&b soul"],
  },
  "Électro": {
    id: 106,
    searchTerms: ["electro", "edm", "house music"],
  },
  "Jazz": {
    id: 129,
    searchTerms: ["jazz"],
  },
  "Classique": {
    id: 98,
    searchTerms: ["classical music", "musique classique"],
  },
  "Reggaeton": {
    id: 464,
    searchTerms: ["reggaeton"],
  },
  "K-Pop": {
    id: 2914,
    searchTerms: ["kpop", "k-pop bts", "k-pop blackpink"],
  },
  "Metal": {
    id: 464,
    searchTerms: ["metal", "heavy metal"],
  },
  "Soul": {
    id: 169,
    searchTerms: ["soul music", "motown"],
  },
  "Variété FR": {
    id: 52,
    searchTerms: ["chanson française", "variété française"],
  },
};

// Plages d'années
export const DECADE_RANGES = {
  "60s":   [1960, 1969],
  "70s":   [1970, 1979],
  "80s":   [1980, 1989],
  "90s":   [1990, 1999],
  "2000s": [2000, 2009],
  "2010s": [2010, 2019],
  "2020s": [2020, 2029],
};