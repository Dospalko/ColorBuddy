import { useState, useEffect, useMemo } from 'react';
import { usePaletteApi } from './hooks/usePaletteApi';

import AppHeader from './components/AppHeader';
import ImageUploader from './components/InspirationSource/ImageUploader';
import InspireMeButton from './components/InspirationSource/InspireMeButton';
import PaletteView from './components/PaletteDisplay/PaletteView';
import ApiStatus from './components/ApiStatus';
import { PaletteLoader } from './components/PaletteDisplay/PaletteView'; // Assuming PaletteLoader is exported

// For general API status (root endpoint)
const ROOT_API_URL = 'http://localhost:8000/';

function App() {
  const [rootApiMessage, setRootApiMessage] = useState("Loading API status...");
  const {
    palette,
    isLoading: isLoadingPalette,
    error: paletteError,
    extractPalette,
    generateRandomPalette,
    clearError: clearPaletteError,
    clearPalette,
  } = usePaletteApi();

  useEffect(() => {
    let isMounted = true;
    fetch(ROOT_API_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (isMounted) setRootApiMessage(data.message || "API responded.");
      })
      .catch(error => {
        console.error("Error fetching root API status:", error);
        if (isMounted) setRootApiMessage(`Backend connection failed. ${error.message}`);
      });
    return () => { isMounted = false; };
  }, []);

  // Memoize the PaletteView to prevent re-renders if only isLoading changes without palette data
  const MemoizedPaletteView = useMemo(() => (
    <PaletteView palette={palette} isLoading={false} />
  ), [palette]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-slate-900 selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Background decorative elements - example */}
      <div className="fixed inset-0 z-[-1] opacity-20 dark:opacity-30">
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-sky-500 rounded-full filter blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-[20%] left-[30%] w-48 h-48 bg-pink-500 rounded-full filter blur-2xl animate-pulse-slowest"></div>
      </div>
      
      <div className="container mx-auto flex flex-col items-center py-8 md:py-12 px-4 w-full relative z-10">
        <AppHeader />

        {/* Conditional rendering for Input vs. Palette Output for a more focused flow */}
        {(!palette && !isLoadingPalette && !paletteError) && (
          <main className="w-full max-w-xl my-8 p-6 md:p-8 space-y-8 glassmorphic">
            <div>
              <ImageUploader
                onExtract={extractPalette}
                isLoading={isLoadingPalette}
                currentError={paletteError}
                clearCurrentError={clearPaletteError}
              />
            </div>
            <div className="text-center text-slate-400 dark:text-slate-500 font-semibold">OR</div>
            <div>
              <InspireMeButton
                onGenerate={generateRandomPalette}
                isLoading={isLoadingPalette}
              />
            </div>
          </main>
        )}

        {/* Error Display */}
        {paletteError && !isLoadingPalette && (
          <div className="w-full max-w-xl p-4 my-6 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 rounded-lg text-center shadow-lg" role="alert">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-bold text-red-50">Oops! Something went wrong.</p>
                <p className="text-sm">{paletteError}</p>
              </div>
              <button
                onClick={() => { clearPaletteError(); clearPalette(); }} // Also clear palette on error dismiss
                className="ml-4 p-2 text-red-100 hover:bg-red-500/30 rounded-full focus-ring"
                aria-label="Dismiss error and clear palette"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading State for Palette */}
        {isLoadingPalette && (
          <div className="w-full flex justify-center my-8">
            <PaletteLoader />
          </div>
        )}

        {/* Palette Display Area - This becomes the main focus once a palette is loaded */}
        {palette && !isLoadingPalette && !paletteError && (
          <section className="w-full flex flex-col items-center my-8">
            {MemoizedPaletteView}
            <button
              onClick={clearPalette}
              className="mt-8 px-6 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus-ring"
            >
              Start Over / Clear Palette
            </button>
          </section>
        )}

        <footer className="mt-auto pt-12 pb-4">
          <ApiStatus message={rootApiMessage} />
        </footer>
      </div>
    </div>
  );
}

export default App;