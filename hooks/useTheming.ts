import { useTheme } from 'components/contexts/ThemeContext';
export const useThemedStyles = () => {
  const { isDark } = useTheme();

  return {
    // Background colors
    background: isDark ? 'bg-[#1F1F23]' : 'bg-[#F4F1DE]',
    surface: isDark ? 'bg-[#2A2A2E]' : 'bg-white',

    // Text colors
    textHigh: isDark ? 'text-[#EEEEEE]' : 'text-[#333333]',
    textMed: isDark ? 'text-[#B3B3B8]' : 'text-[#666666]',

    // Theme colors
    primary: isDark ? 'bg-[#B36A82]' : 'bg-[#E58DAB]',
    primaryText: isDark ? 'text-[#B36A82]' : 'text-[#E58DAB]',
    secondary: isDark ? 'bg-[#D99A4B]' : 'bg-[#FFB85F]',
    secondaryText: isDark ? 'text-[#D99A4B]' : 'text-[#FFB85F]',
    accent: isDark ? 'bg-[#6B7C87]' : 'bg-[#88A0AE]',
    accentText: isDark ? 'text-[#6B7C87]' : 'text-[#88A0AE]',

    // Utility colors
    border: isDark ? 'border-[#3A3A3F]' : 'border-[#DDDDDD]',
    error: isDark ? 'text-[#C0392B]' : 'text-[#E74C3C]',
    errorBg: isDark ? 'bg-[#C0392B]' : 'bg-[#E74C3C]',

    // Icon colors (for lucide-react-native)
    iconPrimary: isDark ? '#B36A82' : '#E58DAB',
    iconSecondary: isDark ? '#B3B3B8' : '#666666',
    iconAccent: isDark ? '#6B7C87' : '#88A0AE',
  };
};
