import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number; // Time in ms to show "copied" state
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  hasCopied: boolean;
  error: Error | null;
}

export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}): UseClipboardReturn {
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        const err = new Error('Clipboard API not available');
        console.warn(err.message);
        setError(err);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setError(null);

        setTimeout(() => setHasCopied(false), timeout);
        return true;
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setError(err as Error);
        setHasCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copy, hasCopied, error };
}