export type Theme = 'dark' | 'light';

export const THEME_CHANGE_EVENT = 'workspace-theme-change';
const THEME_STORAGE_KEY = 'inferencex-curve:theme:v1';

let currentTheme = readSavedTheme();
applyDocumentTheme();

export function getTheme(): Theme {
  return currentTheme;
}

export function setTheme(theme: Theme): void {
  if (theme === currentTheme) return;
  currentTheme = theme;
  applyDocumentTheme();
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function applyDocumentTheme(): void {
  document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  document.documentElement.classList.toggle('light', currentTheme === 'light');
}

function readSavedTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;

    // Preserve the preference from older InferenceX browser data.
    const legacy = JSON.parse(window.localStorage.getItem('inferencex-curve:user-data:v1') ?? 'null');
    if (legacy?.state?.theme === 'light') return 'light';
  } catch {
    // Use the default for unavailable storage or invalid saved data.
  }
  return 'dark';
}
