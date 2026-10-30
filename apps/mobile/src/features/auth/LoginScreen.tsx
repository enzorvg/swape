import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Button, TextField } from '../../shared/ui';
import { colors, radius, spacing } from '../../theme';
import { useAuth } from './AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleSubmit = () => {
    let hasError = false;

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Veuillez renseigner une adresse email valide');
      hasError = true;
    } else {
      setEmailError(undefined);
    }

    if (!password.trim()) {
      setPasswordError('Veuillez renseigner votre mot de passe');
      hasError = true;
    } else {
      setPasswordError(undefined);
    }

    if (!hasError) {
      login();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Swape</Text>
          <Text style={styles.subtitle}>Connexion candidat</Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Adresse email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(undefined);
            }}
            placeholder="candidat@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            testID="login-email-input"
          />

          <TextField
            label="Mot de passe"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(undefined);
            }}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            error={passwordError}
            testID="login-password-input"
          />

          <Button
            title="Se connecter"
            onPress={handleSubmit}
            variant="primary"
            testID="login-submit-button"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  form: {
    gap: spacing.md,
  },
});
