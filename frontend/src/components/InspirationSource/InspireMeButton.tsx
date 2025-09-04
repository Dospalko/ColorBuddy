import { useState, useCallback } from 'react';

interface InspireMeButtonProps {
  onGenerate: (numColors?: number, prompt?: string, temperature?: 'warm' | 'cool' | 'neutral') => Promise<void>;
  isLoading: boolean;
}

const InspireMeButton = ({ onGenerate, isLoading }: InspireMeButtonProps) => {
  const [prompt, setPrompt] = useState('');
  const [numColors, setNumColors] = useState(5);
  const [temperature, setTemperature] = useState<'warm' | 'cool' | 'neutral'>('neutral');
  const [selectedCategory, setSelectedCategory] = useState<string>('nature');

  const handleClick = useCallback(async () => {
    let enhancedPrompt = prompt.trim();
    
    // Add temperature context if not neutral
    if (temperature !== 'neutral') {
      enhancedPrompt = enhancedPrompt ? `${enhancedPrompt}, ${temperature} colors` : `${temperature} colors`;
    }
    
    await onGenerate(numColors, enhancedPrompt || undefined, temperature);
  }, [onGenerate, prompt, numColors, temperature]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-6">
        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Number of Colors */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Colors</label>
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setNumColors(count)}
                  disabled={isLoading}
                  className={`px-2 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    numColors === count
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-400/50'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Temperature</label>
            <div className="flex gap-1">
              {[
                { value: 'warm', label: 'Warm', icon: '🔥', colors: 'reds, oranges, yellows' },
                { value: 'neutral', label: 'Any', icon: '🎨', colors: 'balanced mix' },
                { value: 'cool', label: 'Cool', icon: '❄️', colors: 'blues, greens, purples' }
              ].map((temp) => (
                <button
                  key={temp.value}
                  type="button"
                  onClick={() => setTemperature(temp.value as 'warm' | 'cool' | 'neutral')}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    temperature === temp.value
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-400/50'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                  title={temp.colors}
                >
                  <span className="text-xs">{temp.icon}</span>
                  <span>{temp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

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

        {/* Enhanced Prompt Suggestions with Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-300">Quick inspiration:</p>
            <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1"></div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            {[
              { id: 'nature', label: 'Nature', icon: '🌿' },
              { id: 'tech', label: 'Tech', icon: '🚀' },
              { id: 'vibes', label: 'Vibes', icon: '✨' },
              { id: 'brand', label: 'Brand', icon: '🏢' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={isLoading}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                  selectedCategory === category.id
                    ? 'bg-purple-500/20 text-purple-200 shadow-lg'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-xs">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Category-based Suggestions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(() => {
              const suggestions = {
                nature: [
                  { emoji: "🌊", text: "ocean waves", colors: "blues and teals" },
                  { emoji: "🌅", text: "golden sunset", colors: "oranges and pinks" }, 
                  { emoji: "🌲", text: "forest depths", colors: "deep greens" },
                  { emoji: "🍂", text: "autumn leaves", colors: "warm earth tones" },
                  { emoji: "🌸", text: "spring bloom", colors: "soft pastels" },
                  { emoji: "🏔️", text: "mountain peaks", colors: "cool grays and blues" }
                ],
                tech: [
                  { emoji: "🚀", text: "cyberpunk city", colors: "neon cyans and magentas" },
                  { emoji: "🤖", text: "ai interface", colors: "electric blues" },
                  { emoji: "⚡", text: "digital energy", colors: "bright yellows and blues" },
                  { emoji: "🔮", text: "holographic", colors: "iridescent pastels" },
                  { emoji: "💎", text: "crystal tech", colors: "prismatic colors" },
                  { emoji: "🌐", text: "matrix code", colors: "matrix greens" }
                ],
                vibes: [
                  { emoji: "☕", text: "cozy cafe", colors: "warm browns" },
                  { emoji: "🎵", text: "jazz lounge", colors: "deep blues and golds" },
                  { emoji: "🕯️", text: "candlelit", colors: "warm amber tones" },
                  { emoji: "🌙", text: "midnight mood", colors: "deep purples and blues" },
                  { emoji: "🎨", text: "artist studio", colors: "vibrant creative mix" },
                  { emoji: "🏖️", text: "tropical escape", colors: "bright tropical colors" }
                ],
                brand: [
                  { emoji: "💼", text: "corporate trust", colors: "professional blues" },
                  { emoji: "🌱", text: "eco friendly", colors: "natural greens" },
                  { emoji: "💎", text: "luxury premium", colors: "elegant golds and blacks" },
                  { emoji: "🎯", text: "startup energy", colors: "bold and modern" },
                  { emoji: "🏥", text: "healthcare calm", colors: "soothing blues and whites" },
                  { emoji: "🎪", text: "playful brand", colors: "fun and energetic" }
                ]
              };
              
              return suggestions[selectedCategory as keyof typeof suggestions].map((suggestion, index) => (
                <button
                  key={suggestion.text}
                  onClick={() => setPrompt(suggestion.text)}
                  disabled={isLoading}
                  className="group p-3 text-xs bg-white/5 hover:bg-white/10 text-slate-300 
                             border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200
                             hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                             flex flex-col items-center text-center min-h-[80px] justify-center"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <span className="text-lg mb-1 group-hover:scale-110 transition-transform">{suggestion.emoji}</span>
                  <span className="font-medium capitalize">{suggestion.text}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{suggestion.colors}</span>
                </button>
              ));
            })()}
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
                <span>
                  {prompt.trim() ? `Generate ${numColors} ${temperature !== 'neutral' ? temperature : ''} Colors` : `Generate ${numColors} Colors`}
                </span>
                <span className="text-xl">✨</span>
              </span>
            )}
          </button>
          
          {/* Enhanced Action hint */}
          {!isLoading && (
            <div className="text-center space-y-1">
              {prompt.trim() && (
                <p className="text-sm text-slate-400">
                  Theme: <span className="text-purple-400 font-medium">"{prompt.trim()}"</span>
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>{numColors} colors</span>
                {temperature !== 'neutral' && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{temperature} tones</span>
                  </>
                )}
                <span>•</span>
                <span className="capitalize">{selectedCategory} style</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspireMeButton;