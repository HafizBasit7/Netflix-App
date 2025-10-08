import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { TMDBService } from '../../src/services/tmdbApi';

jest.mock('../../src/services/tmdbApi', () => ({
  TMDBService: {
    getTrendingMovies: jest.fn(),
    getPopularMovies: jest.fn(),
    getTopRatedMovies: jest.fn(),
    getUpcomingMovies: jest.fn(),
    getImageUrl: (path: string) => `https://image.tmdb.org/t/p/w500${path}`,
    getBackdropUrl: (path: string) => `https://image.tmdb.org/t/p/original${path}`,
  },
}));

describe('HomeScreen', () => {
  it('renders Netflix logo and search text', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<HomeScreen navigation={{ navigate: mockNavigate }} />);

    expect(getByText('NETFLIX')).toBeTruthy();
    expect(getByText('Search for movies...')).toBeTruthy();
  });

  it('calls navigation when search bar is pressed', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<HomeScreen navigation={{ navigate: mockNavigate }} />);

    const search = getByText('Search for movies...');
    fireEvent.press(search);

    expect(mockNavigate).toHaveBeenCalledWith('Search');
  });

  it('renders movie categories after data fetch', async () => {
    TMDBService.getTrendingMovies.mockResolvedValue({ data: { results: [{ id: 1, title: 'Inception', poster_path: '/fake.jpg' }] } });
    TMDBService.getPopularMovies.mockResolvedValue({ data: { results: [] } });
    TMDBService.getTopRatedMovies.mockResolvedValue({ data: { results: [] } });
    TMDBService.getUpcomingMovies.mockResolvedValue({ data: { results: [] } });

    const { findByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    await waitFor(() => findByText('Trending Now'));
    expect(await findByText('Trending Now')).toBeTruthy();
  });
});
