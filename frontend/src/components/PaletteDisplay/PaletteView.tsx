import type { Palette } from '../../types';
import ColorCard from './ColorCard';
import AccessibilityReport from './AccessibilityReport';
import ExportOptions from './ExportOptions';
// PaletteLoader should be imported from its own file if you made one, or keep it here
// For this example, assuming it's still co-located or imported correctly.

export const PaletteLoader = () => (
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
  
interface PaletteViewProps {
  palette: Palette | null;
  isLoading: boolean; // This prop is now mainly for the parent to decide to show PaletteLoader
}

const PaletteView = ({ palette /*, isLoading */ }: PaletteViewProps) => {
  // isLoading prop is effectively handled by parent App.tsx now for showing PaletteLoader
  // This component now assumes it's only rendered when !isLoading and palette exists

  if (!palette || palette.length === 0) { // Should not be hit if App.tsx logic is correct
    return (
      <div className="w-full max-w-3xl p-8 mt-8 glassmorphic text-center">
        <h2 className="text-2xl font-semibold text-slate-100 mb-3">Palette Cleared</h2>
        <p className="text-slate-300">Ready for new inspiration!</p>
        <div className="mt-6 text-6xl text-slate-600">🌬️</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl p-6 md:p-8 mt-8 glassmorphic">
      <h2 className="text-4xl font-bold mb-10 text-center tracking-tight
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Behold Your Palette!
      </h2>

      <div className="flex flex-wrap justify-center items-start gap-x-5 gap-y-8 md:gap-x-8 md:gap-y-10 mb-12">
        {palette.map((color, index) => (
          <ColorCard key={`${color.hex}-${index}`} color={color} />
        ))}
      </div>

      {/* Accessibility and Export can be in separate, styled sections */}
      <div className="space-y-10">
        <AccessibilityReport palette={palette} />
        <ExportOptions palette={palette} />
      </div>
    </div>
  );
};

export default PaletteView;



