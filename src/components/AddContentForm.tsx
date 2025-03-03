import React, { useState } from 'react';
import { Film, Tv, Plus, Search, Loader2 } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import RatingStars from './RatingStars';
import { v4 as uuidv4 } from 'uuid';
import { searchContent, getGenreNames, getMovieDetails, getTVDetails } from '../api/tmdb';

interface SearchResult {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  type: 'movie' | 'tv' | 'person';
  overview: string;
  genre_ids?: number[];
}

const AddContentForm: React.FC = () => {
  const { addToWatched } = useLibrary();
  const [title, setTitle] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!title.trim()) return;
    
    setSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchContent(title);
      // Filter out person results and limit to 5 results
      setSearchResults(results.filter((item: any) => item.type !== 'person').slice(0, 5));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectContent = async (content: SearchResult) => {
    setSelectedContent(content);
    setSearchResults([]);
    setTitle(content.title);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContent) {
      // If no content is selected but title is entered, create a basic entry
      if (title.trim()) {
        const basicContent = {
          id: uuidv4(),
          title: title.trim(),
          releaseYear: 'Unknown',
          type: 'movie' as const,
          rating,
          posterUrl: '/placeholder.jpg',
          overview: '',
          genre: [],
          watched: true,
          watchlist: false
        };
        
        addToWatched(basicContent);
        resetForm();
      }
      return;
    }
    
    setLoading(true);
    
    try {
      // Get detailed information based on the type
      let detailedContent;
      
      if (selectedContent.type === 'movie') {
        detailedContent = await getMovieDetails(selectedContent.id);
      } else if (selectedContent.type === 'tv') {
        detailedContent = await getTVDetails(selectedContent.id);
      }
      
      // If we couldn't get detailed info, fall back to the search result
      if (!detailedContent) {
        // Try to get genre names if we have genre_ids
        let genres: string[] = [];
        if (selectedContent.genre_ids && selectedContent.genre_ids.length > 0) {
          genres = await getGenreNames(selectedContent.genre_ids, selectedContent.type);
        }
        
        detailedContent = {
          ...selectedContent,
          genre: genres,
        };
      }
      
      // Add the rating and watched status
      const contentToAdd = {
        ...detailedContent,
        rating,
        watched: true,
        watchlist: false
      };
      
      addToWatched(contentToAdd);
      resetForm();
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setRating(null);
    setSelectedContent(null);
    setSearchResults([]);
  };

  return (
    <div className="bg-dark-lighter rounded-lg p-4 border border-gray-800 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-light flex items-center">
        <Plus size={20} className="text-primary mr-2" />
        Add to My Watches
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label htmlFor="title" className="block text-sm font-medium text-light-muted mb-1">
            Movie or TV Show Title
          </label>
          <div className="flex">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-l-md cute-input text-light focus:outline-none"
              placeholder="Enter title to search..."
              required
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-hover transition-colors flex items-center"
              disabled={searching || !title.trim()}
            >
              {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-dark-darker border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center p-2 hover:bg-dark cursor-pointer border-b border-gray-700 last:border-b-0"
                  onClick={() => handleSelectContent(result)}
                >
                  <div className="w-10 h-14 flex-shrink-0 mr-3">
                    <img 
                      src={result.posterUrl} 
                      alt={result.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-light">{result.title}</div>
                    <div className="text-xs text-light-muted flex items-center">
                      <span>{result.releaseYear || 'Unknown'}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize flex items-center">
                        {result.type === 'movie' ? (
                          <><Film size={12} className="mr-1" /> Movie</>
                        ) : (
                          <><Tv size={12} className="mr-1" /> TV Show</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedContent && (
          <div className="mb-4 p-3 bg-dark rounded-md flex items-center">
            <div className="w-12 h-16 flex-shrink-0 mr-3">
              <img 
                src={selectedContent.posterUrl} 
                alt={selectedContent.title}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="flex-grow">
              <div className="font-medium text-light">{selectedContent.title}</div>
              <div className="text-xs text-light-muted flex items-center">
                <span>{selectedContent.releaseYear || 'Unknown'}</span>
                <span className="mx-1">•</span>
                <span className="capitalize flex items-center">
                  {selectedContent.type === 'movie' ? (
                    <><Film size={12} className="mr-1" /> Movie</>
                  ) : (
                    <><Tv size={12} className="mr-1" /> TV Show</>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-light-muted mb-1">
            Your Rating
          </label>
          <RatingStars rating={rating} onRate={setRating} size={24} />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 rounded-md cute-button text-white font-medium flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Plus size={18} className="mr-2" />
          )}
          Add to My Watches
        </button>
      </form>
    </div>
  );
};

export default AddContentForm;