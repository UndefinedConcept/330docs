/**
 * @fileoverview This module defines a utility for managing the theme (dark/light) of the application.
 * @usage import theme from './theme'; // to access the current theme
 */
const theme = (() => {
  const localStorageTheme = localStorage?.getItem('theme') ?? '';
  if (['dark', 'light'].includes(localStorageTheme)) {
    return localStorageTheme;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
})();

if (theme === 'light') {
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.add('dark');
}

window.localStorage.setItem('theme', theme);

const handleToggleClick = () => {
  const element = document.documentElement;
  element.classList.toggle('dark');

  const isDark = element.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

document.getElementById('themeToggle')?.addEventListener('click', handleToggleClick);
