// hooks/useImagePicker.ts
import { useState } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  const checkAndRequestPermissions = async (source: 'camera' | 'gallery'): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // iOS handles permissions differently
    }

    try {
      if (source === 'camera') {
        // Request camera permission
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to take photos',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );

        // For Android < 13, request storage permission for saving photos
        const androidVersion = Platform.Version;
        if (androidVersion < 33) {
          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs storage access to save photos',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            }
          );
          return cameraPermission === PermissionsAndroid.RESULTS.GRANTED && 
                 storagePermission === PermissionsAndroid.RESULTS.GRANTED;
        }

        return cameraPermission === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // For gallery access
        const androidVersion = Platform.Version;
        
        if (androidVersion >= 33) {
          // Android 13+ uses READ_MEDIA_IMAGES
          const mediaPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Media Permission',
              message: 'This app needs media access to select photos',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            }
          );
          return mediaPermission === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android < 13 uses READ_EXTERNAL_STORAGE
          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs storage access to select photos',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            }
          );
          return storagePermission === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const pickImage = async (source: 'camera' | 'gallery'): Promise<string | null> => {
    setLoading(true);
    
    try {
      const options: CameraOptions | ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
        saveToPhotos: false, // Set to true if you want to save to gallery
      };

      // Check and request permissions
      const hasPermission = await checkAndRequestPermissions(source);
      if (!hasPermission) {
        Alert.alert(
          'Permission Required', 
          `Please grant ${source === 'camera' ? 'camera and storage' : 'storage'} permissions in app settings to continue.`,
          [{ text: 'OK' }]
        );
        return null;
      }

      let response;

      if (source === 'camera') {
        response = await launchCamera(options);
      } else {
        response = await launchImageLibrary(options);
      }

      if (response.didCancel) {
        console.log('User cancelled image picker');
        return null;
      }

      if (response.errorCode) {
        console.error('Image picker error:', response.errorMessage);
        
        // Handle specific error cases
        if (response.errorCode === 'permission') {
          Alert.alert(
            'Permission Denied',
            'Please enable the required permissions in your device settings to use this feature.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', `Failed to select image: ${response.errorMessage}`);
        }
        return null;
      }

      if (response.assets && response.assets[0]?.base64) {
        const asset = response.assets[0];
        console.log('Image selected successfully');
        return `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
      }

      Alert.alert('Error', 'No image selected or image data is missing');
      return null;
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'An unexpected error occurred while selecting the image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    pickImage,
    loading,
  };
};