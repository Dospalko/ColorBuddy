import React, { useState, useCallback } from 'react';

interface InspireMeButtonProps {
  onGenerate: (numColors?: number, prompt?: string) => Promise<void>; // From usePaletteApi
  isLoading: boolean;
  // currentError: string | null; // If you want to show API error specific to this button
  // clearCurrentError: () => void;
}

const InspireMeButton: React.FC<InspireMeButtonProps> = ({ onGenerate, isLoading }) => {
  // Example: If you want to add a prompt input for "Inspire Me"
  const [prompt, setPrompt] = useState('');
  // const [numColors, setNumColors] = useState<number>(5);

  const handleClick = useCallback(async () => {
    // If you add numColors/prompt options:
    // onGenerate(numColors, prompt || undefined);
    await onGenerate(5, prompt || undefined); // Generate 5 colors, pass prompt if entered
  }, [onGenerate, prompt]);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Need Inspiration?
      </h2>
      {/* Optional: Input for AI prompt */}
      <div className="mb-4">
          <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your desired palette (optional AI prompt)
          </label>
          <input
              type="text"
              id="aiPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., serene beach sunset, cyberpunk city"
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
          />
      </div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800
                   disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-150 text-lg"
      >
        {isLoading ? 'Generating...' : 'Inspire Me ✨'}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Get a unique palette.
      </p>
    </div>
  );
};

export default InspireMeButton;