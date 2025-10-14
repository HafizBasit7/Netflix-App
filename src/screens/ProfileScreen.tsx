// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../theme/ThemeProvider';
// import { NetflixFonts, NetflixMetrics } from '../styles/theme';

// const ProfileScreen = () => {
//   const { isDarkMode, toggleTheme, colors } = useTheme();
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   // Default profile image - you can replace with your own image
//   const defaultProfileImage = require('../assets/images/profile.png');

//   const ProfileSection = ({ title, children }: any) => (
//     <View style={styles.section}>
//       <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
//       <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
//         {children}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView 
//       style={[styles.container, { backgroundColor: colors.background }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header */}
//       <LinearGradient
//         colors={[colors.primary, colors.primaryDark]}
//         style={styles.header}
//       >
//         <View style={styles.avatarContainer}>
//           <View style={styles.avatar}>
//             {/* <Text style={styles.avatarText}>P</Text> */}
//             <Image 
//                   source={defaultProfileImage}
//                   style={styles.avatarImage}
//                   resizeMode="cover"
//                 />
//           </View>
//         </View>
//         <Text style={styles.profileName}>Netflix</Text>
//       </LinearGradient>

//       {/* Theme Toggle Section */}
//       <ProfileSection title="Appearance">
//         <View style={styles.themeRow}>
//           <View style={styles.themeInfo}>
//             <Icon 
//               name={isDarkMode ? "moon" : "sunny"} 
//               size={24} 
//               color={colors.primary} 
//             />
//             <View style={styles.themeText}>
//               <Text style={[styles.themeTitle, { color: colors.text }]}>
//                 Dark Mode
//               </Text>
//               <Text style={[styles.themeSubtitle, { color: colors.textMuted }]}>
//                 {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
//               </Text>
//             </View>
//           </View>
//           <Switch
//             value={isDarkMode}
//             onValueChange={toggleTheme}
//             trackColor={{ false: colors.border, true: colors.primary }}
//             thumbColor={colors.background}
//             ios_backgroundColor={colors.border}
//           />
//         </View>
//       </ProfileSection>

//       {/* Account Settings */}
//       <ProfileSection title="Account">
//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="person-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         {/* <TouchableOpacity style={styles.menuItem}>
//           <Icon name="notifications-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity> */}

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="lock-closed-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Privacy</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>
//       </ProfileSection>

//       {/* App Info */}
//       <ProfileSection title="About">
//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="information-circle-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>App Info</Text>
//           <Text style={[styles.menuValue, { color: colors.textMuted }]}>v1.0.0</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="shield-checkmark-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Terms of Service</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="document-text-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Privacy Policy</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>
//       </ProfileSection>

//       {/* Support */}
//       <ProfileSection title="Support">
//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="help-circle-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="star-outline" size={24} color={colors.text} />
//           <Text style={[styles.menuText, { color: colors.text }]}>Rate the App</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>
//       </ProfileSection>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: NetflixMetrics.padding * 2,
//     paddingTop: NetflixMetrics.padding * 3,
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     marginBottom: NetflixMetrics.margin,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60,
//   },
//   avatarText: {
//     color: '#FFFFFF',
//     fontSize: 32,
//     fontWeight: 'bold',
//     fontFamily: NetflixFonts.bold,
//   },
//   profileName: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//     fontFamily: NetflixFonts.bold,
//   },
//   section: {
//     marginVertical: NetflixMetrics.margin,
//     paddingHorizontal: NetflixMetrics.padding,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: NetflixMetrics.margin / 2,
//     fontFamily: NetflixFonts.bold,
//   },
//   sectionContent: {
//     borderRadius: NetflixMetrics.borderRadius,
//     overflow: 'hidden',
//   },
//   themeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: NetflixMetrics.padding,
//   },
//   themeInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   themeText: {
//     marginLeft: NetflixMetrics.padding,
//     flex: 1,
//   },
//   themeTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: NetflixFonts.bold,
//     marginBottom: 2,
//   },
//   themeSubtitle: {
//     fontSize: 12,
//     fontFamily: NetflixFonts.regular,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: NetflixMetrics.padding,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//     marginLeft: NetflixMetrics.padding,
//     fontFamily: NetflixFonts.regular,
//   },
//   menuValue: {
//     fontSize: 14,
//     fontFamily: NetflixFonts.regular,
//   },
// });

// export default ProfileScreen;


// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// import { useTheme } from '../theme/ThemeProvider';
// import { useAuth } from '../context/AuthContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// const ProfileScreen: React.FC = () => {
//   const { colors } = useTheme();
//   const { user, signOut } = useAuth();
//   const navigation = useNavigation();

//   const defaultProfileImage = require('../assets/images/profile.png');

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await signOut();
//           }
//         }
//       ]
//     );
//   };

