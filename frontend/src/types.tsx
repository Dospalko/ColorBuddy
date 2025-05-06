export interface Color {
    hex: string;
    name?: string; // Optional: if AI or image analysis can provide a name
    // You might add RGB values or other properties later if needed
  }
  
  // Represents a full palette, which is an array of Color objects
  export type Palette = Color[];
  
  // Type for the data expected from the backend palette extraction/generation
  export interface PaletteApiResponse {
    palette: Palette;
    message?: string; // Optional message from backend
  }