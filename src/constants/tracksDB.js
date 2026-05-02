// src/constants/artistsDB.js
// Whitelist d'artistes par genre + décennie

export const ARTISTS_DB = {
  "Pop": {
    "60s":   ["The Beatles", "The Beach Boys", "ABBA", "Diana Ross", "The Supremes", "The Mamas & The Papas"],
    "70s":   ["ABBA", "Bee Gees", "Donna Summer", "Elton John", "Queen", "Carpenters", "Carly Simon"],
    "80s":   ["Madonna", "Michael Jackson", "Whitney Houston", "Cyndi Lauper", "Wham", "George Michael", "Prince", "Tina Turner", "Lionel Richie", "Phil Collins"],
    "90s":   ["Britney Spears", "Spice Girls", "Backstreet Boys", "NSYNC", "Mariah Carey", "Christina Aguilera", "Celine Dion", "Whitney Houston"],
    "2000s": ["Britney Spears", "Beyoncé", "Justin Timberlake", "Pink", "Kelly Clarkson", "Avril Lavigne", "Rihanna", "Lady Gaga", "Katy Perry", "Black Eyed Peas"],
    "2010s": ["Taylor Swift", "Adele", "Bruno Mars", "Ed Sheeran", "Dua Lipa", "Ariana Grande", "Justin Bieber", "Sam Smith", "Lorde", "Sia", "The Weeknd", "Maroon 5", "Charlie Puth", "Shawn Mendes"],
    "2020s": ["Olivia Rodrigo", "Harry Styles", "Dua Lipa", "Billie Eilish", "Doja Cat", "Sabrina Carpenter", "Taylor Swift", "Miley Cyrus", "Tate McRae", "Chappell Roan", "Charli XCX"],
  },

  "Hip-Hop": {
    "80s":   ["Run-DMC", "Beastie Boys", "LL Cool J", "Public Enemy", "NWA"],
    "90s":   ["Tupac", "Notorious B.I.G.", "Wu-Tang Clan", "Snoop Dogg", "Dr. Dre", "Nas", "Jay-Z", "Outkast", "MC Solaar", "IAM", "NTM"],
    "2000s": ["Eminem", "50 Cent", "Kanye West", "Jay-Z", "Lil Wayne", "Nelly", "Ludacris", "Booba", "Diam's", "Sinik", "Sniper"],
    "2010s": ["Drake", "Kendrick Lamar", "J. Cole", "Kanye West", "Eminem", "Travis Scott", "Cardi B", "Future", "Migos", "PNL", "Nekfeu", "Booba", "Damso", "Orelsan", "Bigflo & Oli", "Lomepal", "Sch", "Jul"],
    "2020s": ["Drake", "Kendrick Lamar", "Travis Scott", "Lil Nas X", "Doja Cat", "Megan Thee Stallion", "Cardi B", "DaBaby", "Jack Harlow", "Ninho", "Werenoi", "Damso", "Sch", "Gazo", "Tiakola", "Niska", "Booba", "Central Cee"],
  },

  "Rock": {
    "60s":   ["The Beatles", "The Rolling Stones", "Led Zeppelin", "The Who", "The Doors", "Pink Floyd", "Jimi Hendrix", "The Beach Boys"],
    "70s":   ["Led Zeppelin", "Pink Floyd", "Queen", "AC/DC", "Aerosmith", "Fleetwood Mac", "The Rolling Stones", "Eagles", "Black Sabbath", "Deep Purple", "David Bowie"],
    "80s":   ["Bon Jovi", "Guns N' Roses", "U2", "The Police", "Dire Straits", "Bruce Springsteen", "Van Halen", "Def Leppard", "AC/DC", "Aerosmith", "The Cure"],
    "90s":   ["Nirvana", "Pearl Jam", "Red Hot Chili Peppers", "Radiohead", "Oasis", "Foo Fighters", "Green Day", "U2", "The Smashing Pumpkins", "Soundgarden", "Blur"],
    "2000s": ["Linkin Park", "Coldplay", "Muse", "The Killers", "Arctic Monkeys", "Foo Fighters", "Red Hot Chili Peppers", "Green Day", "System of a Down", "Evanescence", "The White Stripes"],
    "2010s": ["Imagine Dragons", "Arctic Monkeys", "Twenty One Pilots", "Coldplay", "Muse", "Royal Blood", "Foo Fighters", "Foster the People", "The Black Keys"],
    "2020s": ["Måneskin", "Imagine Dragons", "Twenty One Pilots", "Arctic Monkeys", "Wet Leg"],
  },

  "R&B": {
    "80s":   ["Whitney Houston", "Anita Baker", "Luther Vandross", "Lionel Richie"],
    "90s":   ["Mariah Carey", "Whitney Houston", "Boyz II Men", "TLC", "Aaliyah", "Brandy", "Toni Braxton", "Mary J. Blige", "Usher", "R. Kelly"],
    "2000s": ["Beyoncé", "Alicia Keys", "Usher", "Mary J. Blige", "Ne-Yo", "John Legend", "Chris Brown", "Rihanna"],
    "2010s": ["The Weeknd", "Frank Ocean", "Bryson Tiller", "Khalid", "Jhené Aiko", "SZA", "Miguel", "Daniel Caesar", "H.E.R."],
    "2020s": ["The Weeknd", "SZA", "Bryson Tiller", "Giveon", "Summer Walker", "Tems", "Brent Faiyaz", "Daniel Caesar"],
  },

  "Électro": {
    "90s":   ["Daft Punk", "The Prodigy", "Chemical Brothers", "Fatboy Slim", "Massive Attack", "Air"],
    "2000s": ["Daft Punk", "Justice", "David Guetta", "Tiesto", "Armin van Buuren", "Calvin Harris", "Deadmau5"],
    "2010s": ["David Guetta", "Calvin Harris", "Avicii", "Skrillex", "Martin Garrix", "Major Lazer", "Disclosure", "Diplo", "Marshmello", "Kygo", "DJ Snake"],
    "2020s": ["Fred again..", "Calvin Harris", "David Guetta", "ODESZA", "Fisher", "John Summit", "Peggy Gou"],
  },

  "Jazz": {
    "60s":   ["Miles Davis", "John Coltrane", "Bill Evans", "Stan Getz", "Wes Montgomery", "Thelonious Monk", "Sonny Rollins", "Cannonball Adderley", "Nina Simone"],
    "70s":   ["Herbie Hancock", "Weather Report", "Chick Corea", "Pat Metheny", "Keith Jarrett", "Miles Davis"],
    "80s":   ["Wynton Marsalis", "Pat Metheny", "Chick Corea", "Keith Jarrett"],
    "90s":   ["Diana Krall", "Norah Jones", "Joshua Redman", "Chick Corea"],
    "2000s": ["Norah Jones", "Diana Krall", "Michael Bublé", "Esperanza Spalding"],
    "2010s": ["Kamasi Washington", "Robert Glasper", "Snarky Puppy", "Esperanza Spalding", "Gregory Porter"],
    "2020s": ["Samara Joy", "Laufey", "Robert Glasper", "Kamasi Washington"],
  },

  "Classique": {
    "60s":   ["Herbert von Karajan", "Leonard Bernstein", "Glenn Gould"],
    "70s":   ["Herbert von Karajan", "Vladimir Horowitz", "Maria Callas"],
    "80s":   ["Luciano Pavarotti", "Plácido Domingo", "Yo-Yo Ma", "Itzhak Perlman"],
    "90s":   ["The Three Tenors", "Andrea Bocelli", "Yo-Yo Ma"],
    "2000s": ["Andrea Bocelli", "Lang Lang", "Joshua Bell", "Hilary Hahn"],
    "2010s": ["Lang Lang", "Yuja Wang", "2Cellos", "Ludovico Einaudi"],
    "2020s": ["Ludovico Einaudi", "Yuja Wang", "Lang Lang"],
  },

  "Reggaeton": {
    "2000s": ["Daddy Yankee", "Don Omar", "Wisin & Yandel", "Tego Calderon"],
    "2010s": ["J Balvin", "Maluma", "Nicky Jam", "Daddy Yankee", "Bad Bunny", "Ozuna"],
    "2020s": ["Bad Bunny", "Karol G", "Rauw Alejandro", "J Balvin", "Maluma", "Anuel AA", "Feid", "Quevedo", "Peso Pluma"],
  },

  "K-Pop": {
    "2010s": ["BTS", "EXO", "Big Bang", "Girls' Generation", "2NE1", "TWICE", "Red Velvet", "BLACKPINK", "GOT7", "iKON", "MAMAMOO"],
    "2020s": ["BTS", "BLACKPINK", "TWICE", "Stray Kids", "ITZY", "ATEEZ", "TOMORROW X TOGETHER", "ENHYPEN", "NewJeans", "LE SSERAFIM", "IVE", "aespa", "(G)I-DLE", "SEVENTEEN", "NCT 127", "NCT Dream", "Jungkook", "Jimin", "Lisa", "Jisoo"],
  },

  "Metal": {
    "70s":   ["Black Sabbath", "Deep Purple", "Judas Priest", "Iron Maiden"],
    "80s":   ["Iron Maiden", "Metallica", "Megadeth", "Slayer", "Anthrax", "Motörhead", "Pantera"],
    "90s":   ["Metallica", "Slipknot", "Korn", "Tool", "System of a Down", "Pantera", "Sepultura", "Rammstein"],
    "2000s": ["System of a Down", "Slipknot", "Avenged Sevenfold", "Lamb of God", "Mastodon", "Disturbed", "Five Finger Death Punch"],
    "2010s": ["Ghost", "Slipknot", "Mastodon", "Architects", "Bring Me the Horizon", "Gojira"],
    "2020s": ["Sleep Token", "Ghost", "Bring Me the Horizon", "Spiritbox"],
  },

  "Soul": {
    "60s":   ["Aretha Franklin", "Otis Redding", "Marvin Gaye", "Stevie Wonder", "James Brown", "The Temptations", "Sam Cooke"],
    "70s":   ["Stevie Wonder", "Marvin Gaye", "Al Green", "Curtis Mayfield", "Earth Wind & Fire", "The Jackson 5", "Donny Hathaway"],
    "80s":   ["Whitney Houston", "Anita Baker", "Luther Vandross", "Sade", "Lionel Richie"],
    "90s":   ["Erykah Badu", "D'Angelo", "Lauryn Hill", "Maxwell"],
    "2000s": ["Alicia Keys", "John Legend", "Amy Winehouse", "Joss Stone", "India.Arie"],
    "2010s": ["Leon Bridges", "Sam Smith", "Anderson .Paak", "Bruno Mars"],
    "2020s": ["Leon Bridges", "Anderson .Paak", "Lizzo"],
  },

  "Variété FR": {
    "60s":   ["Johnny Hallyday", "Charles Aznavour", "Jacques Brel", "Serge Gainsbourg", "Françoise Hardy", "France Gall", "Sylvie Vartan", "Claude François"],
    "70s":   ["Michel Sardou", "Joe Dassin", "Serge Gainsbourg", "Jacques Dutronc", "Renaud", "Eddy Mitchell", "Mike Brant", "Sheila"],
    "80s":   ["Jean-Jacques Goldman", "Mylène Farmer", "Étienne Daho", "Indochine", "Téléphone", "Les Rita Mitsouko", "Daniel Balavoine", "France Gall", "Michel Berger", "Patrick Bruel", "Charles Aznavour"],
    "90s":   ["Mylène Farmer", "Patrick Bruel", "Francis Cabrel", "Patricia Kaas", "Lara Fabian", "Céline Dion", "Garou", "Florent Pagny", "Jean-Jacques Goldman", "Pascal Obispo"],
    "2000s": ["Calogero", "Christophe Maé", "M. Pokora", "Jenifer", "Lorie", "Grégory Lemarchal", "Yannick Noah", "Bénabar", "Cali"],
    "2010s": ["Stromae", "Indila", "Christine and the Queens", "Maître Gims", "Black M", "Kendji Girac", "Vianney", "Louane", "Soprano", "Amir", "M. Pokora", "Vitaa", "Slimane"],
    "2020s": ["Aya Nakamura", "Angèle", "Clara Luciani", "Pomme", "Vianney", "Slimane", "Soprano", "Kendji Girac", "Hoshi", "Pierre de Maere", "Zaho de Sagazan"],
  },

  "Country": {
    "60s":   ["Johnny Cash", "Dolly Parton", "Willie Nelson", "Patsy Cline"],
    "70s":   ["Dolly Parton", "Willie Nelson", "Kenny Rogers", "Johnny Cash"],
    "80s":   ["Garth Brooks", "Reba McEntire", "George Strait", "Alan Jackson"],
    "90s":   ["Garth Brooks", "Shania Twain", "Faith Hill", "Tim McGraw", "Dixie Chicks", "Alan Jackson"],
    "2000s": ["Carrie Underwood", "Brad Paisley", "Keith Urban", "Taylor Swift", "Toby Keith"],
    "2010s": ["Luke Bryan", "Florida Georgia Line", "Blake Shelton", "Carrie Underwood", "Kacey Musgraves"],
    "2020s": ["Morgan Wallen", "Luke Combs", "Zach Bryan", "Kacey Musgraves", "Lainey Wilson"],
  },

  "Funk": {
    "70s":   ["James Brown", "Parliament-Funkadelic", "Sly and the Family Stone", "Earth Wind & Fire", "Kool & the Gang", "Chic"],
    "80s":   ["Prince", "Rick James", "Cameo", "Zapp & Roger"],
    "90s":   ["Jamiroquai", "Red Hot Chili Peppers"],
    "2000s": ["Jamiroquai"],
    "2010s": ["Bruno Mars", "Mark Ronson", "Anderson .Paak"],
    "2020s": ["Anderson .Paak", "Silk Sonic", "Bruno Mars"],
  },

  "Disco": {
    "70s":   ["Bee Gees", "Donna Summer", "Chic", "Gloria Gaynor", "KC and the Sunshine Band", "Village People", "Earth Wind & Fire", "Sister Sledge", "Boney M."],
    "80s":   ["Bee Gees", "Donna Summer", "Chic"],
  },

  "Latino": {
    "90s":   ["Ricky Martin", "Enrique Iglesias", "Selena", "Gloria Estefan", "Marc Anthony", "Shakira"],
    "2000s": ["Shakira", "Enrique Iglesias", "Marc Anthony", "Juanes", "Daddy Yankee", "Aventura"],
    "2010s": ["Shakira", "Enrique Iglesias", "J Balvin", "Maluma", "Romeo Santos", "Luis Fonsi", "Pitbull"],
    "2020s": ["Bad Bunny", "Karol G", "Shakira", "Rosalía", "Rauw Alejandro", "Camilo"],
  },

  "Punk": {
    "70s":   ["The Ramones", "Sex Pistols", "The Clash", "Patti Smith", "Iggy Pop"],
    "80s":   ["The Clash", "Dead Kennedys", "Black Flag", "Bad Religion", "Misfits"],
    "90s":   ["Green Day", "The Offspring", "Blink-182", "NOFX", "Rancid", "Sum 41"],
    "2000s": ["Green Day", "Blink-182", "Sum 41", "Simple Plan", "Fall Out Boy", "My Chemical Romance", "Paramore"],
    "2010s": ["Fall Out Boy", "Paramore", "All Time Low", "5 Seconds of Summer"],
    "2020s": ["Olivia Rodrigo", "Yungblud", "Machine Gun Kelly"],
  },

  "Indie": {
    "2000s": ["Arcade Fire", "The Strokes", "Modest Mouse", "Yeah Yeah Yeahs", "Vampire Weekend", "Death Cab for Cutie", "MGMT"],
    "2010s": ["Arctic Monkeys", "Tame Impala", "Vampire Weekend", "The xx", "Foals", "alt-J", "Of Monsters and Men", "Florence + The Machine", "Hozier", "The Lumineers"],
    "2020s": ["Phoebe Bridgers", "Mitski", "boygenius", "Soccer Mommy", "Wet Leg", "The 1975", "Beabadoobee"],
  },

  "Reggae": {
    "70s":   ["Bob Marley", "Peter Tosh", "Jimmy Cliff", "Lee Scratch Perry"],
    "80s":   ["Bob Marley", "UB40", "Eddy Grant", "Black Uhuru"],
    "90s":   ["Shaggy", "Inner Circle", "UB40"],
    "2000s": ["Sean Paul", "Shaggy", "Damian Marley"],
    "2010s": ["Chronixx", "Protoje", "Damian Marley"],
    "2020s": ["Koffee", "Lila Iké", "Protoje"],
  },

  "Blues": {
    "60s":   ["B.B. King", "Muddy Waters", "Eric Clapton", "Jimi Hendrix", "Howlin' Wolf", "John Lee Hooker"],
    "70s":   ["B.B. King", "Eric Clapton", "Stevie Ray Vaughan"],
    "80s":   ["Stevie Ray Vaughan", "Eric Clapton", "Robert Cray"],
    "90s":   ["Eric Clapton", "John Lee Hooker", "Buddy Guy"],
    "2000s": ["Joe Bonamassa", "Gary Clark Jr.", "John Mayer"],
    "2010s": ["Gary Clark Jr.", "Joe Bonamassa", "Christone 'Kingfish' Ingram"],
    "2020s": ["Christone 'Kingfish' Ingram", "Gary Clark Jr."],
  },
};