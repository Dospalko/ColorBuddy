import { useState, useCallback } from 'react';

interface InspireMeButtonProps {
  onGenerate: (numColors?: number, prompt?: string) => Promise<void>;
  isLoading: boolean;
}

const InspireMeButton = ({ onGenerate, isLoading }: InspireMeButtonProps) => {
  const [prompt, setPrompt] = useState('');

  const handleClick = useCallback(async () => {
    await onGenerate(5, prompt.trim() || undefined);
  }, [onGenerate, prompt]);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-white text-center">Conjure a Palette</h3>
      <div className="space-y-5">
          <div>
            <label htmlFor="aiPrompt" className="sr-only">
                Palette theme or keywords
            </label>
            <input
                type="text"
                id="aiPrompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., mystic forest, retro wave, calm ocean"
                className="w-full px-4 py-3 text-slate-200 bg-white/5 placeholder-slate-500
                           border-2 border-slate-600/70 rounded-lg focus:outline-none focus:border-purple-500 
                           focus:ring-1 focus:ring-purple-500 transition-colors duration-200"
                disabled={isLoading}
            />
            <p className="mt-1.5 text-xs text-slate-400 text-center">
                Describe a theme, or leave blank for random!
            </p>
        </div>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                     text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg
                     focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-base"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
           ) : 'Summon Palette ✨'}
        </button>
      </div>
    </div>
  );
};

export default InspireMeButton;