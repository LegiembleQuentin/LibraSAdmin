import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Initialisation du thème depuis le localStorage ou système
function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('light');

  return {
    subscribe,
    init: () => {
      if (browser) {
        const stored = localStorage.getItem('theme') as Theme;
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = stored || systemPreference;
        
        set(theme);
        applyTheme(theme);
        
        // Écouter les changements du système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            set(newTheme);
            applyTheme(newTheme);
          }
        });
      }
    },
    toggle: () => {
      update((theme) => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem('theme', newTheme);
          applyTheme(newTheme);
        }
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
      }
      set(theme);
    }
  };
}

function applyTheme(theme: Theme) {
  if (browser) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export const theme = createThemeStore(); 