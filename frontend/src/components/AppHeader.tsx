const AppHeader = () => {
  return (
    <header className="relative text-center mb-16 md:mb-24">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl float"></div>
        <div className="absolute -top-20 -right-32 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl float-delayed"></div>
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl float-delayed-2"></div>
      </div>
      
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                        backdrop-blur-sm border border-purple-500/30 rounded-full text-sm text-purple-200">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          AI-Powered • Real-time • Free
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
          <span className="gradient-text">Color</span>
          <span className="text-white">Buddy</span>
          <span className="ml-3 text-5xl md:text-7xl">🎨</span>
        </h1>

        {/* Subtitle */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">AI Palette Magician</span>
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Generate stunning, accessible color palettes from images or AI prompts. 
            Export to Tailwind, CSS, and more. No sign-up required.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: "🖼️", text: "Image Analysis" },
            { icon: "🤖", text: "AI Generation" },
            { icon: "♿", text: "WCAG Compliant" },
            { icon: "⚡", text: "Instant Export" }
          ].map((feature, index) => (
            <div key={index} 
                 className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm 
                           border border-white/10 rounded-full text-sm text-slate-300 
                           hover:bg-white/10 transition-all duration-200">
              <span className="mr-2 text-base">{feature.icon}</span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-sm text-slate-400 font-medium">
            ↓ Start creating below ↓
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;