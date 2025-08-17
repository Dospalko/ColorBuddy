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
              className={`relative block w-full min-h-[180px] sm:h-48 border-2 border-dashed rounded-2xl 
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
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-200 text-lg truncate">{selectedFile.name}</p>
                      <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {(selectedFile.size / (1024*1024)).toFixed(1)}MB
                        </span>
                        <span className="w-px h-4 bg-slate-600"></span>
                        <span className="capitalize">{selectedFile.type.split('/')[1]}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
                      >
                        Choose different file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-200 text-lg">Drop your image here</p>
                      <p className="text-slate-400">
                        or <span className="text-purple-400 font-semibold">click to browse</span>
                      </p>
                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg text-xs text-slate-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          PNG, JPG, GIF up to {MAX_FILE_SIZE_MB}MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Preview */}
          {previewUrl && !effectiveError && (
            <div className="relative">
              <div className="glassmorphic p-6 rounded-2xl">
                <div className="relative overflow-hidden rounded-xl group">
                  <img 
                    src={previewUrl} 
                    alt="Selected preview" 
                    className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="glassmorphic px-3 py-1 text-sm text-white font-medium">
                        Preview
                      </div>
                      <div className="glassmorphic px-3 py-1 text-xs text-slate-300">
                        {selectedFile?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-300 font-medium">✨ Ready to extract beautiful colors</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {effectiveError && (
            <div className="glassmorphic p-4 border-red-400/30 bg-red-500/10 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-300 mb-1">Upload Error</p>
                  <p className="text-sm text-red-400">{effectiveError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Enhanced Layout */}
          <div className="space-y-4">
            {/* Primary Extract Button */}
            <button
              type="submit"
              disabled={!selectedFile || isLoading || !!localError}
              className="btn-primary w-full h-14 text-lg font-semibold relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <span>Extracting Colors...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Extract Color Palette</span>
                </span>
              )}
            </button>

            {/* Secondary Actions */}
            {selectedFile && !isLoading && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    clearCurrentError();
                    setLocalError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="btn-secondary flex-1 h-12 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear & Start Over
                </button>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex-1 h-12 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Choose Different File
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  };
  
  export default ImageUploader;
  