import { useState, useCallback } from 'react';
import type { Palette, PaletteApiResponse } from '../types'; // Assuming types.ts is in src/

export interface PaletteApiOptions {
  baseUrl?: string;
}

export interface PaletteApiState {
  palette: Palette | null;
  isLoading: boolean;
  error: string | null;
}

export interface PaletteApiCalls {
  extractPalette: (formData: FormData, numColors?: number) => Promise<void>;
  generateRandomPalette: (numColors?: number, prompt?: string) => Promise<void>;
  clearPalette: () => void;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8000/api/palette'; // Default, can be overridden

export function usePaletteApi(options?: PaletteApiOptions): PaletteApiState & PaletteApiCalls {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = options?.baseUrl || API_BASE_URL;

  const clearError = useCallback(() => setError(null), []);
  const clearPalette = useCallback(() => {
    setPalette(null);
    clearError();
  }, [clearError]);


  const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || errorDetail;
      } catch (e) {
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
      } catch (err: any) {
        console.error("Error extracting palette:", err);
        setError(err.message || "Failed to extract palette from image.");
        setPalette(null); // Clear palette on error
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  const generateRandomPalette = useCallback(
    async (numColors?: number, prompt?: string) => {
      setIsLoading(true);
      setError(null);
      const url = new URL(`${baseUrl}/random`);
      if (numColors !== undefined) {
        url.searchParams.append('num_colors', String(numColors));
      }
      if (prompt) {
        url.searchParams.append('prompt', prompt);
      }

      try {
        const response = await fetch(url.toString(), { method: 'GET' });
        await handleApiResponse(response);
      } catch (err: any) {
        console.error("Error generating random palette:", err);
        setError(err.message || "Failed to generate a random palette.");
        setPalette(null); // Clear palette on error
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  return { palette, isLoading, error, extractPalette, generateRandomPalette, clearPalette, clearError };
}