import React from 'react';
import type { Color } from '../../types';
import { useClipboard } from '../../hooks/useClipboard';
import { getReadableTextColor } from '../../utils/colorUtils'; // Utility for text color

interface ColorCardProps {
  color: Color;
}

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
  const { copy, hasCopied } = useClipboard({ timeout: 1500 });
  const readableTextColor = getReadableTextColor(color.hex);

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    event.stopPropagation(); // Prevent event bubbling if card is wrapped in something clickable
    copy(color.hex);
  };

  return (
    <div className="flex flex-col items-center group">
      <div
        className="w-24 h-24 md:w-28 md:h-28 rounded-lg shadow-md mb-2 cursor-pointer 
                   transition-all duration-200 ease-in-out transform group-hover:scale-105 group-hover:shadow-xl
                   flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: color.hex }}
        title={`Click to copy ${color.hex}`}
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCopy(e as any)} // Basic keyboard accessibility
      >
        {/* Optional: Show color name if available, with readable text color */}
        {color.name && (
            <span className="absolute bottom-1 left-1 right-1 text-center text-xs p-0.5 bg-black bg-opacity-30 rounded-sm truncate"
                  style={{ color: readableTextColor }}
            >
                {color.name}
            </span>
        )}
        {/* Show "Copied!" overlay */}
        {hasCopied && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white font-semibold">
                Copied!
            </div>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                   rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500
                   transition-colors duration-150"
        aria-label={`Copy color ${color.hex}`}
      >
        {color.hex}
      </button>
    </div>
  );
};

export default React.memo(ColorCard); // Memoize if color prop is stable