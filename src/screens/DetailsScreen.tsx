import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { TMDBService } from '../services/tmdbApi';
import { FavoritesService } from '../services/favoritesService';
import { MovieDetails, Video, Movie } from '../types';
import { NetflixColors, NetflixFonts, NetflixMetrics } from '../styles/theme';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }: any) => {
    const {colors} = useTheme();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkIfFavorite();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const [detailsRes, similarRes, videosRes] = await Promise.all([
        TMDBService.getMovieDetails(movieId),
        TMDBService.getSimilarMovies(movieId),
        TMDBService.getMovieVideos(movieId),
      ]);

      setMovie(detailsRes.data);
      setSimilarMovies(similarRes.data.results.slice(0, 10));
      setVideos(videosRes.data.results.filter((video: Video) => video.site === 'YouTube'));
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favoriteStatus = await FavoritesService.isFavorite(movieId);
      setIsFavorite(favoriteStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const playTrailer = () => {
    const trailer = videos.find(video => video.type === 'Trailer');
    if (trailer) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    }
  };

  const shareMovie = async () => {
    if (!movie) return;
    
    try {
      // Create a proper share message with the URL included in the text
      const shareMessage = `Check out "${movie.title}" on Netflix Clone!\nRating: ${movie.vote_average}/10\n\nhttps://www.themoviedb.org/movie/${movie.id}`;
      
      await Share.share({
        message: shareMessage,
        title: `Share ${movie.title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share movie. Please try again.');
    }
  };

  const toggleFavorite = async () => {
    if (!movie) return;
    
    setFavoriteLoading(true);
    try {
      const movieBasic: Movie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genres.map(genre => genre.id),
      };

      const newFavoriteStatus = await FavoritesService.toggleFavorite(movieBasic);
      setIsFavorite(newFavoriteStatus);
      
      // Show feedback to user
      if (newFavoriteStatus) {
        Alert.alert('Added to My List', `${movie.title} has been added to your favorites.`);
      } else {
        Alert.alert('Removed from My List', `${movie.title} has been removed from your favorites.`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NetflixColors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading movie details...</Text>
      </View>
    );
  }

  const trailer = videos.find(video => video.type === 'Trailer');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image with Gradient */}
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: TMDBService.getBackdropUrl(movie.backdrop_path) }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(20,20,20,0.8)', colors.background]}
          style={styles.backdropGradient}
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={NetflixColors.text} />
        </TouchableOpacity>

        {/* Favorite Button on Backdrop */}
        <TouchableOpacity 
          style={styles.favoriteBackdropButton}
          onPress={toggleFavorite}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color={NetflixColors.primary} />
          ) : (
            <Icon 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? NetflixColors.primary : NetflixColors.text} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{movie.title}</Text>
        
        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={[styles.year, { color: colors.text }]}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
          <Text style={[styles.dot, { color: colors.text }]}>•</Text>
          <Text style={[styles.runtime, { color: colors.text }]}>{movie.runtime} min</Text>
          <Text style={[styles.dot, { color: colors.text }]}>•</Text>
          <View style={styles.rating}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{movie.vote_average.toFixed(1)}</Text>
          </View>
        </View>

        {/* Genres */}
        <View style={styles.genres}>
          {movie.genres.map(genre => (
            <View key={genre.id} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.playButton, !trailer && styles.disabledButton]}
            onPress={playTrailer}
            disabled={!trailer}
          >
            <Icon 
              name={trailer ? "play" : "play-disabled"} 
              size={24} 
              color={NetflixColors.text} 
            />
            <Text style={styles.playButtonText}>
              {trailer ? 'Play Trailer' : 'No Trailer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? colors.primary : colors.text} 
              />
            )}
            <Text style={[styles.iconButtonText, { color: colors.text }]}>Favourite</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={shareMovie}
          >
            <Icon name="share-social-outline" size={24} color={colors.text} />
            <Text style={[styles.iconButtonText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Tagline */}
        {/* {movie.tagline && (
          <View style={styles.taglineSection}>
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          </View>
        )} */}

        {/* Overview */}
        <View style={styles.overviewSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <Text style={[styles.overview, { color: colors.text }]}>{movie.overview}</Text>
        </View>

        {/* Additional Info */}
        {/* <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{movie.status}</Text>
          </View>
          {movie.budget > 0 && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Budget</Text>
              <Text style={styles.infoValue}>${movie.budget.toLocaleString()}</Text>
            </View>
          )}
          {movie.revenue > 0 && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Revenue</Text>
              <Text style={styles.infoValue}>${movie.revenue.toLocaleString()}</Text>
            </View>
          )}
        </View> */}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>More Like This</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarMovies.map(similarMovie => (
                <TouchableOpacity
                  key={similarMovie.id}
                  style={styles.similarMovie}
                  onPress={() => {
                    navigation.push('Details', { 
                      movieId: similarMovie.id
                    });
                  }}
                >
                  <Image
                    source={{ uri: TMDBService.getImageUrl(similarMovie.poster_path) }}
                    style={styles.similarPoster}
                    resizeMode="cover"
                  />
                  <Text style={[styles.similarTitle, { color: colors.text }]} numberOfLines={2}>
                    {similarMovie.title}
                  </Text>
                  <View style={styles.similarRating}>
                    <Icon name="star" size={12} color="#FFD700" />
                    <Text style={[styles.similarRatingText, { color: colors.text }]}>
                      {similarMovie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NetflixColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NetflixColors.background,
  },
  loadingText: {
    color: NetflixColors.text,
    marginTop: NetflixMetrics.margin,
    fontSize: 16,
  },
  backdropContainer: {
    height: 400,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: NetflixMetrics.padding,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteBackdropButton: {
    position: 'absolute',
    top: 50,
    right: NetflixMetrics.padding,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: NetflixMetrics.padding,
    marginTop: -50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NetflixColors.text,
    marginBottom: NetflixMetrics.margin,
    fontFamily: NetflixFonts.bold,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: NetflixMetrics.margin,
  },
  year: {
    color: NetflixColors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dot: {
    color: NetflixColors.textMuted,
    marginHorizontal: 8,
  },
  runtime: {
    color: NetflixColors.text,
    fontSize: 14,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: NetflixColors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: NetflixMetrics.margin,
  },
  genreTag: {
    backgroundColor: NetflixColors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: NetflixColors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: NetflixMetrics.margin * 2,
    paddingHorizontal: NetflixMetrics.padding,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NetflixColors.primary,
    paddingHorizontal: 16, 
    paddingVertical: 10,   
    borderRadius: NetflixMetrics.borderRadius,
    flex: 0.7,            
    marginRight: NetflixMetrics.margin,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: NetflixColors.cardBackground,
    opacity: 0.6,
  },
  playButtonText: {
    color: NetflixColors.text,
    fontSize: 14,          
    fontWeight: 'bold',
    marginLeft: 6,         
    fontFamily: NetflixFonts.bold,
  },
  iconButton: {
    alignItems: 'center',
    padding: 8,            
    minWidth: 50,          
    flex: 0.15,            
  },
  iconButtonText: {
    color: NetflixColors.text,
    fontSize: 12,          
    marginTop: 4,
    fontFamily: NetflixFonts.regular,
  },
  taglineSection: {
    marginBottom: NetflixMetrics.margin * 2,
    paddingHorizontal: NetflixMetrics.padding,
  },
  tagline: {
    color: NetflixColors.textMuted,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: NetflixFonts.light,
  },
  overviewSection: {
    marginBottom: NetflixMetrics.margin * 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NetflixColors.text,
    marginBottom: NetflixMetrics.margin,
    fontFamily: NetflixFonts.bold,
  },
  overview: {
    color: NetflixColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: NetflixFonts.regular,
  },
  additionalInfo: {
    marginBottom: NetflixMetrics.margin * 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: NetflixColors.cardBackground,
  },
  infoLabel: {
    color: NetflixColors.textMuted,
    fontSize: 14,
    fontFamily: NetflixFonts.regular,
  },
  infoValue: {
    color: NetflixColors.text,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
  similarSection: {
    marginBottom: NetflixMetrics.margin * 2,
  },
  similarMovie: {
    width: 120,
    marginRight: NetflixMetrics.margin,
  },
  similarPoster: {
    width: 120,
    height: 160,
    borderRadius: NetflixMetrics.borderRadius,
  },
  similarTitle: {
    color: NetflixColors.text,
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
    fontFamily: NetflixFonts.bold,
  },
  similarRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  similarRatingText: {
    color: NetflixColors.text,
    fontSize: 11,
    marginLeft: 4,
    fontFamily: NetflixFonts.regular,
  },
});

export default DetailsScreen;