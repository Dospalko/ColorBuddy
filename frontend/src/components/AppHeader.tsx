import React from 'react';

const AppHeader: React.FC = React.memo(() => {
  return (
    <header className="text-center mb-12 md:mb-16">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        ColorBuddy 🎨
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 dark:text-slate-400 font-light">
        Your AI Palette Magician!
      </p>
    </header>
  );
});

export default AppHeader;