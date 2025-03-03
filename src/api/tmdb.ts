// API key would normally be in an environment variable
const API_KEY = '3e17763f180e16a62506b6ee18594daf';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || 'API request failed');
  }
  return response.json();
};

export const searchContent = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await handleApiResponse(response);
    
    return data.results.map((item: any) => ({
      id: item.id.toString(),
      title: item.title || item.name,
      posterUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '/placeholder.jpg',
      releaseYear: (item.release_date || item.first_air_date || '').split('-')[0],
      type: item.media_type,
      overview: item.overview,
      genre_ids: item.genre_ids || []
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};

export const getMovieDetails = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const data = await handleApiResponse(response);
    
    return {
      id: data.id.toString(),
      title: data.title,
      posterUrl: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '/placeholder.jpg',
      releaseYear: (data.release_date || '').split('-')[0],
      genre: data.genres.map((g: any) => g.name),
      overview: data.overview,
      type: 'movie' as const
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getTVDetails = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
    const data = await handleApiResponse(response);
    
    return {
      id: data.id.toString(),
      title: data.name,
      posterUrl: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '/placeholder.jpg',
      releaseYear: (data.first_air_date || '').split('-')[0],
      genre: data.genres.map((g: any) => g.name),
      overview: data.overview,
      seasons: data.number_of_seasons,
      type: 'tv' as const
    };
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
};

export const getGenres = async (type: 'movie' | 'tv') => {
  try {
    const response = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
    const data = await handleApiResponse(response);
    return data.genres;
  } catch (error) {
    console.error(`Error fetching ${type} genres:`, error);
    return [];
  }
};

export const getGenreNames = async (genreIds: number[], type: 'movie' | 'tv') => {
  try {
    const genres = await getGenres(type);
    return genreIds
      .map(id => genres.find((g: any) => g.id === id))
      .filter(Boolean)
      .map((g: any) => g.name);
  } catch (error) {
    console.error('Error getting genre names:', error);
    return [];
  }
};