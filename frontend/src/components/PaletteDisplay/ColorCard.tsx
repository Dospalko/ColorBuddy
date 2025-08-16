import { memo } from 'react';
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copy(color.hex);
    }
  };

  return (
    <div className="flex flex-col items-center group">
      {/* Color Swatch */}
      <div
        className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl shadow-lg mb-4 cursor-pointer 
                   transition-all duration-300 ease-out overflow-hidden
                   group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-2
                   transform-gpu"
        style={{ 
            backgroundColor: color.hex,
        }}
        title={`Copy ${color.hex}`}
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        {/* Color Name Badge */}
        {color.name && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-center">
              <span className="text-xs font-medium truncate block" style={{ color: readableTextColor }}>
                {color.name}
              </span>
            </div>
          </div>
        )}

        {/* Copy Success Overlay */}
        {hasCopied && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10
                         animate-in fade-in duration-200">
            <div className="text-center text-white">
              <svg className="w-8 h-8 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold">Copied!</span>
            </div>
          </div>
        )}

        {/* Corner Accent */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-white/20 rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Hex Code Button */}
      <div className="space-y-2 text-center">
        <button
          onClick={handleCopy}
          className="px-4 py-2 font-mono text-sm bg-slate-800/50 hover:bg-slate-700/70 
                     text-slate-200 rounded-lg backdrop-blur-sm
                     focus-ring-inset transition-all duration-200 
                     hover:scale-105 border border-slate-600/30 hover:border-slate-500/50"
          aria-label={`Copy color ${color.hex}`}
        >
          {color.hex}
        </button>
        
        {/* Quick Actions */}
        <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Could add more actions like color variations
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700/50 transition-colors"
            title="More options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ColorCard);