import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ContentGrid from '../components/ContentGrid';
import GenreFilter from '../components/GenreFilter';
import { Content } from '../types';
import { BookOpen } from 'lucide-react';

const LibraryPage: React.FC = () => {
  const { watchedContent } = useLibrary();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Extract all unique genres from watched content
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    watchedContent.forEach(content => {
      if (content.genre) {
        content.genre.forEach(g => genreSet.add(g));
      }
    });
    return Array.from(genreSet).sort();
  }, [watchedContent]);
  
  // Filter content by selected genre
  const filteredContent = useMemo(() => {
    if (!selectedGenre) return watchedContent;
    
    return watchedContent.filter(content => 
      content.genre && content.genre.includes(selectedGenre)
    );
  }, [watchedContent, selectedGenre]);
  
  // Group content by type
  const movies = filteredContent.filter(content => content.type === 'movie');
  const tvShows = filteredContent.filter(content => content.type === 'tv');

  return (
    <div className="min-h-screen bg-dark-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <BookOpen size={28} className="text-primary mr-3" />
          <h1 className="text-3xl font-bold text-light">My Library</h1>
        </div>
        
        {watchedContent.length === 0 ? (
          <div className="text-center py-16 bg-dark-lighter rounded-lg border border-gray-800">
            <BookOpen size={48} className="text-primary mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-light mb-4">Your library is empty</h2>
            <p className="text-light-muted mb-6">
              Start adding movies and TV shows you've watched to build your collection.
            </p>
          </div>
        ) : (
          <>
            <GenreFilter 
              genres={allGenres} 
              selectedGenre={selectedGenre} 
              onSelectGenre={setSelectedGenre} 
            />
            
            {movies.length > 0 && (
              <ContentGrid 
                contents={movies} 
                title="Movies" 
                emptyMessage="No movies in your library yet"
              />
            )}
            
            {tvShows.length > 0 && (
              <ContentGrid 
                contents={tvShows} 
                title="TV Shows" 
                emptyMessage="No TV shows in your library yet"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;