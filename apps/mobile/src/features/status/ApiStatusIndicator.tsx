import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { useApiHealth } from './api';

export function ApiStatusIndicator() {
  const { data, isPending, isError } = useApiHealth();

  if (isPending) {
    return (
      <View
        accessibilityRole="text"
        accessibilityLabel="Vérification de l'API"
        style={[styles.container, styles.pendingContainer]}
      >
        <View style={[styles.dot, styles.pendingDot]} />
        <Text style={[styles.text, styles.pendingText]}>{"Vérification de l'API..."}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        accessibilityRole="alert"
        accessibilityLabel="API indisponible"
        style={[styles.container, styles.errorContainer]}
      >
        <View style={[styles.dot, styles.errorDot]} />
        <Text style={[styles.text, styles.errorText]}>API indisponible</Text>
      </View>
    );
  }

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel="API ok"
      style={[styles.container, styles.successContainer]}
    >
      <View style={[styles.dot, styles.successDot]} />
      <Text style={[styles.text, styles.successText]}>
        API : ok{data.version ? ` (v${data.version})` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    minHeight: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  pendingContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pendingDot: {
    backgroundColor: colors.textMuted,
  },
  pendingText: {
    color: colors.textMuted,
  },
  successContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  successDot: {
    backgroundColor: colors.primary,
  },
  successText: {
    color: colors.primaryDeep,
  },
  errorContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
  },
  errorDot: {
    backgroundColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
  },
});
