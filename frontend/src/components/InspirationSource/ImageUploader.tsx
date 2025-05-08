import React, { useState, type ChangeEvent, type FormEvent, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onExtract: (formData: FormData, numColors?: number) => Promise<void>; // From usePaletteApi
  isLoading: boolean;
  currentError: string | null;
  clearCurrentError: () => void;
}

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const MAX_FILE_SIZE_MB = 5; // Should ideally match backend config

const ImageUploader: React.FC<ImageUploaderProps> = ({ onExtract, isLoading, currentError, clearCurrentError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [numColorsToExtract, setNumColorsToExtract] = useState<number>(6); // Example if you add this option

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    clearCurrentError(); // Clear API error from parent
    setLocalError(null);  // Clear local validation error
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setLocalError(`Invalid file type. Please select a PNG, JPG, or GIF. (${file.type})`);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setLocalError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB. (${(file.size / (1024*1024)).toFixed(2)}MB)`);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [clearCurrentError]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setLocalError("Please select an image file first.");
      return;
    }
    clearCurrentError();
    setLocalError(null);

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    // If you add numColors option:
    // onExtract(formData, numColorsToExtract);
    await onExtract(formData); // Pass numColors if you implement it
  }, [selectedFile, onExtract, clearCurrentError]);

  const effectiveError = currentError || localError;

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Upload an Image
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Choose image (PNG, JPG, GIF, Max {MAX_FILE_SIZE_MB}MB)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept={ALLOWED_MIME_TYPES.join(',')}
            onChange={handleFileChange}
            className={`w-full text-sm text-gray-600 dark:text-gray-300
                       file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                       file:rounded-md file:border file:border-gray-300 dark:file:border-gray-600
                       file:text-sm file:font-semibold
                       file:bg-gray-50 dark:file:bg-gray-700
                       file:text-blue-600 dark:file:text-blue-400
                       hover:file:bg-gray-100 dark:hover:file:bg-gray-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       ${effectiveError ? 'file:border-red-500 dark:file:border-red-400' : ''}`}
            aria-describedby={effectiveError ? "imageUploadError" : undefined}
            aria-invalid={!!effectiveError}
            disabled={isLoading}
          />
        </div>

        {previewUrl && !effectiveError && (
          <div className="mb-4 p-2 border border-gray-200 dark:border-gray-700 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
            <img src={previewUrl} alt="Selected preview" className="max-h-40 rounded object-contain mx-auto" />
          </div>
        )}

        {effectiveError && (
            <p id="imageUploadError" role="alert" className="text-sm text-red-600 dark:text-red-400 mb-3">
                {effectiveError}
            </p>
        )}

        <button
          type="submit"
          disabled={!selectedFile || isLoading || !!localError}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? 'Extracting...' : 'Extract Palette'}
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;