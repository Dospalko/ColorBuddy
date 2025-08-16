import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onGenerateRandom: () => void;
  onClearPalette: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const KeyboardShortcuts = ({ 
  onGenerateRandom, 
  onClearPalette, 
  isVisible, 
  onToggle 
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          e.preventDefault();
          onGenerateRandom();
          break;
        case 'c':
          e.preventDefault();
          onClearPalette();
          break;
        case '?':
          e.preventDefault();
          onToggle();
          break;
        case 'escape':
          e.preventDefault();
          if (isVisible) onToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGenerateRandom, onClearPalette, onToggle, isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-purple-600/80 hover:bg-purple-700/80 
                   text-white p-3 rounded-full shadow-lg focus-ring z-50
                   transition-all duration-200 hover:scale-105"
        title="Show keyboard shortcuts (?)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Keyboard Shortcuts</h3>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white p-1 rounded focus-ring"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Generate random palette</span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 font-mono">G</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Clear current palette</span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 font-mono">C</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Show/hide shortcuts</span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 font-mono">?</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Close this dialog</span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 font-mono">Esc</kbd>
          </div>
        </div>
        
        <p className="text-xs text-slate-400 mt-4 text-center">
          Shortcuts work when no input field is focused
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
