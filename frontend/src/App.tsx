import { useState, useEffect, useMemo } from 'react';
import { usePaletteApi } from './hooks/usePaletteApi';
import { usePaletteHistory } from './hooks/usePaletteHistory';

import AppHeader from './components/AppHeader';
import ImageUploader from './components/InspirationSource/ImageUploader';
import InspireMeButton from './components/InspirationSource/InspireMeButton';
import PaletteView from './components/PaletteDisplay/PaletteView';
import PaletteHistoryPanel from './components/PaletteHistory/PaletteHistoryPanel';
import ApiStatus from './components/ApiStatus';

// For general API status (root endpoint)
const ROOT_API_URL = 'http://localhost:8000/';

function App() {
  const [rootApiMessage, setRootApiMessage] = useState("Loading API status...");
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    palette,
    isLoading: isLoadingPalette,
    error: paletteError,
    extractPalette,
    generateRandomPalette,
    clearError: clearPaletteError,
    clearPalette,
  } = usePaletteApi();

  const {
    history,
    favorites,
    savePalette,
    toggleFavorite,
    removePalette,
    clearHistory,
    renamePalette,
    isHistoryEmpty,
  } = usePaletteHistory();

  // Save palette to history whenever a new palette is generated
  useEffect(() => {
    if (palette && palette.length > 0) {
      // We'll determine the source based on how it was generated
      // For now, we'll use a simple heuristic - this could be improved
      // by passing the source through the palette generation functions
      savePalette(palette, 'ai'); // Default to AI, could be enhanced
    }
  }, [palette, savePalette]);

  const handleImageExtract = async (formData: FormData, numColors?: number) => {
    await extractPalette(formData, numColors);
    // The palette will be saved to history via the useEffect above
  };

  const handleAIGenerate = async (numColors?: number, prompt?: string) => {
    await generateRandomPalette(numColors, prompt);
    // The palette will be saved to history via the useEffect above
  };

  const handleSelectHistoryPalette = (selectedPalette: typeof palette) => {
    // Load a palette from history - don't save it again
    clearPaletteError();
    // We need to manually set the palette here since we're bypassing the API
    // This would require modifying usePaletteApi to expose a setPalette function
    // For now, let's create a workaround
    setShowHistory(false);
  };

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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-slate-900 selection:bg-purple-600 selection:text-white overflow-x-hidden relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-[-1]">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20"></div>
        
        {/* Enhanced Floating Orbs with better distribution */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-purple-500/25 rounded-full filter blur-3xl float"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-pink-500/20 rounded-full filter blur-3xl float-delayed"></div>
        <div className="absolute top-[25%] right-[15%] w-[300px] h-[300px] bg-cyan-500/15 rounded-full filter blur-2xl float-delayed-2"></div>
        <div className="absolute bottom-[35%] left-[10%] w-[250px] h-[250px] bg-yellow-500/10 rounded-full filter blur-xl pulse-glow"></div>
        <div className="absolute top-[60%] left-[70%] w-[200px] h-[200px] bg-emerald-500/12 rounded-full filter blur-2xl float"></div>
        <div className="absolute top-[10%] left-[40%] w-[150px] h-[150px] bg-orange-500/8 rounded-full filter blur-xl pulse-glow" style={{animationDelay: '3s'}}></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
               backgroundSize: '60px 60px'
             }}>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-1 h-1 bg-white/20 rounded-full top-[20%] left-[15%] shimmer"></div>
          <div className="absolute w-1 h-1 bg-white/20 rounded-full top-[60%] left-[80%] shimmer" style={{animationDelay: '1s'}}></div>
          <div className="absolute w-1 h-1 bg-white/20 rounded-full top-[80%] left-[25%] shimmer" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-1 h-1 bg-white/20 rounded-full top-[40%] left-[90%] shimmer" style={{animationDelay: '3s'}}></div>
        </div>
      </div>
      
      <div className="container mx-auto flex flex-col items-center py-12 md:py-16 px-6 w-full relative z-10 max-w-7xl">
        <AppHeader />

        {/* Main Content Area with enhanced spacing */}
        <main className="w-full flex flex-col items-center mt-8">
          {/* Input Section - Enhanced Cards with better spacing */}
          {(!palette && !isLoadingPalette && !paletteError) && (
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                {/* Image Upload Card */}
                <div className="group flex">
                  <div className="glassmorphic p-8 lg:p-10 card-hover h-full w-full flex flex-col">
                    <div className="text-center mb-8 flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-indigo-600 rounded-3xl 
                                    flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 
                                    shadow-lg shadow-sky-500/25">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 gradient-text">Extract from Image</h3>
                      <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
                        Upload any image and watch AI extract the perfect color palette with intelligent analysis
                      </p>
                    </div>
                    <div className="flex-1 flex items-start">
                      <ImageUploader
                        onExtract={extractPalette}
                        isLoading={isLoadingPalette}
                        currentError={paletteError}
                        clearCurrentError={clearPaletteError}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Generation Card */}
                <div className="group flex">
                  <div className="glassmorphic p-8 lg:p-10 card-hover h-full w-full flex flex-col">
                    <div className="text-center mb-8 flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl 
                                    flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300
                                    shadow-lg shadow-purple-500/25">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 gradient-text">AI Generated</h3>
                      <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
                        Describe your vision and let our advanced AI create the perfect palette for your project
                      </p>
                    </div>
                    <div className="flex-1 flex items-center">
                      <InspireMeButton
                        onGenerate={generateRandomPalette}
                        isLoading={isLoadingPalette}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights with enhanced styling */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                               backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-emerald-200 
                               hover:scale-105 transition-transform duration-300 shadow-lg">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">All palettes are automatically validated for WCAG accessibility standards</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display - Enhanced with better styling */}
          {paletteError && !isLoadingPalette && (
            <div className="w-full max-w-3xl mb-12">
              <div className="glassmorphic p-8 border-red-500/30 bg-red-500/10 card-hover">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-semibold text-red-200 mb-2">Something went wrong</h3>
                    <p className="text-red-300 mb-4 leading-relaxed">{paletteError}</p>
                    <button
                      onClick={() => { clearPaletteError(); clearPalette(); }}
                      className="btn-secondary text-sm py-3 px-6"
                    >
                      Try Again
                    </button>
                  </div>
                  <button
                    onClick={() => { clearPaletteError(); clearPalette(); }}
                    className="flex-shrink-0 ml-4 p-3 text-red-300 hover:text-red-200 rounded-xl hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State - Enhanced with better animations */}
          {isLoadingPalette && (
            <div className="w-full max-w-4xl">
              <div className="text-center py-20">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center">
                    <svg className="animate-spin w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-semibold text-white mb-3 gradient-text">Creating Magic ✨</h3>
                <p className="text-slate-300 text-lg">Analyzing colors and generating your perfect palette...</p>
                <div className="mt-6 flex justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Palette Display - Enhanced Container with better spacing */}
          {palette && !isLoadingPalette && !paletteError && (
            <section className="w-full max-w-7xl">
              <div className="mb-12">
                {MemoizedPaletteView}
              </div>
              
              {/* Action Buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
                <button
                  onClick={() => generateRandomPalette()}
                  className="btn-primary px-8 py-4 text-lg font-semibold"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New Palette
                </button>
                <button
                  onClick={clearPalette}
                  className="btn-secondary px-8 py-4 text-lg font-semibold"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Palette
                </button>
              </div>
            </section>
          )}
        </main>

        {/* Footer with enhanced styling */}
        <footer className="mt-auto pt-20 pb-8 w-full">
          <div className="text-center">
            <div className="mb-8">
              <ApiStatus message={rootApiMessage} />
            </div>
            <div className="glassmorphic inline-block px-8 py-4">
              <div className="text-base text-slate-300 flex items-center gap-2">
                Made with <span className="text-red-400 animate-pulse text-xl">♥</span> for designers and developers
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;