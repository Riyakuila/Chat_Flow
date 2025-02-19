import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },
}));

// Initialize theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
document.querySelector('html').setAttribute('data-theme', savedTheme);
document.documentElement.setAttribute('data-theme', savedTheme); 