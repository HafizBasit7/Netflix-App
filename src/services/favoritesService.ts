import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types';

const FAVORITES_KEY = '@netflix_favorites';

export const FavoritesService = {
  // Get all favorites
  getFavorites: async (): Promise<Movie[]> => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add movie to favorites
  addToFavorites: async (movie: Movie): Promise<boolean> => {
    try {
      const favorites = await FavoritesService.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, movie];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  // Remove movie from favorites
  removeFromFavorites: async (movieId: number): Promise<boolean> => {
    try {
      const favorites = await FavoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  // Check if movie is favorite
  isFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const favorites = await FavoritesService.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (movie: Movie): Promise<boolean> => {
    try {
      const isCurrentlyFavorite = await FavoritesService.isFavorite(movie.id);
      
      if (isCurrentlyFavorite) {
        await FavoritesService.removeFromFavorites(movie.id);
        return false;
      } else {
        await FavoritesService.addToFavorites(movie);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },
};