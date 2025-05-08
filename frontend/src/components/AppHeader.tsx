import React from 'react';

const AppHeader: React.FC = React.memo(() => { // React.memo if no props or props are primitive
  return (
    <header className="text-center mb-10">
      <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-3 tracking-tight">
        ColorBuddy 
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Your AI Palette Magician!
      </p>
    </header>
  );
});

export default AppHeader;