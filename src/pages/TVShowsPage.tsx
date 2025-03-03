import React, { useState, useEffect } from 'react';
import { getPopularTVShows } from '../api/tmdb';
import ContentGrid from '../components/ContentGrid';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../types';
import { Tv } from 'lucide-react';

const TVShowsPage: React.FC = () => {
  const [popularShows, setPopularShows] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularShows = async () => {
      try {
        const shows = await getPopularTVShows();
        setPopularShows(shows);
      } catch (error) {
        console.error('Error fetching popular TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularShows();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-dark-darker">
      <div className="tv-hero-gradient py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Tv size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Discover <span className="text-primary">TV Shows</span>
          </h1>
          <p className="text-light-muted text-lg mb-8 max-w-2xl mx-auto">
            Find your next binge-worthy series and keep track of what you've watched.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ContentGrid 
          contents={popularShows} 
          title="Popular TV Shows" 
        />
      )}
    </div>
  );
};

export default TVShowsPage;