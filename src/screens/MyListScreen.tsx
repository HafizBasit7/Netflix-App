import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { FavoritesService } from '../services/favoritesService';
import { TMDBService } from '../services/tmdbApi';
import { Movie } from '../types';
import { NetflixColors, NetflixFonts, NetflixMetrics } from '../styles/theme';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = (width - NetflixMetrics.padding * 3) / 2;

const MyListScreen = ({ navigation }: any) => {
    const {colors} = useTheme();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const isFocused = useIsFocused(); 

//   useEffect(() => {
//     loadFavorites();
//   }, []);
  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]); // Reload when screen comes into focus


  useEffect(() => {
    if (favorites.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const favoriteMovies = await FavoritesService.getFavorites();
      // Fix: Check if favoriteMovies exists before calling reverse()
      setFavorites(favoriteMovies ? favoriteMovies.reverse() : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load your favorites');
      setFavorites([]); // Ensure favorites is always an array
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

//   const removeFromFavorites = (movie: Movie) => {
//     Alert.alert(
//       'Remove from My List',
//       `Remove "${movie.title}" from your list?`,
//       [
//         { 
//           text: 'Cancel', 
//           style: 'cancel' 
//         },
//         { 
//           text: 'Remove', 
//           style: 'destructive',
//           onPress: () => confirmRemove(movie.id)
//         },
//       ]
//     );
//   };

//   const confirmRemove = async (movieId: number) => {
//     try {
//       const success = await FavoritesService.removeFromFavorites(movieId);
//       if (success) {
//         setFavorites(prev => prev.filter(movie => movie.id !== movieId));
//         // Show quick feedback
//         Alert.alert('Removed', 'Movie removed from your list', [{ text: 'OK' }]);
//       }
//     } catch (error) {
//       console.error('Error removing favorite:', error);
//       Alert.alert('Error', 'Failed to remove movie from your list');
//     }
//   };

//   const clearAllFavorites = () => {
//     if (favorites.length === 0) return;

//     Alert.alert(
//       'Clear All',
//       'Are you sure you want to remove all movies from your list?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Clear All', 
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               // Clear all favorites from AsyncStorage
//               await FavoritesService.clearAllFavorites();
//               setFavorites([]);
//               Alert.alert('Cleared', 'All movies removed from your list');
//             } catch (error) {
//               console.error('Error clearing favorites:', error);
//               Alert.alert('Error', 'Failed to clear your list');
//             }
//           }
//         },
//       ]
//     );
//   };

  const renderFavoriteItem = ({ item, index }: { item: Movie; index: number }) => (
    <Animated.View
      style={[
        styles.favoriteItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.posterContainer}
        onPress={() => navigation.navigate('Details', { 
          movieId: item.id
        })}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: TMDBService.getImageUrl(item.poster_path) }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        {/* Play overlay */}
        <View style={styles.playOverlay}>
          <Icon name="play" size={24} color={NetflixColors.text} />
        </View>

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
        </View>
      </TouchableOpacity>

      {/* Movie Info */}
      {/* <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieYear}>
          {new Date(item.release_date).getFullYear()}
        </Text> */}
        
        {/* Action Buttons */}
        {/* <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Details', { movieId: item.id })}
          >
            <Icon name="information-circle" size={20} color={NetflixColors.text} />
            <Text style={styles.actionButtonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => removeFromFavorites(item)}
          >
            <Icon name="trash-outline" size={18} color={NetflixColors.primary} />
            <Text style={[styles.actionButtonText, styles.removeButtonText]}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </Animated.View>
  );

  const renderGridHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My List</Text>
        {favorites.length > 0 && (
          <TouchableOpacity 
            style={styles.clearAllButton}
            // onPress={clearAllFavorites}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.clearAllText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* <View style={styles.headerSubtitleContainer}>
        <Icon name="heart" size={16} color={NetflixColors.primary} />
        <Text style={styles.itemCount}>
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your list
        </Text>
      </View> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <LinearGradient
          colors={[colors.background, '#1a1a1a']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={NetflixColors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading your favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.centerContainer, , { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={NetflixColors.background} />
        <LinearGradient
          colors={[colors.background, '#1a1a1a']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.emptyIllustration}>
          <Icon name="heart-dislike" size={80} color={NetflixColors.textMuted} />
          <View style={styles.plusIcon}>
            <Icon name="add" size={24} color={NetflixColors.primary} />
          </View>
        </View>

        <Text style={[styles.emptyTitle,{ color: colors.text }]}>Your List is Empty</Text>
        <Text style={[styles.emptySubtitle, { color: colors.text }]}>
          Add movies and TV shows to your list so you can easily find them later.
        </Text>
        
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[NetflixColors.primary, '#1a1a1a']}
            style={styles.browseButtonGradient}
          >
            <Icon name="film" size={20} color={NetflixColors.text} />
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={NetflixColors.background} />
      <LinearGradient
        colors={[colors.background, '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => `favorite-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderGridHeader}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    // backgroundColor: NetflixColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: NetflixMetrics.padding * 2,
  },
  loadingText: {
    color: NetflixColors.text,
    fontSize: 16,
    marginTop: NetflixMetrics.margin,
    fontFamily: NetflixFonts.regular,
  },
  header: {
    padding: NetflixMetrics.padding,
    paddingBottom: NetflixMetrics.padding * 1.5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NetflixMetrics.margin / 2,
  },
  headerTitle: {
    color: NetflixColors.text,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
  clearAllButton: {
    paddingHorizontal: NetflixMetrics.padding,
    paddingVertical: 6,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderRadius: NetflixMetrics.borderRadius,
  },
  clearAllText: {
    color: NetflixColors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
//   headerSubtitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   itemCount: {
//     color: NetflixColors.textMuted,
//     fontSize: 14,
//     marginLeft: 6,
//     fontFamily: NetflixFonts.regular,
//   },
  gridContainer: {
    padding: NetflixMetrics.padding,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: NetflixMetrics.margin,
  },
  favoriteItem: {
    width: POSTER_WIDTH,
    backgroundColor: NetflixColors.cardBackground,
    borderRadius: NetflixMetrics.borderRadius,
    overflow: 'hidden',
  },
  posterContainer: {
    width: '100%',
    height: POSTER_WIDTH * 1.5,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: NetflixColors.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
    fontFamily: NetflixFonts.bold,
  },
  movieInfo: {
    padding: NetflixMetrics.padding,
  },
  movieTitle: {
    color: NetflixColors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: NetflixFonts.bold,
    lineHeight: 18,
  },
  movieYear: {
    color: NetflixColors.textMuted,
    fontSize: 12,
    marginBottom: NetflixMetrics.margin,
    fontFamily: NetflixFonts.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: NetflixColors.text,
    fontSize: 10,
    marginLeft: 4,
    fontFamily: NetflixFonts.regular,
  },
  removeButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  removeButtonText: {
    color: NetflixColors.primary,
    fontWeight: 'bold',
  },
  emptyIllustration: {
    position: 'relative',
    marginBottom: NetflixMetrics.margin * 2,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: NetflixColors.background,
    borderRadius: 12,
    padding: 4,
  },
  emptyTitle: {
    color: NetflixColors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: NetflixMetrics.margin,
    textAlign: 'center',
    fontFamily: NetflixFonts.bold,
  },
  emptySubtitle: {
    color: NetflixColors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: NetflixMetrics.margin * 2,
    fontFamily: NetflixFonts.regular,
    paddingHorizontal: NetflixMetrics.padding,
  },
  browseButton: {
    width: '80%',
    borderRadius: NetflixMetrics.borderRadius,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: NetflixMetrics.padding,
    paddingHorizontal: NetflixMetrics.padding * 2,
  },
  browseButtonText: {
    color: NetflixColors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: NetflixFonts.bold,
  },
});

export default MyListScreen;