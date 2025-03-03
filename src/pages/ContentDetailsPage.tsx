import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getTVDetails } from '../api/tmdb';
import { useLibrary } from '../context/LibraryContext';
import { Content } from '../types';
import { Eye, Plus, Trash2, ArrowLeft, Calendar, Film, Tv, Clock } from 'lucide-react';
import RatingStars from '../components/RatingStars';

const ContentDetailsPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    addToWatched, 
    removeFromWatched, 
    addToWatchlist, 
    removeFromWatchlist,
    updateRating,
    isInWatched,
    isInWatchlist,
    getContentById
  } = useLibrary();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !type) {
        setError('Invalid content ID or type');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First check if we already have this content in our library
        const existingContent = getContentById(id);
        
        if (existingContent) {
          setContent(existingContent);
        } else {
          // Otherwise fetch from API
          let details;
          
          if (type === 'movie') {
            details = await getMovieDetails(id);
          } else if (type === 'tv') {
            details = await getTVDetails(id);
          }
          
          if (details) {
            setContent({
              ...details,
              rating: null,
              watched: false,
              watchlist: false
            });
          } else {
            setError('Failed to fetch content details');
          }
        }
      } catch (err) {
        console.error('Error fetching content details:', err);
        setError('An error occurred while fetching content details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type, getContentById]);

  const handleRating = (rating: number) => {
    if (content) {
      updateRating(content.id, rating);
      setContent(prev => prev ? { ...prev, rating } : null);
    }
  };

  const watched = content ? isInWatched(content.id) : false;
  const inWatchlist = content ? isInWatchlist(content.id) : false;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-darker">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-dark-darker">
        <h2 className="text-2xl font-bold text-primary mb-4">Error</h2>
        <p className="text-light-muted mb-6">{error || 'Content not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-darker">
      <div 
        className="bg-cover bg-center h-96 relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.8), rgba(229, 9, 20, 0.2)), url(${content.posterUrl})` 
        }}
      >
        <div className="container mx-auto px-4 py-8 relative h-full flex flex-col justify-end">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-dark-darker bg-opacity-70 text-white p-2 rounded-full hover:bg-primary transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row items-end md:items-center">
            <div className="w-32 h-48 md:w-48 md:h-72 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border-2 border-gray-800">
              <img 
                src={content.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:ml-8 text-white mt-4 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-bold">{content.title}</h1>
              <div className="flex flex-wrap items-center mt-2 text-light-muted">
                <div className="flex items-center mr-4">
                  <Calendar size={16} className="mr-1" />
                  <span>{content.releaseYear}</span>
                </div>
                <div className="flex items-center mr-4">
                  {content.type === 'movie' ? (
                    <Film size={16} className="mr-1" />
                  ) : (
                    <Tv size={16} className="mr-1" />
                  )}
                  <span className="capitalize">{content.type}</span>
                </div>
                {content.type === 'tv' && (content as any).seasons && (
                  <div className="flex items-center mr-4">
                    <Clock size={16} className="mr-1" />
                    <span>{(content as any).seasons} Seasons</span>
                  </div>
                )}
              </div>
              {content.genre && content.genre.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {content.genre.map(genre => (
                    <span key={genre} className="px-2 py-1 bg-dark-lighter text-xs rounded-full border border-gray-700">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-dark-lighter rounded-lg border border-gray-800 p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-2 text-light">Your Rating</h2>
              <RatingStars 
                rating={content.rating} 
                onRate={handleRating}
                interactive={watched}
              />
              {!watched && (
                <p className="text-sm text-light-muted mt-1">
                  Mark as watched to rate this {content.type}
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              {watched ? (
                <button 
                  onClick={() => removeFromWatched(content.id)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Remove from Watched</span>
                </button>
              ) : (
                <button 
                  onClick={() => addToWatched(content)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  <Eye size={18} />
                  <span>Mark as Watched</span>
                </button>
              )}
              
              {!watched && (
                inWatchlist ? (
                  <button 
                    onClick={() => removeFromWatchlist(content.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span>Remove from Watchlist</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => addToWatchlist(content)}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add to Watchlist</span>
                  </button>
                )
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-light">Overview</h2>
            <p className="text-light-muted leading-relaxed">
              {content.overview || 'No overview available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailsPage;