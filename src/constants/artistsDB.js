// src/constants/artistsDB.js
// Version Ultra-Complète : Whitelist d'artistes par genre + décennie

export const ARTISTS_DB = {
  "Pop": {
    "50s":   ["Elvis Presley", "Frank Sinatra", "Buddy Holly", "Chuck Berry", "Bill Haley", "Edith Piaf"],
    "60s":   ["The Beatles", "The Beach Boys", "ABBA", "Diana Ross", "The Supremes", "The Mamas & The Papas", "Dusty Springfield", "Tom Jones"],
    "70s":   ["ABBA", "Bee Gees", "Donna Summer", "Elton John", "Queen", "Carpenters", "Carly Simon", "Billy Joel", "Olivia Newton-John"],
    "80s":   ["Madonna", "Michael Jackson", "Whitney Houston", "Cyndi Lauper", "Wham", "George Michael", "Prince", "Tina Turner", "Lionel Richie", "Phil Collins", "Eurythmics", "Rick Astley"],
    "90s":   ["Britney Spears", "Spice Girls", "Backstreet Boys", "NSYNC", "Mariah Carey", "Christina Aguilera", "Celine Dion", "Whitney Houston", "Robbie Williams", "No Doubt", "Alanis Morissette"],
    "2000s": ["Britney Spears", "Beyoncé", "Justin Timberlake", "Pink", "Kelly Clarkson", "Avril Lavigne", "Rihanna", "Lady Gaga", "Katy Perry", "Black Eyed Peas", "Nelly Furtado", "Gwen Stefani"],
    "2010s": ["Taylor Swift", "Adele", "Bruno Mars", "Ed Sheeran", "Dua Lipa", "Ariana Grande", "Justin Bieber", "Sam Smith", "Lorde", "Sia", "The Weeknd", "Maroon 5", "Charlie Puth", "Shawn Mendes"],
    "2020s": ["Olivia Rodrigo", "Harry Styles", "Dua Lipa", "Billie Eilish", "Doja Cat", "Sabrina Carpenter", "Taylor Swift", "Miley Cyrus", "Tate McRae", "Chappell Roan", "Charli XCX", "Benson Boone"],
  },

  "Hip-Hop": {
    "80s":   ["Run-DMC", "Beastie Boys", "LL Cool J", "Public Enemy", "NWA", "Slick Rick", "Big Daddy Kane"],
    "90s":   ["Tupac", "Notorious B.I.G.", "Wu-Tang Clan", "Snoop Dogg", "Dr. Dre", "Nas", "Jay-Z", "Outkast", "MC Solaar", "IAM", "NTM", "Cypress Hill", "Busta Rhymes"],
    "2000s": ["Eminem", "50 Cent", "Kanye West", "Jay-Z", "Lil Wayne", "Nelly", "Ludacris", "Booba", "Diam's", "Sinik", "Sniper", "Rohff", "La Fouine", "Missy Elliott"],
    "2010s": ["Drake", "Kendrick Lamar", "J. Cole", "Kanye West", "Eminem", "Travis Scott", "Cardi B", "Future", "Migos", "PNL", "Nekfeu", "Booba", "Damso", "Orelsan", "Bigflo & Oli", "Lomepal", "Sch", "Jul"],
    "2020s": ["Drake", "Kendrick Lamar", "Travis Scott", "Lil Nas X", "Doja Cat", "Megan Thee Stallion", "Cardi B", "DaBaby", "Jack Harlow", "Ninho", "Werenoi", "Damso", "Sch", "Gazo", "Tiakola", "Niska", "Booba", "Central Cee", "Hamza", "SDM"],
  },

  "Rock": {
    "50s":   ["Chuck Berry", "Little Richard", "Jerry Lee Lewis", "Buddy Holly", "Ritchie Valens"],
    "60s":   ["The Beatles", "The Rolling Stones", "Led Zeppelin", "The Who", "The Doors", "Pink Floyd", "Jimi Hendrix", "The Beach Boys", "The Kinks", "Janis Joplin"],
    "70s":   ["Led Zeppelin", "Pink Floyd", "Queen", "AC/DC", "Aerosmith", "Fleetwood Mac", "The Rolling Stones", "Eagles", "Black Sabbath", "Deep Purple", "David Bowie", "Lynyrd Skynyrd", "Genesis"],
    "80s":   ["Bon Jovi", "Guns N' Roses", "U2", "The Police", "Dire Straits", "Bruce Springsteen", "Van Halen", "Def Leppard", "AC/DC", "Aerosmith", "The Cure", "The Smiths", "R.E.M.", "Journey"],
    "90s":   ["Nirvana", "Pearl Jam", "Red Hot Chili Peppers", "Radiohead", "Oasis", "Foo Fighters", "Green Day", "U2", "The Smashing Pumpkins", "Soundgarden", "Blur", "Lenny Kravitz", "The Cranberries"],
    "2000s": ["Linkin Park", "Coldplay", "Muse", "The Killers", "Arctic Monkeys", "Foo Fighters", "Red Hot Chili Peppers", "Green Day", "System of a Down", "Evanescence", "The White Stripes", "Kings of Leon", "Nickelback"],
    "2010s": ["Imagine Dragons", "Arctic Monkeys", "Twenty One Pilots", "Coldplay", "Muse", "Royal Blood", "Foo Fighters", "Foster the People", "The Black Keys", "Tame Impala", "Greta Van Fleet"],
    "2020s": ["Måneskin", "Imagine Dragons", "Twenty One Pilots", "Arctic Monkeys", "Wet Leg", "Fontaines D.C.", "The Last Dinner Party", "Inhaler"],
  },

  "Soul & Funk": {
    "60s":   ["Aretha Franklin", "Otis Redding", "Marvin Gaye", "Stevie Wonder", "James Brown", "The Temptations", "Sam Cooke", "Etta James"],
    "70s":   ["Stevie Wonder", "Marvin Gaye", "Al Green", "Curtis Mayfield", "Earth Wind & Fire", "The Jackson 5", "Donny Hathaway", "Parliament-Funkadelic", "Sly and the Family Stone", "Kool & the Gang"],
    "80s":   ["Whitney Houston", "Anita Baker", "Luther Vandross", "Sade", "Lionel Richie", "Prince", "Rick James", "Cameo", "Chaka Khan"],
    "90s":   ["Erykah Badu", "D'Angelo", "Lauryn Hill", "Maxwell", "Jamiroquai", "Macy Gray"],
    "2000s": ["Alicia Keys", "John Legend", "Amy Winehouse", "Joss Stone", "India.Arie", "Sharon Jones"],
    "2010s": ["Leon Bridges", "Sam Smith", "Anderson .Paak", "Bruno Mars", "Mark Ronson", "Janelle Monáe"],
    "2020s": ["Leon Bridges", "Anderson .Paak", "Lizzo", "Silk Sonic", "Jon Batiste"],
  },

  "Électro": {
    "70s":   ["Kraftwerk", "Jean-Michel Jarre", "Giorgio Moroder", "Tangerine Dream"],
    "80s":   ["Depeche Mode", "New Order", "Pet Shop Boys", "Kraftwerk", "Yellow Magic Orchestra"],
    "90s":   ["Daft Punk", "The Prodigy", "Chemical Brothers", "Fatboy Slim", "Massive Attack", "Air", "Moby", "Faithless", "Aphex Twin"],
    "2000s": ["Daft Punk", "Justice", "David Guetta", "Tiesto", "Armin van Buuren", "Calvin Harris", "Deadmau5", "Bob Sinclar", "Eric Prydz", "Benny Benassi"],
    "2010s": ["David Guetta", "Calvin Harris", "Avicii", "Skrillex", "Martin Garrix", "Major Lazer", "Disclosure", "Diplo", "Marshmello", "Kygo", "DJ Snake", "Swedish House Mafia", "The Chainsmokers"],
    "2020s": ["Fred again..", "Calvin Harris", "David Guetta", "ODESZA", "Fisher", "John Summit", "Peggy Gou", "Anyma", "Charlotte de Witte"],
  },

  "Variété FR": {
    "50s":   ["Edith Piaf", "Charles Trenet", "Georges Brassens", "Dalida", "Henri Salvador"],
    "60s":   ["Johnny Hallyday", "Charles Aznavour", "Jacques Brel", "Serge Gainsbourg", "Françoise Hardy", "France Gall", "Sylvie Vartan", "Claude François", "Adamo", "Sheila"],
    "70s":   ["Michel Sardou", "Joe Dassin", "Serge Gainsbourg", "Jacques Dutronc", "Renaud", "Eddy Mitchell", "Mike Brant", "Sheila", "Véronique Sanson", "Daniel Balavoine", "Maxime Le Forestier"],
    "80s":   ["Jean-Jacques Goldman", "Mylène Farmer", "Étienne Daho", "Indochine", "Téléphone", "Les Rita Mitsouko", "Daniel Balavoine", "France Gall", "Michel Berger", "Patrick Bruel", "Charles Aznavour", "Francis Cabrel"],
    "90s":   ["Mylène Farmer", "Patrick Bruel", "Francis Cabrel", "Patricia Kaas", "Lara Fabian", "Céline Dion", "Garou", "Florent Pagny", "Jean-Jacques Goldman", "Pascal Obispo", "Zazie", "Axelle Red"],
    "2000s": ["Calogero", "Christophe Maé", "M. Pokora", "Jenifer", "Lorie", "Grégory Lemarchal", "Yannick Noah", "Bénabar", "Cali", "Camille", "Raphaël", "Olivia Ruiz"],
    "2010s": ["Stromae", "Indila", "Christine and the Queens", "Maître Gims", "Black M", "Kendji Girac", "Vianney", "Louane", "Soprano", "Amir", "M. Pokora", "Vitaa", "Slimane", "Julien Doré"],
    "2020s": ["Aya Nakamura", "Angèle", "Clara Luciani", "Pomme", "Vianney", "Slimane", "Soprano", "Kendji Girac", "Hoshi", "Pierre de Maere", "Zaho de Sagazan", "Santa", "Julien Granel"],
  },

  "Jazz": {
    "40s-50s": ["Louis Armstrong", "Duke Ellington", "Charlie Parker", "Ella Fitzgerald", "Billie Holiday", "Nat King Cole"],
    "60s":   ["Miles Davis", "John Coltrane", "Bill Evans", "Stan Getz", "Wes Montgomery", "Thelonious Monk", "Sonny Rollins", "Cannonball Adderley", "Nina Simone", "Dave Brubeck"],
    "70s":   ["Herbie Hancock", "Weather Report", "Chick Corea", "Pat Metheny", "Keith Jarrett", "Miles Davis", "George Benson"],
    "80s":   ["Wynton Marsalis", "Pat Metheny", "Chick Corea", "Keith Jarrett", "Bobby McFerrin"],
    "90s":   ["Diana Krall", "Norah Jones", "Joshua Redman", "Chick Corea", "Brad Mehldau"],
    "2000s": ["Norah Jones", "Diana Krall", "Michael Bublé", "Esperanza Spalding", "Jamie Cullum"],
    "2010s": ["Kamasi Washington", "Robert Glasper", "Snarky Puppy", "Esperanza Spalding", "Gregory Porter", "Ibrahim Maalouf"],
    "2020s": ["Samara Joy", "Laufey", "Robert Glasper", "Kamasi Washington", "Jon Batiste"],
  },

  "Metal": {
    "70s":   ["Black Sabbath", "Deep Purple", "Judas Priest", "Iron Maiden"],
    "80s":   ["Iron Maiden", "Metallica", "Megadeth", "Slayer", "Anthrax", "Motörhead", "Pantera"],
    "90s":   ["Metallica", "Slipknot", "Korn", "Tool", "System of a Down", "Pantera", "Sepultura", "Rammstein", "Marilyn Manson"],
    "2000s": ["System of a Down", "Slipknot", "Avenged Sevenfold", "Lamb of God", "Mastodon", "Disturbed", "Five Finger Death Punch", "Bullet for My Valentine"],
    "2010s": ["Ghost", "Slipknot", "Mastodon", "Architects", "Bring Me the Horizon", "Gojira", "Sabaton"],
    "2020s": ["Sleep Token", "Ghost", "Bring Me the Horizon", "Spiritbox", "Bad Omens", "Lorna Shore"],
  },

  "Musique de Film": {
    "60s":   ["Ennio Morricone", "Henry Mancini", "John Barry", "Lalo Schifrin"],
    "70s":   ["John Williams", "Nino Rota", "Vangelis", "Giorgio Moroder", "Bill Conti"],
    "80s":   ["John Williams", "Hans Zimmer", "Danny Elfman", "Alan Silvestri", "Joe Hisaishi", "Vangelis"],
    "90s":   ["Hans Zimmer", "James Horner", "Howard Shore", "Thomas Newman", "James Newton Howard"],
    "2000s": ["Howard Shore", "Hans Zimmer", "Alexandre Desplat", "Michael Giacchino", "Harry Gregson-Williams"],
    "2010s": ["Ludwig Göransson", "Justin Hurwitz", "Max Richter", "Jóhann Jóhannsson", "Hans Zimmer"],
    "2020s": ["Ludwig Göransson", "Nicholas Britell", "Trent Reznor & Atticus Ross", "Hildur Guðnadóttir"],
  },

  "Reggae & Latino": {
    "70s":   ["Bob Marley", "Peter Tosh", "Jimmy Cliff", "Lee Scratch Perry"],
    "80s":   ["Bob Marley", "UB40", "Eddy Grant", "Black Uhuru"],
    "90s":   ["Shaggy", "Inner Circle", "Ricky Martin", "Enrique Iglesias", "Selena", "Shakira"],
    "2000s": ["Sean Paul", "Shaggy", "Damian Marley", "Daddy Yankee", "Juanes", "Don Omar"],
    "2010s": ["J Balvin", "Maluma", "Nicky Jam", "Bad Bunny", "Ozuna", "Luis Fonsi"],
    "2020s": ["Bad Bunny", "Karol G", "Rosalía", "Rauw Alejandro", "Peso Pluma", "Koffee"],
  },

  "Country & Blues": {
    "60s":   ["Johnny Cash", "Dolly Parton", "B.B. King", "Muddy Waters", "Jimi Hendrix"],
    "70s":   ["Dolly Parton", "Willie Nelson", "Kenny Rogers", "B.B. King", "Eric Clapton"],
    "80s":   ["Garth Brooks", "George Strait", "Stevie Ray Vaughan", "Robert Cray"],
    "90s":   ["Shania Twain", "Garth Brooks", "Faith Hill", "Tim McGraw", "Buddy Guy"],
    "2000s": ["Carrie Underwood", "Keith Urban", "Taylor Swift", "Joe Bonamassa", "John Mayer"],
    "2010s": ["Luke Bryan", "Chris Stapleton", "Kacey Musgraves", "Gary Clark Jr."],
    "2020s": ["Morgan Wallen", "Luke Combs", "Zach Bryan", "Lainey Wilson"],
  }
};