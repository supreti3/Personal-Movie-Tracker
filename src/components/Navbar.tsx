import React from 'react';
import { Film, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-dark-darker text-light border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="flex items-center space-x-2 group">
          <Film size={24} className="text-primary group-hover:text-primary-hover transition-colors" />
          <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            My<span className="text-primary">Watches</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Heart size={18} className="text-primary" />
          <span className="text-light-muted">Track what you love</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;