import { useState, useEffect } from 'react';

export type Theme = 'sakura' | 'ocean' | 'dark' | 'sunshine' | 'forest' | 'japan';

export interface ThemeConfig {
  id: Theme;
  name: string;
  emoji: string;
  colors: string[];
}

export const themes: ThemeConfig[] = [
  { id: 'sakura', name: 'Sakura', emoji: '🌸', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'ocean', name: 'Ocean Blue', emoji: '🌊', colors: ['#4A90E2', '#7BB3FF'] },
  { id: 'dark', name: 'Dark Mode', emoji: '🌙', colors: ['#9D4EDD', '#7209B7'] },
  { id: 'sunshine', name: 'Sunshine', emoji: '☀️', colors: ['#FFB347', '#FF8C00'] },
  { id: 'forest', name: 'Forest Green', emoji: '🌲', colors: ['#3CB371', '#2E8B57'] },
  { id: 'japan', name: 'Japanese Flag', emoji: '🎌', colors: ['#DC143C', '#FFFFFF'] },
];

const THEME_KEY = 'mext-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('sakura');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored && themes.some(t => t.id === stored)) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  return { theme, changeTheme, themes };
};
