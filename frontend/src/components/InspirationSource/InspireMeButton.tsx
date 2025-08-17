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
    <div className="w-full space-y-6">
      <div className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-4">
          <label htmlFor="aiPrompt" className="block text-sm font-semibold text-slate-300">
            Describe your vision (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              id="aiPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., ocean sunset, cyberpunk vibes, forest morning..."
              className="w-full px-4 py-4 text-slate-200 bg-white/5 placeholder-slate-500
                         border border-slate-600/50 rounded-xl focus:outline-none focus:border-purple-500 
                         focus:ring-2 focus:ring-purple-500/20 transition-all duration-200
                         backdrop-blur-sm text-base input-glow"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
            <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Try themes like "warm autumn", "tech startup", "minimalist luxury", or leave blank for surprise
          </p>
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-300">Quick inspiration:</p>
            <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { emoji: "🌊", text: "ocean vibes", colors: "blues and teals" },
              { emoji: "🌅", text: "sunset warmth", colors: "oranges and pinks" }, 
              { emoji: "🌲", text: "forest calm", colors: "greens and browns" },
              { emoji: "🚀", text: "futuristic tech", colors: "cyans and purples" },
              { emoji: "🎨", text: "creative studio", colors: "vibrant mix" },
              { emoji: "☕", text: "cozy cafe", colors: "warm browns" }
            ].map((suggestion, index) => (
              <button
                key={suggestion.text}
                onClick={() => setPrompt(suggestion.text)}
                disabled={isLoading}
                className="group p-3 text-xs bg-white/5 hover:bg-white/10 text-slate-300 
                           border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200
                           hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                           flex flex-col items-center text-center min-h-[80px] justify-center"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">{suggestion.emoji}</span>
                <span className="font-medium capitalize">{suggestion.text}</span>
                <span className="text-[10px] text-slate-500 mt-1">{suggestion.colors}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Generate Button */}
        <div className="space-y-3">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="btn-primary w-full h-14 text-lg font-semibold relative overflow-hidden group"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="relative">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span>Conjuring Magic...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{prompt.trim() ? 'Generate Themed Palette' : 'Surprise Me!'}</span>
                <span className="text-xl">✨</span>
              </span>
            )}
          </button>
          
          {/* Action hint */}
          {prompt.trim() && !isLoading && (
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Creating palette inspired by <span className="text-purple-400 font-medium">"{prompt.trim()}"</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspireMeButton;