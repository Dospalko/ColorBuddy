import React from 'react';
import type { Palette } from '../../types';
import ColorCard from './ColorCard';
import ExportOptions from './ExportOptions';
import AccessibilityReport from './AccessibilityReport';
interface PaletteViewProps {
  palette: Palette | null;
  isLoading: boolean;
}

const PaletteView: React.FC<PaletteViewProps> = ({ palette, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl p-6 mt-8 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">Generating your palette...</p>
        {/* You can add a spinner here */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-4"></div>
      </div>
    );
  }

  if (!palette || palette.length === 0) {
    return (
      <div className="w-full max-w-2xl p-6 mt-8 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your color palette will appear here once generated or extracted.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Upload an image or click "Inspire Me!"
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-6 mt-8 bg-white dark:bg-gray-700 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Your Palette
      </h2>

      {/* Visual Palette */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {palette.map((color, index) => (
          <ColorCard key={`${color.hex}-${index}`} color={color} />
        ))}
      </div>

      {/* Accessibility Report */}
      <AccessibilityReport palette={palette} />

      {/* Export Options */}
      <ExportOptions palette={palette} />
    </div>
  );
};

export default PaletteView;