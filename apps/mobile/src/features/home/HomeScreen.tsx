import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../../theme';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swape</Text>
      <Text style={styles.subtitle}>Le recrutement, en un swipe.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  title: { fontSize: 40, fontWeight: '700', color: colors.primary },
  subtitle: { fontSize: 16, color: colors.textMuted },
});
