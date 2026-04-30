// src/constants/tracksDB.js
// Pool de titres organisés par genre/décennie
// Le host pioche dedans selon la config — Deezer fournit l'extrait

export const TRACKS_DB = [
  // ── POP 2010s ──────────────────────────────
  { title:"Shape of You",         artist:"Ed Sheeran",          year:2017, genre:"Pop",        decade:"2010s" },
  { title:"Bad Guy",              artist:"Billie Eilish",       year:2019, genre:"Pop",        decade:"2010s" },
  { title:"Blinding Lights",      artist:"The Weeknd",          year:2019, genre:"Pop",        decade:"2010s" },
  { title:"Rolling in the Deep",  artist:"Adele",               year:2010, genre:"Pop",        decade:"2010s" },
  { title:"Uptown Funk",          artist:"Bruno Mars",          year:2014, genre:"Pop",        decade:"2010s" },
  { title:"Happy",                artist:"Pharrell Williams",   year:2013, genre:"Pop",        decade:"2010s" },
  { title:"Counting Stars",       artist:"OneRepublic",         year:2013, genre:"Pop",        decade:"2010s" },
  { title:"Despacito",            artist:"Luis Fonsi",          year:2017, genre:"Pop",        decade:"2010s" },

  // ── POP 2020s ──────────────────────────────
  { title:"Levitating",           artist:"Dua Lipa",            year:2020, genre:"Pop",        decade:"2020s" },
  { title:"Watermelon Sugar",     artist:"Harry Styles",        year:2020, genre:"Pop",        decade:"2020s" },
  { title:"As It Was",            artist:"Harry Styles",        year:2022, genre:"Pop",        decade:"2020s" },
  { title:"Flowers",              artist:"Miley Cyrus",         year:2023, genre:"Pop",        decade:"2020s" },
  { title:"Anti-Hero",            artist:"Taylor Swift",        year:2022, genre:"Pop",        decade:"2020s" },
  { title:"Stay",                 artist:"The Kid LAROI",       year:2021, genre:"Pop",        decade:"2020s" },
  { title:"Espresso",             artist:"Sabrina Carpenter",   year:2024, genre:"Pop",        decade:"2020s" },

  // ── HIP-HOP 2010s ──────────────────────────
  { title:"Lose Yourself",        artist:"Eminem",              year:2002, genre:"Hip-Hop",    decade:"2000s" },
  { title:"HUMBLE.",              artist:"Kendrick Lamar",      year:2017, genre:"Hip-Hop",    decade:"2010s" },
  { title:"God's Plan",           artist:"Drake",               year:2018, genre:"Hip-Hop",    decade:"2010s" },
  { title:"SICKO MODE",           artist:"Travis Scott",        year:2018, genre:"Hip-Hop",    decade:"2010s" },
  { title:"Mask Off",             artist:"Future",              year:2017, genre:"Hip-Hop",    decade:"2010s" },
  { title:"Look What You Made Me Do", artist:"Taylor Swift",    year:2017, genre:"Pop",        decade:"2010s" },

  // ── HIP-HOP 2020s ──────────────────────────
  { title:"Industry Baby",        artist:"Lil Nas X",           year:2021, genre:"Hip-Hop",    decade:"2020s" },
  { title:"Savage",               artist:"Megan Thee Stallion", year:2020, genre:"Hip-Hop",    decade:"2020s" },
  { title:"WAP",                  artist:"Cardi B",             year:2020, genre:"Hip-Hop",    decade:"2020s" },
  { title:"Not Like Us",          artist:"Kendrick Lamar",      year:2024, genre:"Hip-Hop",    decade:"2020s" },

  // ── ROCK ───────────────────────────────────
  { title:"Bohemian Rhapsody",    artist:"Queen",               year:1975, genre:"Rock",       decade:"70s"   },
  { title:"Sweet Child O' Mine",  artist:"Guns N' Roses",       year:1987, genre:"Rock",       decade:"80s"   },
  { title:"Smells Like Teen Spirit", artist:"Nirvana",          year:1991, genre:"Rock",       decade:"90s"   },
  { title:"Wonderwall",           artist:"Oasis",               year:1995, genre:"Rock",       decade:"90s"   },
  { title:"Seven Nation Army",    artist:"The White Stripes",   year:2003, genre:"Rock",       decade:"2000s" },
  { title:"Mr. Brightside",       artist:"The Killers",         year:2003, genre:"Rock",       decade:"2000s" },
  { title:"Believer",             artist:"Imagine Dragons",     year:2017, genre:"Rock",       decade:"2010s" },

  // ── R&B ────────────────────────────────────
  { title:"One Dance",            artist:"Drake",               year:2016, genre:"R&B",        decade:"2010s" },
  { title:"Crazy in Love",        artist:"Beyoncé",             year:2003, genre:"R&B",        decade:"2000s" },
  { title:"Earned It",            artist:"The Weeknd",          year:2015, genre:"R&B",        decade:"2010s" },
  { title:"Leave The Door Open",  artist:"Bruno Mars",          year:2021, genre:"R&B",        decade:"2020s" },

  // ── ÉLECTRO ────────────────────────────────
  { title:"Get Lucky",            artist:"Daft Punk",           year:2013, genre:"Électro",    decade:"2010s" },
  { title:"One More Time",        artist:"Daft Punk",           year:2000, genre:"Électro",    decade:"2000s" },
  { title:"Animals",              artist:"Martin Garrix",       year:2013, genre:"Électro",    decade:"2010s" },
  { title:"Titanium",             artist:"David Guetta",        year:2011, genre:"Électro",    decade:"2010s" },
  { title:"Lean On",              artist:"Major Lazer",         year:2015, genre:"Électro",    decade:"2010s" },

  // ── VARIÉTÉ FR ────────────────────────────
  { title:"Dernière Danse",       artist:"Indila",              year:2014, genre:"Variété FR", decade:"2010s" },
  { title:"Papaoutai",            artist:"Stromae",             year:2013, genre:"Variété FR", decade:"2010s" },
  { title:"Alors on danse",       artist:"Stromae",             year:2009, genre:"Variété FR", decade:"2000s" },
  { title:"Tous les mêmes",       artist:"Stromae",             year:2013, genre:"Variété FR", decade:"2010s" },
  { title:"Sur ma route",         artist:"Black M",             year:2014, genre:"Variété FR", decade:"2010s" },
  { title:"Djadja",               artist:"Aya Nakamura",        year:2018, genre:"Variété FR", decade:"2010s" },
  { title:"Petit Pays",           artist:"Cesária Évora",       year:1992, genre:"Variété FR", decade:"90s"   },

  // ── SOUL ──────────────────────────────────
  { title:"I Will Always Love You", artist:"Whitney Houston",   year:1992, genre:"Soul",       decade:"90s"   },
  { title:"Superstition",         artist:"Stevie Wonder",       year:1972, genre:"Soul",       decade:"70s"   },
  { title:"Valerie",              artist:"Amy Winehouse",       year:2007, genre:"Soul",       decade:"2000s" },
];

// Pioche N titres correspondant aux filtres
export function pickTracks(genres, decades, count) {
  const pool = TRACKS_DB.filter(t =>
    genres.includes(t.genre) && decades.includes(t.decade)
  );

  // Si pool trop petit, élargir aux genres seulement
  const fallback = pool.length < count
    ? TRACKS_DB.filter(t => genres.includes(t.genre))
    : pool;

  // Mélange + slice
  const shuffled = [...fallback].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t, i) => ({
    ...t,
    id: i,
    emoji: t.genre === "Hip-Hop" ? "🎤" :
           t.genre === "Rock"    ? "🎸" :
           t.genre === "Électro" ? "🎹" :
           t.genre === "Pop"     ? "🎵" : "🎶",
  }));
}