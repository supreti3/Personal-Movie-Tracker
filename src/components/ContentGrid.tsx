import React from 'react';
import ContentCard from './ContentCard';
import { Content } from '../types';

interface ContentGridProps {
  contents: Content[];
  emptyMessage?: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  contents, 
  emptyMessage = "You haven't added any content yet" 
}) => {
  return (
    <div>
      {contents.length === 0 ? (
        <div className="text-center py-10 bg-dark-lighter rounded-lg border border-gray-800">
          <p className="text-light-muted text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {contents.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentGrid;