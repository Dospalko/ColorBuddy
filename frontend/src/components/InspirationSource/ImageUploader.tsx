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
      <div className="space-y-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Upload Area */}
          <div className="relative">
            <label
              htmlFor="imageUpload"
              className={`relative block w-full h-40 border-2 border-dashed rounded-2xl 
                         cursor-pointer transition-all duration-300 group
                         ${effectiveError 
                           ? 'border-red-400/50 bg-red-500/5 hover:bg-red-500/10' 
                           : 'border-purple-400/30 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/50'
                         }
                         ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02]'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept={ALLOWED_MIME_TYPES.join(',')}
                onChange={handleFileChange}
                className="sr-only"
                aria-describedby={effectiveError ? "imageUploadError" : "imageUploadHelp"}
                aria-invalid={!!effectiveError}
                disabled={isLoading}
              />
              
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{selectedFile.name}</p>
                      <p className="text-sm text-slate-400">{(selectedFile.size / (1024*1024)).toFixed(1)}MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">Drop your image here</p>
                      <p className="text-sm text-slate-400">
                        or <span className="text-purple-400 font-medium">click to browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        PNG, JPG, GIF up to {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Preview */}
          {previewUrl && !effectiveError && (
            <div className="relative">
              <div className="glassmorphic p-4 rounded-2xl">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={previewUrl} 
                    alt="Selected preview" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-slate-300">Ready to extract colors</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {effectiveError && (
            <div className="glassmorphic p-4 border-red-400/30 bg-red-500/10">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{effectiveError}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || isLoading || !!localError}
            className="btn-primary w-full relative overflow-hidden"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Extracting Colors...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Extract Palette
              </span>
            )}
          </button>
        </form>
      </div>
    );
  };
  
  export default ImageUploader;
  