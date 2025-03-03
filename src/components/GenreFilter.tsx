import React from 'react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  genres, 
  selectedGenre, 
  onSelectGenre 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-light">Filter by Genre</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedGenre === null
              ? 'bg-primary text-white'
              : 'bg-dark-lighter text-light-muted hover:bg-dark border border-gray-700'
          }`}
          onClick={() => onSelectGenre(null)}
        >
          All
        </button>
        
        {genres.map(genre => (
          <button
            key={genre}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedGenre === genre
                ? 'bg-primary text-white'
                : 'bg-dark-lighter text-light-muted hover:bg-dark border border-gray-700'
            }`}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;