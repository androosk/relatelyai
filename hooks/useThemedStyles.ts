import { useTheme } from 'components/contexts/ThemeContext';
type ThemedStyles = {
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentBg: string;
  actionBg: string;
  tipBg: string;
  border: string;
  inputBackground: string;
  inputText: string;
};

export const useThemedStyles = (): ThemedStyles => {
  const { isDarkMode } = useTheme();

  return {
    cardBackground: isDarkMode ? 'bg-charcoal/80' : 'bg-white/80',
    textPrimary: isDarkMode ? 'text-soft-gray' : 'text-charcoal',
    textSecondary: isDarkMode ? 'text-mauve-mist' : 'text-charcoal/70',
    accent: 'text-deep-plum',
    accentBg: 'bg-deep-plum',
    actionBg: isDarkMode ? 'bg-charcoal/60' : 'bg-soft-gray/80',
    tipBg: isDarkMode ? 'bg-mauve-mist/20' : 'bg-peach-sorbet/50',
    border: isDarkMode ? 'border-charcoal/50' : 'border-mauve-mist/30',
    inputBackground: isDarkMode ? 'bg-charcoal/60' : 'bg-white',
    inputText: isDarkMode ? 'text-soft-gray' : 'text-charcoal',
  };
};
