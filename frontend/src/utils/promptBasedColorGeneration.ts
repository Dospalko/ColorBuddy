import type { Palette } from '../types';

interface ColorTheme {
  name: string;
  keywords: string[];
  baseColors: string[];
  variations: string[];
}

// Comprehensive color themes based on common prompts
const COLOR_THEMES: ColorTheme[] = [
  // Ocean/Water themes
  {
    name: 'ocean',
    keywords: ['ocean', 'sea', 'wave', 'water', 'marine', 'aquatic', 'deep', 'blue', 'teal', 'turquoise'],
    baseColors: ['#0077be', '#20b2aa', '#4682b4', '#5f9ea0', '#008b8b'],
    variations: ['#e0f6ff', '#87ceeb', '#4169e1', '#191970', '#2e8b57']
  },
  
  // Sunset/Warm themes
  {
    name: 'sunset',
    keywords: ['sunset', 'sunrise', 'warm', 'golden', 'orange', 'pink', 'coral', 'amber'],
    baseColors: ['#ff6b35', '#f7931e', '#ffb347', '#ff69b4', '#ff7f50'],
    variations: ['#fff8dc', '#ffa500', '#ff4500', '#dc143c', '#b22222']
  },
  
  // Forest/Nature themes
  {
    name: 'forest',
    keywords: ['forest', 'tree', 'nature', 'green', 'leaf', 'plant', 'earth', 'moss', 'sage'],
    baseColors: ['#228b22', '#32cd32', '#90ee90', '#556b2f', '#6b8e23'],
    variations: ['#f0fff0', '#98fb98', '#8fbc8f', '#2e8b57', '#006400']
  },
  
  // Autumn themes
  {
    name: 'autumn',
    keywords: ['autumn', 'fall', 'leaf', 'harvest', 'russet', 'amber', 'copper', 'bronze'],
    baseColors: ['#d2691e', '#cd853f', '#daa520', '#b22222', '#a0522d'],
    variations: ['#fff8dc', '#f4a460', '#d2b48c', '#8b4513', '#654321']
  },
  
  // Tech/Cyberpunk themes
  {
    name: 'tech',
    keywords: ['cyber', 'tech', 'digital', 'neon', 'electric', 'matrix', 'futuristic', 'ai', 'robot'],
    baseColors: ['#00ffff', '#ff00ff', '#00ff00', '#8a2be2', '#4169e1'],
    variations: ['#e6e6fa', '#7fffd4', '#da70d6', '#9370db', '#191970']
  },
  
  // Coffee/Brown themes
  {
    name: 'coffee',
    keywords: ['coffee', 'cafe', 'brown', 'mocha', 'espresso', 'chocolate', 'cocoa', 'caramel'],
    baseColors: ['#8b4513', '#a0522d', '#d2691e', '#cd853f', '#deb887'],
    variations: ['#f5f5dc', '#d2b48c', '#bc8f8f', '#696969', '#2f4f4f']
  },
  
  // Spring themes
  {
    name: 'spring',
    keywords: ['spring', 'bloom', 'flower', 'pastel', 'fresh', 'mint', 'lavender', 'peach'],
    baseColors: ['#ffb6c1', '#98fb98', '#f0e68c', '#dda0dd', '#87ceeb'],
    variations: ['#fffacd', '#f5fffa', '#fff0f5', '#e6e6fa', '#f0f8ff']
  },
  
  // Night/Dark themes
  {
    name: 'night',
    keywords: ['night', 'midnight', 'dark', 'moon', 'star', 'shadow', 'deep', 'black'],
    baseColors: ['#191970', '#2f4f4f', '#483d8b', '#663399', '#4b0082'],
    variations: ['#e6e6fa', '#708090', '#8b8b8b', '#2e2e2e', '#000000']
  },
  
  // Corporate/Professional themes
  {
    name: 'corporate',
    keywords: ['corporate', 'business', 'professional', 'trust', 'clean', 'minimal', 'office'],
    baseColors: ['#003366', '#336699', '#6699cc', '#999999', '#cccccc'],
    variations: ['#f8f9fa', '#e9ecef', '#6c757d', '#495057', '#212529']
  },
  
  // Tropical themes
  {
    name: 'tropical',
    keywords: ['tropical', 'beach', 'paradise', 'bright', 'vibrant', 'lime', 'aqua', 'coral'],
    baseColors: ['#00ced1', '#ff7f50', '#32cd32', '#ffd700', '#ff69b4'],
    variations: ['#f0ffff', '#7fffd4', '#98fb98', '#ffffe0', '#ffe4e1']
  }
];

