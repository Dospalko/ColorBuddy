import React from 'react';
import type { Palette, PaletteApiResponse } from '../../types';

interface InspireMeButtonProps {
  onPaletteGenerated: (palette: Palette) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const InspireMeButton: React.FC<InspireMeButtonProps> = ({
  onPaletteGenerated,
  setIsLoading,
  setError,
}) => {
  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/palette/random', {
        method: 'GET', // Or POST if your backend expects that for generation
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: PaletteApiResponse = await response.json();
       if (data.palette && data.palette.length > 0) {
        onPaletteGenerated(data.palette);
      } else {
        throw new Error("Palette data not found in API response.");
      }
    } catch (error: unknown) {
      console.error("Error generating random palette:", error);
      setError(error instanceof Error ? error.message : "Failed to generate a random palette.");
      onPaletteGenerated([]); // Clear any existing palette on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-6 md:mt-0">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Need Inspiration?
      </h2>
      <button
        onClick={handleClick}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded
                   focus:outline-none focus:shadow-outline text-lg"
      >
        Inspire Me ✨
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Get a unique, AI-generated palette.
      </p>
    </div>
  );
};

export default InspireMeButton;