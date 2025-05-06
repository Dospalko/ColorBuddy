import React, { useState, useEffect } from 'react';
import { Palette } from './types'; // Import shared types

import AppHeader from './components/AppHeader';
import ImageUploader from './components/InspirationSource/ImageUploader';
import InspireMeButton from './components/InspirationSource/InspireMeButton';
import PaletteView from './components/PaletteDisplay/PaletteView';
import ApiStatus from './components/ApiStatus';

function App() {
  const [apiMessage, setApiMessage] = useState("Loading API status...");
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isLoadingPalette, setIsLoadingPalette] = useState(false);
  const [paletteError, setPaletteError] = useState<string | null>(null);

  // Fetch initial API status
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setApiMessage(data.message || "API responded, but no message found."))
      .catch(error => {
        console.error("Error fetching API status:", error);
        setApiMessage(`Could not connect to backend API. ${error.message}`);
      });
  }, []);

  const handlePaletteUpdate = (newPalette: Palette) => {
    setCurrentPalette(newPalette);
    setPaletteError(null); // Clear any previous errors when a new palette is set
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 selection:bg-purple-500 selection:text-white">
      <div className="container mx-auto flex flex-col items-center py-8 md:py-12">
        <AppHeader />

        {/* Input Section */}
        <section className="w-full max-w-3xl grid md:grid-cols-2 gap-6 mb-8">
          <ImageUploader
            onPaletteExtracted={handlePaletteUpdate}
            setIsLoading={setIsLoadingPalette}
            setError={setPaletteError}
          />
          <InspireMeButton
            onPaletteGenerated={handlePaletteUpdate}
            setIsLoading={setIsLoadingPalette}
            setError={setPaletteError}
          />
        </section>

        {/* Error Display for Palette Operations */}
        {paletteError && (
          <div className="w-full max-w-2xl p-4 mb-6 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded text-center">
            <p className="font-bold">Error:</p>
            <p>{paletteError}</p>
          </div>
        )}

        {/* Palette Display Section */}
        <section className="w-full flex justify-center">
          <PaletteView palette={currentPalette} isLoading={isLoadingPalette} />
        </section>

        {/* API Status - at the very bottom */}
        <footer className="mt-auto pt-8">
          <ApiStatus message={apiMessage} />
        </footer>
      </div>
    </div>
  );
}

export default App;