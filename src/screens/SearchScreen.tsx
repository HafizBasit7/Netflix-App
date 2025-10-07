import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TMDBService } from '../services/tmdbApi';
import { Movie } from '../types';
import { NetflixColors, NetflixFonts, NetflixMetrics } from '../styles/theme';
import { useTheme } from '../theme/ThemeProvider'; 

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<Movie[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    fetchTrending();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      searchMovies();
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchTrending = async () => {
    try {
      const response = await TMDBService.getTrendingMovies();
      setTrending(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await TMDBService.searchMovies(query);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <Animated.View
      style={[
        styles.movieCard,
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
          backgroundColor: colors.cardBackground, 
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { 
          movieId: item.id,
          movieTitle: item.title 
        })}
      >
        <Image
          source={{ uri: TMDBService.getImageUrl(item.poster_path) }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={[styles.movieTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.movieYear, { color: colors.textMuted }]}>
            {new Date(item.release_date).getFullYear()}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTrendingItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => navigation.navigate('Details', { 
        movieId: item.id,
        movieTitle: item.title 
      })}
    >
      <Image
        source={{ uri: TMDBService.getImageUrl(item.poster_path) }}
        style={styles.trendingPoster}
        resizeMode="cover"
      />
      <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for movies..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus={true}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : query.length > 2 ? (
        <View style={styles.noResults}>
          <Icon name="search-outline" size={60} color={colors.textMuted} />
          <Text style={[styles.noResultsText, { color: colors.text }]}>No movies found</Text>
          <Text style={[styles.noResultsSubtext, { color: colors.textMuted }]}>Try different keywords</Text>
        </View>
      ) : (
        <View style={styles.trendingContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Searches</Text>
          <FlatList
            data={trending}
            renderItem={renderTrendingItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NetflixMetrics.padding,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: NetflixMetrics.padding,
    marginBottom: NetflixMetrics.margin,
    paddingHorizontal: NetflixMetrics.padding,
    borderRadius: NetflixMetrics.borderRadius,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: NetflixMetrics.padding,
    fontFamily: NetflixFonts.regular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: NetflixMetrics.padding,
  },
  movieCard: {
    flex: 1,
    margin: 4,
    borderRadius: NetflixMetrics.borderRadius,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    height: 180,
  },
  movieInfo: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 10,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: NetflixMetrics.margin,
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  trendingContainer: {
    padding: NetflixMetrics.padding,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trendingList: {
    paddingBottom: NetflixMetrics.padding,
  },
  trendingItem: {
    marginRight: NetflixMetrics.margin,
    width: 120,
  },
  trendingPoster: {
    width: 120,
    height: 160,
    borderRadius: NetflixMetrics.borderRadius,
  },
  trendingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SearchScreen;