// Color temperature mappings
const TEMPERATURE_ADJUSTMENTS = {
  warm: {
    shift: { hue: 30, saturation: 10, lightness: 5 },
    baseColors: ['#ff4500', '#ff6347', '#ffa500', '#ffb347', '#daa520']
  },
  cool: {
    shift: { hue: -30, saturation: 5, lightness: -5 },
    baseColors: ['#4169e1', '#00bfff', '#87ceeb', '#5f9ea0', '#20b2aa']
  },
  neutral: {
    shift: { hue: 0, saturation: 0, lightness: 0 },
    baseColors: []
  }
};

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h * 6 && h * 6 < 1) {
    r = c; g = x; b = 0;
  } else if (1 <= h * 6 && h * 6 < 2) {
    r = x; g = c; b = 0;
  } else if (2 <= h * 6 && h * 6 < 3) {
    r = 0; g = c; b = x;
  } else if (3 <= h * 6 && h * 6 < 4) {
    r = 0; g = x; b = c;
  } else if (4 <= h * 6 && h * 6 < 5) {
    r = x; g = 0; b = c;
  } else if (5 <= h * 6 && h * 6 < 6) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function adjustColorTemperature(hex: string, temperature: 'warm' | 'cool' | 'neutral'): string {
  if (temperature === 'neutral') return hex;
  
  const [h, s, l] = hexToHsl(hex);
  const adjustment = TEMPERATURE_ADJUSTMENTS[temperature].shift;
  
  const newHue = (h + adjustment.hue + 360) % 360;
  const newSat = Math.max(0, Math.min(100, s + adjustment.saturation));
  const newLight = Math.max(0, Math.min(100, l + adjustment.lightness));
  
  return hslToHex(newHue, newSat, newLight);
}

export function generatePromptBasedPalette(
  prompt: string,
  numColors: number = 5,
  temperature: 'warm' | 'cool' | 'neutral' = 'neutral'
): Palette {
  const normalizedPrompt = prompt.toLowerCase();
  
  // Find the best matching theme
  let matchedTheme: ColorTheme | null = null;
  let bestScore = 0;
  
  for (const theme of COLOR_THEMES) {
    let score = 0;
    for (const keyword of theme.keywords) {
      if (normalizedPrompt.includes(keyword)) {
        score += keyword.length; // Longer matches get higher scores
      }
    }
    if (score > bestScore) {
      bestScore = score;
      matchedTheme = theme;
    }
  }
  
  // If no theme matched, use temperature-based generation
  let baseColors: string[];
  if (matchedTheme) {
    baseColors = [...matchedTheme.baseColors, ...matchedTheme.variations];
  } else if (temperature !== 'neutral') {
    baseColors = TEMPERATURE_ADJUSTMENTS[temperature].baseColors;
  } else {
    // Fallback to a balanced palette
    baseColors = ['#4285f4', '#34a853', '#ea4335', '#fbbc04', '#9aa0a6'];
  }
  
  // Select and adjust colors
  const selectedColors: string[] = [];
  
  // Ensure we have enough base colors by cycling through them
  for (let i = 0; i < numColors; i++) {
    const baseColor = baseColors[i % baseColors.length];
    let adjustedColor = adjustColorTemperature(baseColor, temperature);
    
    // Add some variation to avoid exact duplicates
    if (i >= baseColors.length) {
      const [h, s, l] = hexToHsl(adjustedColor);
      const hueVariation = (Math.random() - 0.5) * 60;
      const satVariation = (Math.random() - 0.5) * 20;
      const lightVariation = (Math.random() - 0.5) * 30;
      
      const newHue = (h + hueVariation + 360) % 360;
      const newSat = Math.max(15, Math.min(90, s + satVariation));
      const newLight = Math.max(15, Math.min(85, l + lightVariation));
      
      adjustedColor = hslToHex(newHue, newSat, newLight);
    }
    
    selectedColors.push(adjustedColor);
  }
  
  // Convert to Palette format with color names
  return selectedColors.map((hex, index) => ({
    hex,
    name: `${matchedTheme?.name || 'generated'}-${index + 1}`
  }));
}

// Helper function to get a random color from a theme
export function getRandomColorFromTheme(themeName: string): string {
  const theme = COLOR_THEMES.find(t => t.name === themeName);
  if (!theme) return '#666666';
  
  const allColors = [...theme.baseColors, ...theme.variations];
  return allColors[Math.floor(Math.random() * allColors.length)];
}

export { COLOR_THEMES };
