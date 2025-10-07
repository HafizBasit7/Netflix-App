import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TMDBService } from '../services/tmdbApi';
import { Movie } from '../types';
import { NetflixColors, NetflixFonts, NetflixMetrics } from '../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
const { width } = Dimensions.get('window');
import { useTheme } from '../theme/ThemeProvider';

const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default profile image - you can replace with your own image
  const defaultProfileImage = require('../assets/images/profile.png');

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-rotate featured movie every 5 seconds
  useEffect(() => {
    if (trending.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentFeaturedIndex(prev => 
          prev === trending.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Change every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [trending.length]);

  const fetchAllData = async () => {
    try {
      const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
        TMDBService.getTrendingMovies(),
        TMDBService.getPopularMovies(),
        TMDBService.getTopRatedMovies(),
        TMDBService.getUpcomingMovies(),
      ]);

      setTrending(trendingRes.data.results);
      setPopular(popularRes.data.results);
      setTopRated(topRatedRes.data.results);
      setUpcoming(upcomingRes.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manual navigation for featured movie
  const nextFeatured = () => {
    setCurrentFeaturedIndex(prev => 
      prev === trending.length - 1 ? 0 : prev + 1
    );
    // Reset timer when manually navigating
    resetTimer();
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex(prev => 
      prev === 0 ? trending.length - 1 : prev - 1
    );
    // Reset timer when manually navigating
    resetTimer();
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentFeaturedIndex(prev => 
        prev === trending.length - 1 ? 0 : prev + 1
      );
    }, 5000);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image
        source={{ uri: TMDBService.getImageUrl(item.poster_path) }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderCategory = (title: string, data: Movie[]) => (
    <View style={styles.categoryContainer}>
      <Text style={[styles.categoryTitle, { color: colors.text }]}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  const FeaturedMovie = trending[currentFeaturedIndex] ? (
    <View style={styles.featuredContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { 
          movieId: trending[currentFeaturedIndex].id 
        })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: TMDBService.getBackdropUrl(trending[currentFeaturedIndex].backdrop_path) }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        >
          <Text style={[styles.featuredTitle, { color: colors.text }]}>
            {trending[currentFeaturedIndex].title}
          </Text>
          <Text style={[styles.featuredOverview, { color: colors.text }]} numberOfLines={3}>
            {trending[currentFeaturedIndex].overview}
          </Text>
          
          {/* Play Button */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => navigation.navigate('Details', { 
              movieId: trending[currentFeaturedIndex].id 
            })}
          >
            <Icon name="play" size={20} color={colors.text} />
            <Text style={[styles.playButtonText, { color: colors.text }]}>Play</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Navigation Dots */}
      {trending.length > 1 && (
        <View style={styles.dotsContainer}>
          {trending.slice(0, 5).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentFeaturedIndex && styles.activeDot
              ]}
              onPress={() => {
                setCurrentFeaturedIndex(index);
                resetTimer();
              }}
            />
          ))}
        </View>
      )}

      {/* Navigation Arrows */}
      {trending.length > 1 && (
        <>
          <TouchableOpacity 
            style={[styles.navArrow, styles.leftArrow]}
            onPress={prevFeatured}
          >
            <Icon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navArrow, styles.rightArrow]}
            onPress={nextFeatured}
          >
            <Icon name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </>
      )}
    </View>
  ) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.background, colors.cardBackground]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header Section */}
      <View style={styles.header}>
        {/* Netflix Logo */}
        <Text style={[styles.netflixLogo, { color: colors.primary }]}>NETFLIX</Text>
        
        {/* Profile Avatar */}
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
            <Image 
              source={defaultProfileImage}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchView}>
        {/* Search Bar */}
        <TouchableOpacity 
          style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={20} color={colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>Search for movies...</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {FeaturedMovie}
        {renderCategory('Trending Now', trending)}
        {renderCategory('Popular on Netflix', popular)}
        {renderCategory('Top Rated', topRated)}
        {renderCategory('Coming Soon', upcoming)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: NetflixMetrics.padding,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  netflixLogo: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: 'Helvetica Neue',
    letterSpacing: -1.5,
    transform: [{ scaleX: 1.1 }],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 15,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: NetflixFonts.regular,
  },
  profileContainer: {
    padding: 5,
  },
  profileAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17.5,
  },
  scrollView: {
    flex: 1,
  },
  featuredContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 250, // Increased height for better visibility
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    padding: NetflixMetrics.padding,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: NetflixFonts.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredOverview: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: NetflixFonts.regular,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NetflixColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: NetflixMetrics.borderRadius,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: NetflixFonts.bold,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: NetflixColors.primary,
    width: 20,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Center vertically
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  categoryContainer: {
    marginVertical: NetflixMetrics.margin,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: NetflixMetrics.padding,
    marginBottom: 12,
    fontFamily: NetflixFonts.bold,
  },
  listContent: {
    paddingHorizontal: NetflixMetrics.padding,
  },
  movieCard: {
    marginRight: 12,
    borderRadius: NetflixMetrics.borderRadius,
    overflow: 'hidden',
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: NetflixMetrics.borderRadius,
  },
});

export default HomeScreen;