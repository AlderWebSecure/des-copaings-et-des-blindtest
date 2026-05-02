// src/styles/themes.js
// 6 thèmes funky pour Blinddrop — chaque thème modifie l'ambiance complète

export const THEMES = {
  neon: {
    name: "Néon",
    emoji: "🌃",
    bg:        "#0a0e27",
    bgGradient: "radial-gradient(ellipse at top, #1a0e3e 0%, #0a0e27 60%)",
    card:      "#161937",
    card2:     "#1f2347",
    primary:   "#ff006e",       // pink néon
    secondary: "#ffbe0b",       // jaune électrique
    success:   "#06ffa5",       // vert néon
    info:      "#3a86ff",       // bleu vif
    text:      "#ffffff",
    text2:     "#ffffffcc",
    text3:     "#ffffff66",
    border:    "#ffffff15",
  },
  sunset: {
    name: "Coucher de soleil",
    emoji: "🌅",
    bg:        "#2d1b3d",
    bgGradient: "linear-gradient(180deg, #2d1b3d 0%, #1a1129 100%)",
    card:      "#3d2851",
    card2:     "#4a3162",
    primary:   "#ff6b35",       // orange chaud
    secondary: "#ffd23f",       // jaune doré
    success:   "#aaf683",       // vert lime
    info:      "#ee4266",       // rose corail
    text:      "#fff8f0",
    text2:     "#fff8f0cc",
    text3:     "#fff8f066",
    border:    "#ffffff15",
  },
  candy: {
    name: "Bonbon",
    emoji: "🍭",
    bg:        "#fef0f5",
    bgGradient: "linear-gradient(180deg, #fef0f5 0%, #f5d4e2 100%)",
    card:      "#ffffff",
    card2:     "#fbe0eb",
    primary:   "#ff4081",       // rose bonbon
    secondary: "#7c4dff",       // violet
    success:   "#00bfa5",       // turquoise
    info:      "#536dfe",       // bleu indigo
    text:      "#2d1b3d",
    text2:     "#2d1b3dcc",
    text3:     "#2d1b3d66",
    border:    "#2d1b3d15",
  },
  forest: {
    name: "Forêt",
    emoji: "🌲",
    bg:        "#0f1f1c",
    bgGradient: "radial-gradient(ellipse at top, #1a3530 0%, #0f1f1c 60%)",
    card:      "#1a3530",
    card2:     "#234740",
    primary:   "#52b788",       // vert forêt
    secondary: "#f4a261",       // orange terre
    success:   "#95d5b2",       // vert pâle
    info:      "#74c69d",       // vert sauge
    text:      "#f1faee",
    text2:     "#f1faeecc",
    text3:     "#f1faee66",
    border:    "#ffffff15",
  },
  retro: {
    name: "Rétro",
    emoji: "📼",
    bg:        "#1a1a2e",
    bgGradient: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
    card:      "#16213e",
    card2:     "#0f3460",
    primary:   "#e94560",       // rouge corail (thème actuel)
    secondary: "#ffd93d",       // jaune
    success:   "#6bcb77",       // vert
    info:      "#4d96ff",       // bleu
    text:      "#ffffff",
    text2:     "#ffffffaa",
    text3:     "#ffffff55",
    border:    "#ffffff15",
  },
  ocean: {
    name: "Océan",
    emoji: "🌊",
    bg:        "#001f3f",
    bgGradient: "linear-gradient(180deg, #001f3f 0%, #003566 100%)",
    card:      "#003566",
    card2:     "#0353a4",
    primary:   "#00d9ff",       // cyan vif
    secondary: "#ffd166",       // jaune sable
    success:   "#06d6a0",       // turquoise
    info:      "#118ab2",       // bleu turquoise
    text:      "#ffffff",
    text2:     "#ffffffcc",
    text3:     "#ffffff66",
    border:    "#ffffff15",
  },
};

export const THEME_KEYS = Object.keys(THEMES);

// Applique le thème en injectant des CSS variables dans <html>
export function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.retro;
  const root  = document.documentElement;
  root.style.setProperty("--bg",         theme.bg);
  root.style.setProperty("--bg-grad",    theme.bgGradient);
  root.style.setProperty("--card",       theme.card);
  root.style.setProperty("--card-2",     theme.card2);
  root.style.setProperty("--primary",    theme.primary);
  root.style.setProperty("--secondary",  theme.secondary);
  root.style.setProperty("--success",    theme.success);
  root.style.setProperty("--info",       theme.info);
  root.style.setProperty("--text",       theme.text);
  root.style.setProperty("--text-2",     theme.text2);
  root.style.setProperty("--text-3",     theme.text3);
  root.style.setProperty("--border",     theme.border);
  document.body.style.background = theme.bgGradient || theme.bg;
}