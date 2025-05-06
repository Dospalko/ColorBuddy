import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Palette, PaletteApiResponse } from '../../types';
interface ImageUploaderProps {
  onPaletteExtracted: (palette: Palette) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onPaletteExtracted,
  setIsLoading,
  setError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null); // Clear previous errors
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image_file', selectedFile); // 'image_file' should match backend expected key

    try {
      const response = await fetch('http://localhost:8000/api/palette/extract', {
        method: 'POST',
        body: formData,
        // Headers are not strictly necessary for FormData with fetch,
        // but if backend requires 'Content-Type: multipart/form-data', browser sets it.
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: PaletteApiResponse = await response.json();
      if (data.palette && data.palette.length > 0) {
        onPaletteExtracted(data.palette);
      } else {
        throw new Error("Palette data not found in API response.");
      }
    } catch (error: any) {
      console.error("Error extracting palette:", error);
      setError(error.message || "Failed to extract palette from image.");
      onPaletteExtracted([]); // Clear any existing palette on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Upload an Image
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Choose image file (PNG, JPG, GIF)
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 dark:text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 dark:file:bg-blue-900
                       file:text-blue-700 dark:file:text-blue-300
                       hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Preview:</p>
            <img src={previewUrl} alt="Selected preview" className="mt-2 max-h-40 rounded" />
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded
                     focus:outline-none focus:shadow-outline
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Extract Palette
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;