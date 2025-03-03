import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchContent } from '../api/tmdb';
import ContentGrid from '../components/ContentGrid';
import SearchBar from '../components/SearchBar';
import { SearchResult } from '../types';
import { Search } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const searchResults = await searchContent(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="min-h-screen bg-dark-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-6">
          <Search size={36} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-light">Search Movies & TV Shows</h1>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Search by title..." />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {searched && (
              <ContentGrid 
                contents={results} 
                title={query ? `Search Results for "${query}"` : 'Search Results'} 
                emptyMessage="No results found. Try a different search term."
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;