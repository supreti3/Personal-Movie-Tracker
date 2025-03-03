import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ContentGrid from '../components/ContentGrid';
import AddContentForm from '../components/AddContentForm';
import { Film, Tv, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const { watchedContent } = useLibrary();
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>('all');
  
  const movies = watchedContent.filter(content => content.type === 'movie');
  const tvShows = watchedContent.filter(content => content.type === 'tv');
  
  const displayContent = activeTab === 'all' 
    ? watchedContent 
    : activeTab === 'movies' 
      ? movies 
      : tvShows;

  return (
    <div className="min-h-screen bg-dark-darker pb-10">
      <div className="cute-bg py-10 px-4 mb-8">
        <div className="container mx-auto text-center">
          <Heart size={48} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            My <span className="text-primary">Watches</span>
          </h1>
          <p className="text-light-muted text-lg mb-6 max-w-md mx-auto">
            Keep track of all the movies and TV shows you've watched in one beautiful place.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <AddContentForm />
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-light-muted hover:bg-dark'
              }`}
            >
              <Heart size={16} />
              <span>All ({watchedContent.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'movies'
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-light-muted hover:bg-dark'
              }`}
            >
              <Film size={16} />
              <span>Movies ({movies.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tv')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'tv'
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-light-muted hover:bg-dark'
              }`}
            >
              <Tv size={16} />
              <span>TV Shows ({tvShows.length})</span>
            </button>
          </div>
          
          <ContentGrid 
            contents={displayContent} 
            emptyMessage={
              activeTab === 'all' 
                ? "You haven't added any content yet. Add your first watch above!" 
                : activeTab === 'movies' 
                  ? "You haven't added any movies yet" 
                  : "You haven't added any TV shows yet"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;