export function scoreAnswer(answer, round) {
  const a  = answer.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const t  = round.title.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const ar = round.artist.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const hasTitle  = a.includes(t.split(" ")[0])  || t.includes(a.split(" ")[0]);
  const hasArtist = a.includes(ar.split(" ")[0]) || ar.split(" ").some(w => a.includes(w));
  if (hasTitle && hasArtist) return 100;
  if (hasTitle || hasArtist) return 50;
  return 0;
}