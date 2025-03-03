export interface Content {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  genre: string[];
  rating: number | null;
  watched: boolean;
  watchlist: boolean;
  overview: string;
  type: 'movie' | 'tv';
}