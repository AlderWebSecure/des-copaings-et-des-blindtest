// src/utils/roomCode.js
// Génère des codes room mémorables : MOT-NUMÉRO

const WORDS = [
  "KIWI","MANGO","TANGO","DISCO","FUNKY","ROCK","POP","JAZZ",
  "PUNK","SOUL","RAP","BEAT","DRUM","BASS","WAVE","ECHO",
  "VIBE","DROP","MIX","REMIX","DANCE","PARTY","NIGHT","STAR",
];

export function generateRoomCode() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num  = Math.floor(Math.random() * 89) + 10; // 10-99
  return `${word}-${num}`;
}

const COLORS = [
  "#ff6b6b","#ffd93d","#6bcb77","#4d96ff",
  "#c084fc","#f472b6","#fb923c","#22d3ee",
  "#a3e635","#f87171","#facc15","#34d399",
];

export function generatePlayerColor(existingColors = []) {
  const available = COLORS.filter(c => !existingColors.includes(c));
  return available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function generatePlayerId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}