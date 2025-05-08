import React from 'react';
import type { Color } from '../../types';
import { useClipboard } from '../../hooks/useClipboard';
import { getReadableTextColor } from '../../utils/colorUtils';

interface ColorCardProps {
  color: Color;
}

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
  const { copy, hasCopied } = useClipboard({ timeout: 1500 });
  const readableTextColor = getReadableTextColor(color.hex);

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    event.stopPropagation();
    copy(color.hex);
  };

  return (
    <div className="flex flex-col items-center group" style={{ perspective: '500px' }}>
      <div
        className="w-28 h-28 md:w-32 md:h-32 rounded-xl shadow-lg mb-3 cursor-pointer 
                   transition-all duration-300 ease-out 
                   group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-1
                   flex items-center justify-center relative overflow-hidden"
        style={{ 
            backgroundColor: color.hex,
            transformStyle: 'preserve-3d', // For 3D effects if desired
            // Example 3D hover: group-hover:[transform:rotateY(10deg)]
        }}
        title={`Copy ${color.hex}`}
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCopy(e as any)}
      >
        {color.name && (
            <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-xs p-1 bg-black/40 backdrop-blur-sm rounded-md truncate"
                  style={{ color: readableTextColor }}
            >
                {color.name}
            </span>
        )}
        {hasCopied && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm z-10">
                Copied!
            </div>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="px-4 py-1.5 text-sm font-mono bg-slate-700/50 hover:bg-slate-600/70 text-slate-200 
                   rounded-md focus-ring-inset transition-colors duration-150"
        aria-label={`Copy color ${color.hex}`}
      >
        {color.hex}
      </button>
    </div>
  );
};

export default React.memo(ColorCard);