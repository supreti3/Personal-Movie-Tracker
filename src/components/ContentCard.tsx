import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Content } from '../types';
import { useLibrary } from '../context/LibraryContext';
import RatingStars from './RatingStars';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { removeFromWatched, updateRating } = useLibrary();

  const handleRating = (rating: number) => {
    updateRating(content.id, rating);
  };

  return (
    <div className="bg-dark-lighter rounded-lg overflow-hidden cute-card border border-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={content.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
          alt={content.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 gradient-overlay p-3">
          <h3 className="text-white font-bold truncate">{content.title}</h3>
          <div className="flex items-center text-light-muted text-sm">
            <span>{content.releaseYear}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{content.type}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-dark flex flex-col space-y-2">
        {content.genre && content.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {content.genre.slice(0, 2).map((g, index) => (
              <span key={index} className="text-xs bg-dark-darker px-2 py-0.5 rounded-full text-light-muted">
                {g}
              </span>
            ))}
            {content.genre.length > 2 && (
              <span className="text-xs bg-dark-darker px-2 py-0.5 rounded-full text-light-muted">
                +{content.genre.length - 2}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-light-muted">My Rating:</span>
          <button 
            onClick={() => removeFromWatched(content.id)}
            className="text-red-500 hover:text-red-400"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <RatingStars 
          rating={content.rating} 
          onRate={handleRating}
          size={18}
        />
      </div>
    </div>
  );
};

export default ContentCard;