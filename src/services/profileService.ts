// services/profileService.ts - FIXED WITH PROPER TYPING
import api from './api';
import { User } from '../types/auth'; // Import the User type

class ProfileService {
  private baseUrl = '/profile';

// services/profileService.ts - ADD COMPREHENSIVE LOGGING
async uploadProfileImage(imageData: string): Promise<User> {
    try {
      console.log('📤 Sending image upload request...');
      
      const response = await api.post(`${this.baseUrl}/upload-image`, {
        image: imageData
      });
  
      console.log('🔍 FULL RESPONSE OBJECT:', JSON.stringify(response, null, 2));
      console.log('🔍 response.data:', response.data);
      console.log('🔍 response.data.data:', response.data.data);
      console.log('🔍 response.data.data.user:', response.data.data?.user);
      
      if (response.data.data && response.data.data.user) {
        const user = response.data.data.user;
        // console.log('🔍 User object keys:', Object.keys(user));
        // console.log('🔍 User object values:', user);
        // console.log('🔍 Profile image specifically:', user.profileImage);
        
        return user;
      }
      
      throw new Error('Unexpected response structure');
    } catch (error: any) {
      console.error('❌ Error uploading profile image:', error);
      throw error;
    }
  }

  async deleteProfileImage(): Promise<User> { // ← Return User type
    try {
      interface DeleteResponse {
        data: {
          user: User;
        };
        message: string;
        success: boolean;
      }

      const response = await api.delete<DeleteResponse>(`${this.baseUrl}/delete-image`);
      
      console.log('🗑️ Delete response user:', response.data.data.user);
      
      if (response.data.data && response.data.data.user) {
        return response.data.data.user;
      } else {
        throw new Error('Unexpected response structure from server');
      }
    } catch (error: any) {
      console.error('Error deleting profile image:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete profile image');
    }
  }

  async updateProfile(name: string): Promise<User> { // ← Return User type
    try {
      interface UpdateResponse {
        data: {
          user: User;
        };
        message: string;
        success: boolean;
      }

      const response = await api.put<UpdateResponse>(`${this.baseUrl}/update`, { name });
      
      if (response.data.data && response.data.data.user) {
        return response.data.data.user;
      } else {
        throw new Error('Unexpected response structure from server');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }
}

export default new ProfileService();