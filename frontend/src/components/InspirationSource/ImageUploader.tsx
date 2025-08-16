import { useState, type ChangeEvent, type FormEvent, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onExtract: (formData: FormData, numColors?: number) => Promise<void>; // From usePaletteApi
  isLoading: boolean;
  currentError: string | null;
  clearCurrentError: () => void;
}

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const MAX_FILE_SIZE_MB = 5; // Should ideally match backend config

const ImageUploader = ({ onExtract, isLoading, currentError, clearCurrentError }: ImageUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      clearCurrentError();
      setLocalError(null);
      const file = event.target.files?.[0];
  
      if (file) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          setLocalError(`Invalid type. Use PNG, JPG, GIF. (${file.type})`);
          setSelectedFile(null); setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setLocalError(`Too large (Max ${MAX_FILE_SIZE_MB}MB). (${(file.size / (1024*1024)).toFixed(1)}MB)`);
          setSelectedFile(null); setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setSelectedFile(null); setPreviewUrl(null);
      }
    }, [clearCurrentError]);
  
    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedFile) { setLocalError("Please select an image."); return; }
      clearCurrentError(); setLocalError(null);
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      await onExtract(formData);
    }, [selectedFile, onExtract, clearCurrentError]);
  
    const effectiveError = currentError || localError;
  
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-white text-center">Upload an Image</h3>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="imageUpload"
              className="sr-only" // Visually hidden, but good for a11y if input isn't obvious
            >
              Choose image file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="imageUpload"
              name="imageUpload"
              accept={ALLOWED_MIME_TYPES.join(',')}
              onChange={handleFileChange}
              className={`w-full text-sm px-3 py-2.5 rounded-lg border-2
                         border-dashed placeholder-slate-400
                         text-slate-300 bg-white/5 hover:bg-white/10
                         focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                         transition-colors duration-200
                         file:hidden cursor-pointer
                         ${effectiveError ? 'border-red-500/70 text-red-300' : 'border-slate-600/70 hover:border-slate-500/70'}`}
              aria-describedby={effectiveError ? "imageUploadError" : "imageUploadHelp"}
              aria-invalid={!!effectiveError}
              disabled={isLoading}
            />
            <p id="imageUploadHelp" className="mt-1.5 text-xs text-slate-400 text-center">
              {selectedFile ? selectedFile.name : `Click to select (PNG, JPG, GIF, Max ${MAX_FILE_SIZE_MB}MB)`}
            </p>
          </div>
  
          {previewUrl && !effectiveError && (
            <div className="p-2 border border-slate-700 rounded-md bg-black/20">
              <img src={previewUrl} alt="Selected preview" className="max-h-36 rounded object-contain mx-auto" />
            </div>
          )}
  
          {effectiveError && (
              <p id="imageUploadError" role="alert" className="text-sm text-red-400 text-center py-1 px-2 bg-red-500/20 rounded-md">
                  {effectiveError}
              </p>
          )}
  
          <button
            type="submit"
            disabled={!selectedFile || isLoading || !!localError}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700
                       text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg
                       focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Extracting...
              </span>
            ) : 'Reveal Colors'}
          </button>
        </form>
      </div>
    );
  };
  
  export default ImageUploader;
  