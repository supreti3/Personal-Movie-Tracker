import React, { createContext, useContext, useState, useEffect } from 'react';
import { Content } from '../types';

interface LibraryContextType {
  watchedContent: Content[];
  addToWatched: (content: Content) => void;
  removeFromWatched: (id: string) => void;
  updateRating: (id: string, rating: number) => void;
  getContentById: (id: string) => Content | undefined;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchedContent, setWatchedContent] = useState<Content[]>(() => {
    const saved = localStorage.getItem('watchedContent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchedContent', JSON.stringify(watchedContent));
  }, [watchedContent]);

  const addToWatched = (content: Content) => {
    setWatchedContent(prev => [...prev, { ...content, watched: true }]);
  };

  const removeFromWatched = (id: string) => {
    setWatchedContent(prev => prev.filter(item => item.id !== id));
  };

  const updateRating = (id: string, rating: number) => {
    setWatchedContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, rating } : item
      )
    );
  };

  const getContentById = (id: string) => {
    return watchedContent.find(item => item.id === id);
  };

  return (
    <LibraryContext.Provider
      value={{
        watchedContent,
        addToWatched,
        removeFromWatched,
        updateRating,
        getContentById
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};