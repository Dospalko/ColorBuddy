import { useState, useEffect, useCallback } from 'react';
import type { Palette } from '../types';

interface PaletteHistoryItem {
  id: string;
  palette: Palette;
  timestamp: number;
  source: 'image' | 'ai' | 'manual';
  name?: string;
  isFavorite: boolean;
}

interface UsePaletteHistoryReturn {
  history: PaletteHistoryItem[];
  favorites: PaletteHistoryItem[];
  savePalette: (palette: Palette, source: 'image' | 'ai' | 'manual', name?: string) => void;
  toggleFavorite: (id: string) => void;
  removePalette: (id: string) => void;
  clearHistory: () => void;
  renamePalette: (id: string, newName: string) => void;
  getPaletteById: (id: string) => PaletteHistoryItem | undefined;
  isHistoryEmpty: boolean;
}

const STORAGE_KEY = 'colorbuddy-palette-history';
const MAX_HISTORY_SIZE = 50; // Limit history to prevent localStorage bloat

const generatePaletteId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generatePaletteName = (palette: Palette, source: string): string => {
  const colors = palette.length;
  const timestamp = new Date().toLocaleDateString();
  
  switch (source) {
    case 'image':
      return `Image Palette (${colors} colors) - ${timestamp}`;
    case 'ai':
      return `AI Generated (${colors} colors) - ${timestamp}`;
    case 'manual':
      return `Custom Palette (${colors} colors) - ${timestamp}`;
    default:
      return `Palette (${colors} colors) - ${timestamp}`;
  }
};

const loadHistoryFromStorage = (): PaletteHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Validate structure and sort by timestamp (newest first)
    return parsed
      .filter((item): item is PaletteHistoryItem => 
        item && 
        typeof item.id === 'string' &&
        Array.isArray(item.palette) &&
        typeof item.timestamp === 'number' &&
        ['image', 'ai', 'manual'].includes(item.source) &&
        typeof item.isFavorite === 'boolean'
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load palette history from localStorage:', error);
    return [];
  }
};

const saveHistoryToStorage = (history: PaletteHistoryItem[]): void => {
  try {
    // Keep only the most recent items to prevent storage bloat
    const trimmedHistory = history.slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save palette history to localStorage:', error);
  }
};

export const usePaletteHistory = (): UsePaletteHistoryReturn => {
  const [history, setHistory] = useState<PaletteHistoryItem[]>(() => loadHistoryFromStorage());

  // Save to localStorage whenever history changes
  useEffect(() => {
    saveHistoryToStorage(history);
  }, [history]);

  const savePalette = useCallback((palette: Palette, source: 'image' | 'ai' | 'manual', name?: string) => {
    if (!palette || palette.length === 0) return;

    const newItem: PaletteHistoryItem = {
      id: generatePaletteId(),
      palette: [...palette], // Create a copy to avoid reference issues
      timestamp: Date.now(),
      source,
      name: name || generatePaletteName(palette, source),
      isFavorite: false,
    };

    setHistory(prevHistory => {
      // Check if this exact palette already exists (to avoid duplicates)
      const paletteString = JSON.stringify(palette.map(c => c.hex).sort());
      const existingIndex = prevHistory.findIndex(item => 
        JSON.stringify(item.palette.map(c => c.hex).sort()) === paletteString
      );

      if (existingIndex !== -1) {
        // Update existing palette's timestamp to move it to the top
        const updatedHistory = [...prevHistory];
        updatedHistory[existingIndex] = {
          ...updatedHistory[existingIndex],
          timestamp: Date.now(),
          source, // Update source in case it changed
        };
        return updatedHistory.sort((a, b) => b.timestamp - a.timestamp);
      }

      // Add new palette to the beginning
      return [newItem, ...prevHistory];
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  }, []);

  const removePalette = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const renamePalette = useCallback((id: string, newName: string) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id
          ? { ...item, name: newName.trim() || item.name }
          : item
      )
    );
  }, []);

  const getPaletteById = useCallback((id: string): PaletteHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  // Computed values
  const favorites = history.filter(item => item.isFavorite);
  const isHistoryEmpty = history.length === 0;

  return {
    history,
    favorites,
    savePalette,
    toggleFavorite,
    removePalette,
    clearHistory,
    renamePalette,
    getPaletteById,
    isHistoryEmpty,
  };
};
