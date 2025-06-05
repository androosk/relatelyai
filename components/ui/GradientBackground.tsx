import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

type GradientBackgroundProps = {
  children: React.ReactNode;
  style?: any;
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
  const { isDarkMode } = useTheme();

  const lightColors = ['#E3FAFA', '#E0D5F5'] as const;
  const darkColors = ['#9DCAEB', '#7F4B6E'] as const;

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
};
