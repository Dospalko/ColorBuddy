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
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-3">
          <label htmlFor="aiPrompt" className="block text-sm font-medium text-slate-300">
            Describe your vision (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              id="aiPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., ocean sunset, cyberpunk vibes, forest morning..."
              className="w-full px-4 py-3 text-slate-200 bg-white/5 placeholder-slate-500
                         border border-slate-600/50 rounded-xl focus:outline-none focus:border-purple-500 
                         focus:ring-2 focus:ring-purple-500/20 transition-all duration-200
                         backdrop-blur-sm"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            💡 Try themes like "warm autumn", "tech startup", "minimalist luxury", or leave blank for surprise
          </p>
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300">Quick inspiration:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "🌊 Ocean vibes",
              "🌅 Sunset warmth", 
              "🌲 Forest calm",
              "🚀 Futuristic tech",
              "🎨 Creative studio",
              "☕ Cozy cafe"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion.split(' ').slice(1).join(' '))}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 
                           border border-white/10 rounded-lg transition-all duration-200
                           hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="btn-primary w-full relative overflow-hidden group"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conjuring Magic...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {prompt.trim() ? 'Generate Themed Palette' : 'Surprise Me!'} ✨
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default InspireMeButton;