//   const styles = createStyles(colors);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Profile</Text>
//       </View>

//       <View style={styles.profileSection}>
//         <View style={styles.avatar}>
//           {/* <Text style={styles.avatarText}>
//             {user?.email?.charAt(0).toUpperCase() || 'U'}
//           </Text> */}
//           <Image
//             source={defaultProfileImage}
//             style={styles.avatarImage}
//             resizeMode="cover"
//           />
//         </View>
//         <Text style={styles.email}>{user?.email}</Text>
//       </View>

//       <View style={styles.menuSection}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Subscription')}
//           style={styles.menuItem}
//         >
//           <Icon name="card-outline" size={24} color={colors.text} />
//           <Text style={styles.menuText}>Plan Subscription</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="person-outline" size={24} color={colors.text} />
//           <Text style={styles.menuText}>Account Settings</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="notifications-outline" size={24} color={colors.text} />
//           <Text style={styles.menuText}>Notifications</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="lock-closed-outline" size={24} color={colors.text} />
//           <Text style={styles.menuText}>Privacy & Security</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Icon name="help-circle-outline" size={24} color={colors.text} />
//           <Text style={styles.menuText}>Help & Support</Text>
//           <Icon name="chevron-forward" size={20} color={colors.textMuted} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.menuItem, styles.logoutItem]}
//           onPress={handleLogout}
//         >
//           <Icon name="log-out-outline" size={24} color="#e50914" />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const createStyles = (colors: any) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     padding: 20,
//     paddingTop: 60,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.text,
//   },
//   profileSection: {
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.cardBackground,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   avatarText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   email: {
//     fontSize: 16,
//     color: colors.textSecondary,
//   },
//   menuSection: {
//     padding: 20,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.cardBackground,
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//     color: colors.text,
//     marginLeft: 15,
//   },
//   logoutItem: {
//     marginTop: 20,
//     borderBottomWidth: 0,
//   },
//   logoutText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#e50914',
//     marginLeft: 15,
//     fontWeight: '600',
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60,
//   },
// });

// export default ProfileScreen;



// ProfileScreen.tsx - updated with react-native-image-picker
// ProfileScreen.tsx - using simple approach
import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, Image, 
  ActivityIndicator, Modal, Platform 
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useImagePicker } from '../hooks/useImagePicker'; // Import the actual hook

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user, signOut, uploadProfileImage, deleteProfileImage } = useAuth();
  const navigation = useNavigation();
  const [showImageOptions, setShowImageOptions] = useState(false);
  const { pickImage, loading } = useImagePicker(); // Use the actual hook

  const defaultProfileImage = require('../assets/images/profile.png');

  // In ProfileScreen - add this useEffect to debug
useEffect(() => {
  console.log('👤 Current user in ProfileScreen:', {
    user: user,
    profileImage: user?.profileImage,
    hasProfileImage: !!user?.profileImage
  });
}, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const showImagePickerOptions = () => {
    setShowImageOptions(true);
  };

  const handleImageSelection = async (method: 'camera' | 'gallery') => {
    setShowImageOptions(false);
    
    const imageData = await pickImage(method);
    if (imageData) {
      try {
        await uploadProfileImage(imageData);
        Alert.alert('Success', 'Profile image updated successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Failed to upload profile image');
      }
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Profile Image',
      'Are you sure you want to remove your profile image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfileImage();
              Alert.alert('Success', 'Profile image removed successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to remove profile image');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={showImagePickerOptions}
          disabled={loading}
        >
          <View style={styles.avatar}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={defaultProfileImage}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </View>
          <View style={styles.editIcon}>
            <Icon name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.email}>{user?.email}</Text>
        {user?.name && <Text style={styles.name}>{user.name}</Text>}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Subscription' as never)}
          style={styles.menuItem}
        >
          <Icon name="card-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Plan Subscription</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Account Settings</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Notifications</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="lock-closed-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Privacy & Security</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={24} color="#e50914" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal
        visible={showImageOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Profile Image</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImageSelection('gallery')}
              disabled={loading}
            >
              <Icon name="images-outline" size={24} color={colors.text} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImageSelection('camera')}
              disabled={loading}
            >
              <Icon name="camera-outline" size={24} color={colors.text} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            {user?.profileImage && (
              <TouchableOpacity 
                style={[styles.modalOption, styles.removeOption]}
                onPress={handleRemoveImage}
                disabled={loading}
              >
                <Icon name="trash-outline" size={24} color="#e50914" />
                <Text style={styles.removeOptionText}>Remove Current Image</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowImageOptions(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Keep your existing styles (they remain the same)
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#e50914',
    marginLeft: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
    flex: 1,
  },
  removeOption: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  removeOptionText: {
    fontSize: 16,
    color: '#e50914',
    marginLeft: 15,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});

export default ProfileScreen;