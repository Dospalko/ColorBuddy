import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-3">
        ColorBuddy 
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Your AI Palette Magician!
      </p>
    </header>
  );
};

export default AppHeader;