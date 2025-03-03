import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ContentGrid from '../components/ContentGrid';
import GenreFilter from '../components/GenreFilter';
import { ListChecks } from 'lucide-react';

const WatchlistPage: React.FC = () => {
  const { watchlistContent } = useLibrary();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Extract all unique genres from watchlist content
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    watchlistContent.forEach(content => {
      if (content.genre) {
        content.genre.forEach(g => genreSet.add(g));
      }
    });
    return Array.from(genreSet).sort();
  }, [watchlistContent]);
  
  // Filter content by selected genre
  const filteredContent = useMemo(() => {
    if (!selectedGenre) return watchlistContent;
    
    return watchlistContent.filter(content => 
      content.genre && content.genre.includes(selectedGenre)
    );
  }, [watchlistContent, selectedGenre]);
  
  // Group content by type
  const movies = filteredContent.filter(content => content.type === 'movie');
  const tvShows = filteredContent.filter(content => content.type === 'tv');

  return (
    <div className="min-h-screen bg-dark-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <ListChecks size={28} className="text-primary mr-3" />
          <h1 className="text-3xl font-bold text-light">My Watchlist</h1>
        </div>
        
        {watchlistContent.length === 0 ? (
          <div className="text-center py-16 bg-dark-lighter rounded-lg border border-gray-800">
            <ListChecks size={48} className="text-primary mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-light mb-4">Your watchlist is empty</h2>
            <p className="text-light-muted mb-6">
              Add movies and TV shows you want to watch in the future.
            </p>
          </div>
        ) : (
          <>
            {allGenres.length > 0 && (
              <GenreFilter 
                genres={allGenres} 
                selectedGenre={selectedGenre} 
                onSelectGenre={setSelectedGenre} 
              />
            )}
            
            {movies.length > 0 && (
              <ContentGrid 
                contents={movies} 
                title="Movies to Watch" 
                emptyMessage="No movies in your watchlist"
              />
            )}
            
            {tvShows.length > 0 && (
              <ContentGrid 
                contents={tvShows} 
                title="TV Shows to Watch" 
                emptyMessage="No TV shows in your watchlist"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;