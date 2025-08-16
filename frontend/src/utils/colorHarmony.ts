import type { Palette } from '../types';

// Convert hex to HSL for color harmony analysis
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  const lightness = (max + min) / 2;
  const saturation = diff === 0 ? 0 : lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);
  
  let hue = 0;
  if (diff !== 0) {
    if (max === r) hue = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / diff + 2) / 6;
    else hue = ((r - g) / diff + 4) / 6;
  }

  return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(lightness * 100)];
};

// Analyze color harmony types
export const analyzeColorHarmony = (palette: Palette): {
  harmonyType: string;
  description: string;
  temperature: 'warm' | 'cool' | 'neutral' | 'mixed';
  diversity: 'monochromatic' | 'analogous' | 'complementary' | 'diverse';
} => {
  if (palette.length < 2) {
    return {
      harmonyType: 'Single Color',
      description: 'Only one color present',
      temperature: 'neutral',
      diversity: 'monochromatic'
    };
  }

  const hslColors = palette.map(color => hexToHsl(color.hex));
  const hues = hslColors.map(([h]) => h);
  const saturations = hslColors.map(([, s]) => s);
  const lightnesses = hslColors.map(([, , l]) => l);

  // Temperature analysis
  const warmColors = hues.filter(h => h <= 60 || h >= 300).length;
  const coolColors = hues.filter(h => h > 60 && h < 300).length;
  
  let temperature: 'warm' | 'cool' | 'neutral' | 'mixed';
  if (warmColors > coolColors * 1.5) temperature = 'warm';
  else if (coolColors > warmColors * 1.5) temperature = 'cool';
  else if (Math.abs(warmColors - coolColors) <= 1) temperature = 'neutral';
  else temperature = 'mixed';

  // Diversity analysis
  const hueRange = Math.max(...hues) - Math.min(...hues);
  const avgSaturation = saturations.reduce((a, b) => a + b, 0) / saturations.length;
  const lightnessRange = Math.max(...lightnesses) - Math.min(...lightnesses);

  let diversity: 'monochromatic' | 'analogous' | 'complementary' | 'diverse';
  let harmonyType: string;
  let description: string;

  if (hueRange < 30) {
    diversity = 'monochromatic';
    harmonyType = 'Monochromatic';
    description = 'Colors share the same hue with variations in lightness and saturation';
  } else if (hueRange < 60) {
    diversity = 'analogous';
    harmonyType = 'Analogous';
    description = 'Colors are adjacent on the color wheel, creating harmony';
  } else if (hueRange > 150 && hueRange < 210) {
    diversity = 'complementary';
    harmonyType = 'Complementary';
    description = 'Colors are opposite on the color wheel, creating contrast';
  } else {
    diversity = 'diverse';
    harmonyType = 'Complex';
    description = 'A diverse mix of colors creating visual interest';
  }

  // Enhance description based on other properties
  if (avgSaturation > 70) {
    description += ' with vibrant saturation';
  } else if (avgSaturation < 30) {
    description += ' with muted tones';
  }

  if (lightnessRange > 60) {
    description += ' and high contrast';
  } else if (lightnessRange < 20) {
    description += ' with similar brightness';
  }

  return { harmonyType, description, temperature, diversity };
};
