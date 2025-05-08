import React, { useState, useEffect } from 'react';
import { usePaletteApi } from './hooks/usePaletteApi';

import AppHeader from './components/AppHeader';
import ImageUploader from './components/InspirationSource/ImageUploader';
import InspireMeButton from './components/InspirationSource/InspireMeButton';
import PaletteView from './components/PaletteDisplay/PaletteView';
import ApiStatus from './components/ApiStatus';

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
    // clearPalette // If you want a button to explicitly clear the palette
  } = usePaletteApi();

  // Fetch initial root API status
  useEffect(() => {
    let isMounted = true;
    fetch(ROOT_API_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (isMounted) setRootApiMessage(data.message || "API responded, but no message found.");
      })
      .catch(error => {
        console.error("Error fetching root API status:", error);
        if (isMounted) setRootApiMessage(`Could not connect to backend. ${error.message}`);
      });
    return () => { isMounted = false; }; // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 selection:bg-purple-500 selection:text-white">
      <div className="container mx-auto flex flex-col items-center py-8 md:py-12 w-full">
        <AppHeader />

        <main className="w-full max-w-3xl mb-8">
          <div className="grid md:grid-cols-2 gap-6 items-start"> {/* items-start for different heights */}
            <ImageUploader
              onExtract={extractPalette}
              isLoading={isLoadingPalette}
              currentError={paletteError}
              clearCurrentError={clearPaletteError}
            />
            <InspireMeButton
              onGenerate={generateRandomPalette}
              isLoading={isLoadingPalette}
              // Pass error/clearError if you want specific error handling per button
            />
          </div>
        </main>

        {/* Display palette operation error globally or specifically */}
        {paletteError && !isLoadingPalette && ( // Show error only if not loading a new palette
          <div className="w-full max-w-2xl p-4 mb-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-center shadow-md" role="alert">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold">Error:</p>
                    <p>{paletteError}</p>
                </div>
                <button 
                    onClick={clearPaletteError} 
                    className="ml-4 p-1 text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
                    aria-label="Dismiss error"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
          </div>
        )}

        <section className="w-full flex justify-center">
          <PaletteView palette={palette} isLoading={isLoadingPalette} />
        </section>

        <footer className="mt-auto pt-10">
          <ApiStatus message={rootApiMessage} />
        </footer>
      </div>
    </div>
  );
}

export default App;