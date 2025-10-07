import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { NetflixFonts, NetflixMetrics } from '../styles/theme';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Default profile image - you can replace with your own image
  const defaultProfileImage = require('../assets/images/profile.png');

  const ProfileSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {/* <Text style={styles.avatarText}>P</Text> */}
            <Image 
                  source={defaultProfileImage}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
          </View>
        </View>
        <Text style={styles.profileName}>Netflix</Text>
      </LinearGradient>

      {/* Theme Toggle Section */}
      <ProfileSection title="Appearance">
        <View style={styles.themeRow}>
          <View style={styles.themeInfo}>
            <Icon 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.themeText}>
              <Text style={[styles.themeTitle, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.themeSubtitle, { color: colors.textMuted }]}>
                {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
            ios_backgroundColor={colors.border}
          />
        </View>
      </ProfileSection>

      {/* Account Settings */}
      <ProfileSection title="Account">
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="lock-closed-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Privacy</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ProfileSection>

      {/* App Info */}
      <ProfileSection title="About">
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="information-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>App Info</Text>
          <Text style={[styles.menuValue, { color: colors.textMuted }]}>v1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="shield-checkmark-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Terms of Service</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document-text-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Privacy Policy</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ProfileSection>

      {/* Support */}
      <ProfileSection title="Support">
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="star-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Rate the App</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ProfileSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: NetflixMetrics.padding * 2,
    paddingTop: NetflixMetrics.padding * 3,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: NetflixMetrics.margin,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
  section: {
    marginVertical: NetflixMetrics.margin,
    paddingHorizontal: NetflixMetrics.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: NetflixMetrics.margin / 2,
    fontFamily: NetflixFonts.bold,
  },
  sectionContent: {
    borderRadius: NetflixMetrics.borderRadius,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: NetflixMetrics.padding,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeText: {
    marginLeft: NetflixMetrics.padding,
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 12,
    fontFamily: NetflixFonts.regular,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: NetflixMetrics.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: NetflixMetrics.padding,
    fontFamily: NetflixFonts.regular,
  },
  menuValue: {
    fontSize: 14,
    fontFamily: NetflixFonts.regular,
  },
});

export default ProfileScreen;