// src/utils/scoring.js
// Scoring tolérant à la casse, aux accents, à la ponctuation

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // retire accents
    .replace(/[^a-z0-9 ]/g, " ")                       // ponctuation → espace
    .replace(/\s+/g, " ")                              // multi-espaces → un seul
    .trim();
}

// Distance de Levenshtein (pour gérer fautes de frappe)
function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[b.length][a.length];
}

// Match approximatif : retourne true si `needle` est très proche de `haystack`
function fuzzyMatch(needle, haystack) {
  if (!needle || !haystack) return false;
  if (haystack.includes(needle) || needle.includes(haystack)) return true;
  // Tolère 1-2 fautes pour les mots courts
  const dist = levenshtein(needle, haystack);
  const tol  = Math.max(1, Math.floor(Math.max(needle.length, haystack.length) / 6));
  return dist <= tol;
}

// Vérifie qu'au moins un mot significatif (>2 lettres) du needle matche
function hasMatchingWord(needle, haystack) {
  const needleWords   = needle.split(" ").filter(w => w.length > 2);
  const haystackWords = haystack.split(" ");
  return needleWords.some(nw =>
    haystackWords.some(hw => fuzzyMatch(nw, hw))
  );
}

export function scoreAnswer(answer, round) {
  const a  = normalize(answer);
  const t  = normalize(round.title);
  const ar = normalize(round.artist);

  if (!a) return 0;

  const titleMatch  = a.includes(t) || t.includes(a) || hasMatchingWord(a, t);
  const artistMatch = a.includes(ar) || ar.includes(a) || hasMatchingWord(a, ar);

  if (titleMatch && artistMatch) return 100;
  if (titleMatch || artistMatch) return 50;
  return 0;
}