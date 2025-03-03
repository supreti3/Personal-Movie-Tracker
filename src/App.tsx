import React from 'react';
import { LibraryProvider } from './context/LibraryContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <LibraryProvider>
      <div className="min-h-screen bg-dark-darker text-light">
        <Navbar />
        <main>
          <HomePage />
        </main>
      </div>
    </LibraryProvider>
  );
}

export default App;