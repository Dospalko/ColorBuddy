import React from 'react';
import type { Palette } from '../../types';
import ColorCard from './ColorCard';
import AccessibilityReport from './AccessibilityReport';
import ExportOptions from './ExportOptions';

interface PaletteViewProps {
  palette: Palette | null;
  isLoading: boolean;
}

// Simple placeholder/loader component
export const PaletteLoader: React.FC = () => (
  <div className="w-full max-w-2xl p-6 mt-8 text-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-6"></div>
      <div className="flex justify-center gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        ))}
      </div>
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
  </div>
);


const PaletteView: React.FC<PaletteViewProps> = ({ palette, isLoading }) => {
  if (isLoading) {
    return <PaletteLoader />;
  }

  if (!palette || palette.length === 0) {
    return (
      <div className="w-full max-w-2xl p-8 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Your Palette Awaits
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload an image or click "Inspire Me!" to generate a color palette.
        </p>
        <div className="mt-6 text-6xl text-gray-300 dark:text-gray-600">🎨</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-6 mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8 text-center tracking-tight">
        Your Palette
      </h2>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 mb-10">
        {palette.map((color, index) => (
          <ColorCard key={`${color.hex}-${index}`} color={color} />
        ))}
      </div>

      <AccessibilityReport palette={palette} />
      <ExportOptions palette={palette} />
    </div>
  );
};

export default PaletteView;