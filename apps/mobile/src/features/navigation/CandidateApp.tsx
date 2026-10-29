import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { ApplicationsScreen } from '../applications/ApplicationsScreen';
import { useAuth } from '../auth/AuthContext';
import { LoginScreen } from '../auth/LoginScreen';
import { ChatScreen } from '../chat/ChatScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { SwipeScreen } from '../swipe/SwipeScreen';

export type TabKey = 'swipe' | 'applications' | 'chat' | 'profile';

export function CandidateApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('swipe');

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {activeTab === 'swipe' && <SwipeScreen />}
        {activeTab === 'applications' && <ApplicationsScreen />}
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      <View style={styles.tabBar} accessibilityRole="tablist">
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Swipe"
          accessibilityState={{ selected: activeTab === 'swipe' }}
          onPress={() => {
            setActiveTab('swipe');
          }}
          style={[styles.tabItem, activeTab === 'swipe' && styles.tabItemActive]}
          testID="tab-swipe"
        >
          <Text style={[styles.tabLabel, activeTab === 'swipe' && styles.tabLabelActive]}>
            Swipe
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Candidatures"
          accessibilityState={{ selected: activeTab === 'applications' }}
          onPress={() => {
            setActiveTab('applications');
          }}
          style={[styles.tabItem, activeTab === 'applications' && styles.tabItemActive]}
          testID="tab-applications"
        >
          <Text style={[styles.tabLabel, activeTab === 'applications' && styles.tabLabelActive]}>
            Candidatures
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Chat"
          accessibilityState={{ selected: activeTab === 'chat' }}
          onPress={() => {
            setActiveTab('chat');
          }}
          style={[styles.tabItem, activeTab === 'chat' && styles.tabItemActive]}
          testID="tab-chat"
        >
          <Text style={[styles.tabLabel, activeTab === 'chat' && styles.tabLabelActive]}>Chat</Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Profil"
          accessibilityState={{ selected: activeTab === 'profile' }}
          onPress={() => {
            setActiveTab('profile');
          }}
          style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
          testID="tab-profile"
        >
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Profil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  tabItem: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    marginHorizontal: spacing.xs,
  },
  tabItemActive: {
    backgroundColor: colors.background,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
