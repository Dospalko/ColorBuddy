import { useState, useCallback } from 'react';
import type { Palette, PaletteApiResponse } from '../types';
import { generatePromptBasedPalette } from '../utils/promptBasedColorGeneration'; // Assuming types.ts is in src/

export interface PaletteApiOptions {
  baseUrl?: string;
}

export interface PaletteApiState {
  palette: Palette | null;
  isLoading: boolean;
  error: string | null;
  lastSource?: 'image' | 'ai' | 'manual';
}

export interface PaletteApiCalls {
  extractPalette: (formData: FormData, numColors?: number) => Promise<void>;
  generateRandomPalette: (numColors?: number, prompt?: string, temperature?: 'warm' | 'cool' | 'neutral') => Promise<void>;
  setPalette: (palette: Palette | null) => void;
  clearPalette: () => void;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8000/api/palette'; // Default, can be overridden

export function usePaletteApi(options?: PaletteApiOptions): PaletteApiState & PaletteApiCalls {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<'image' | 'ai' | 'manual' | undefined>(undefined);

  const baseUrl = options?.baseUrl || API_BASE_URL;

  const clearError = useCallback(() => setError(null), []);
  const clearPalette = useCallback(() => {
    setPalette(null);
    clearError();
  }, [clearError]);

  const setCurrentPalette = useCallback((newPalette: Palette | null) => {
    setPalette(newPalette);
    setError(null);
    setLastSource('manual'); // When manually setting, it's usually from history
  }, []);


  const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || errorDetail;
      } catch {
        // Ignore if response body is not JSON
      }
      throw new Error(errorDetail);
    }
    const data: PaletteApiResponse = await response.json();
    if (data.palette && data.palette.length > 0) {
      setPalette(data.palette);
      setError(null);
    } else {
      throw new Error(data.message || "Palette data not found or empty in API response.");
    }
  };

  const extractPalette = useCallback(
    async (formData: FormData, numColors?: number) => {
      setIsLoading(true);
      setError(null);
      setLastSource('image');
      const url = new URL(`${baseUrl}/extract`);
      if (numColors !== undefined) {
        url.searchParams.append('num_colors', String(numColors));
      }

      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          body: formData,
        });
        await handleApiResponse(response);
      } catch (err: unknown) {
        console.error("Error extracting palette:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to extract palette from image.";
        setError(errorMessage);
        setPalette(null); // Clear palette on error
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  const generateRandomPalette = useCallback(
    async (numColors?: number, prompt?: string, temperature?: 'warm' | 'cool' | 'neutral') => {
      setIsLoading(true);
      setError(null);
      setLastSource('ai');
      
      try {
        // Use our intelligent local generation instead of backend
        const generatedPalette = generatePromptBasedPalette(
          prompt || '',
          numColors || 5,
          temperature || 'neutral'
        );
        
        setPalette(generatedPalette);
        setError(null);
      } catch (err: unknown) {
        console.error("Error generating prompt-based palette:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to generate palette.";
        setError(errorMessage);
        setPalette(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { palette, isLoading, error, lastSource, extractPalette, generateRandomPalette, clearPalette, clearError, setPalette: setCurrentPalette };
}