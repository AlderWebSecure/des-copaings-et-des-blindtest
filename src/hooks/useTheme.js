// src/hooks/useTheme.js
// Persiste le choix de thème en localStorage et l'applique

import { useState, useEffect, useCallback } from "react";
import { THEMES, applyTheme } from "../styles/themes";

const STORAGE_KEY = "blinddrop_theme";

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "retro";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((key) => {
    if (!THEMES[key]) return;
    localStorage.setItem(STORAGE_KEY, key);
    setThemeState(key);
  }, []);

  return { theme, setTheme, themeData: THEMES[theme] };
}