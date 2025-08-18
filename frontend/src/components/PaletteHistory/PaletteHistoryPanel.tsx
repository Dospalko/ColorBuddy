import { useState } from 'react';
import type { Palette } from '../../types';

interface PaletteHistoryItem {
  id: string;
  palette: Palette;
  timestamp: number;
  source: 'image' | 'ai' | 'manual';
  name?: string;
  isFavorite: boolean;
}

interface PaletteHistoryPanelProps {
  history: PaletteHistoryItem[];
  favorites: PaletteHistoryItem[];
  onSelectPalette: (palette: Palette) => void;
  onToggleFavorite: (id: string) => void;
  onRemovePalette: (id: string) => void;
  onRenamePalette: (id: string, newName: string) => void;
  onClearHistory: () => void;
  isHistoryEmpty: boolean;
}

const PaletteHistoryPanel = ({
  history,
  favorites,
  onSelectPalette,
  onToggleFavorite,
  onRemovePalette,
  onRenamePalette,
  onClearHistory,
  isHistoryEmpty,
}: PaletteHistoryPanelProps) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const displayItems = activeTab === 'recent' ? history : favorites;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'image':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'ai':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'manual':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleStartEditing = (item: PaletteHistoryItem) => {
    setEditingId(item.id);
    setEditingName(item.name || '');
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onRenamePalette(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const PalettePreview = ({ palette }: { palette: Palette }) => (
    <div className="flex gap-1">
      {palette.slice(0, 5).map((color, index) => (
        <div
          key={index}
          className="w-6 h-6 rounded-md shadow-sm border border-white/10"
          style={{ backgroundColor: color.hex }}
          title={color.hex}
        />
      ))}
      {palette.length > 5 && (
        <div className="w-6 h-6 rounded-md bg-slate-600/50 border border-white/10 flex items-center justify-center">
          <span className="text-xs text-slate-300">+{palette.length - 5}</span>
        </div>
      )}
    </div>
  );

  if (isHistoryEmpty) {
    return (
      <div className="glassmorphic p-8 text-center">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">No Palettes Yet</h3>
        <p className="text-slate-400 mb-6">
          Generate your first palette and it will appear here for easy access later.
        </p>
        <div className="text-4xl text-slate-600 mb-4">🎨</div>
      </div>
    );
  }

  return (
    <div className="glassmorphic p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold gradient-text">Palette History</h3>
          <p className="text-slate-400 text-sm mt-1">
            {history.length} palette{history.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
            title="Clear all history"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'recent'
              ? 'bg-purple-500/20 text-purple-200 shadow-lg'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          Recent ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'favorites'
              ? 'bg-purple-500/20 text-purple-200 shadow-lg'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Palette List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-500 mb-2">
              {activeTab === 'favorites' ? '⭐' : '📝'}
            </div>
            <p className="text-slate-400">
              {activeTab === 'favorites' 
                ? 'No favorite palettes yet' 
                : 'No recent palettes'
              }
            </p>
          </div>
        ) : (
          displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                {/* Palette Preview */}
                <div className="flex-shrink-0">
                  <PalettePreview palette={item.palette} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {editingId === item.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-green-400 hover:text-green-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <h4 className="font-medium text-slate-200 text-sm mb-1 truncate group-hover:text-purple-200 transition-colors">
                      {item.name}
                    </h4>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {getSourceIcon(item.source)}
                    <span className="capitalize">{item.source}</span>
                    <span>•</span>
                    <span>{formatTimestamp(item.timestamp)}</span>
                    <span>•</span>
                    <span>{item.palette.length} colors</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onSelectPalette(item.palette)}
                    className="p-2 text-slate-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                    title="Load this palette"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.isFavorite
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-slate-400 hover:text-yellow-400'
                    }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleStartEditing(item)}
                    className="p-2 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                    title="Rename palette"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onRemovePalette(item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete palette"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaletteHistoryPanel;
