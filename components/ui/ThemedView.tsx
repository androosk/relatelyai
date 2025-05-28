import { View, ViewProps } from 'react-native';
import { useThemedStyles } from 'hooks/useTheming';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface';
  children: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'background',
  className = '',
  children,
  ...props
}) => {
  const styles = useThemedStyles();

  const variantStyle = variant === 'surface' ? styles.surface : styles.background;

  return (
    <View className={`${variantStyle} ${className}`} {...props}>
      {children}
    </View>
  );
};
