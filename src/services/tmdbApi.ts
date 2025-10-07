import axios from 'axios';

const API_KEY = 'dd61b63dd8a92c360a00bd4eef1ccfea'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'; //https://image.tmdb.org/t/p/w500

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const TMDBService = {
  // Movie endpoints
  getTrendingMovies: () => 
    tmdbApi.get('/trending/movie/week'),
  
  getPopularMovies: () => 
    tmdbApi.get('/movie/popular'),
  
  getTopRatedMovies: () => 
    tmdbApi.get('/movie/top_rated'),
  
  getUpcomingMovies: () => 
    tmdbApi.get('/movie/upcoming'),
  
  searchMovies: (query: string) => 
    tmdbApi.get('/search/movie', { params: { query } }),
  
  getMovieDetails: (id: number) => 
    tmdbApi.get(`/movie/${id}`),
  
  getSimilarMovies: (id: number) => 
    tmdbApi.get(`/movie/${id}/similar`),
  
  getMovieVideos: (id: number) => 
    tmdbApi.get(`/movie/${id}/videos`),

  // Image URLs
  getImageUrl: (path: string, size: string = 'w500') => 
    `${IMAGE_BASE_URL}/${size}${path}`,
  
  getBackdropUrl: (path: string, size: string = 'w780') => 
    `${IMAGE_BASE_URL}/${size}${path}`,
};

export default TMDBService;