// Color naming utilities for better UX
export const getColorName = (hex: string): string => {
  // Basic color name mapping - could be expanded with a color naming library
  const colorMap: Record<string, string> = {
    '#FF0000': 'Red',
    '#00FF00': 'Green', 
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
  };

  // Exact match first
  if (colorMap[hex.toUpperCase()]) {
    return colorMap[hex.toUpperCase()];
  }

  // Basic hue detection for approximate naming
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if (diff < 30) {
    // Grayscale
    if (max < 85) return 'Dark Gray';
    if (max < 170) return 'Gray';
    return 'Light Gray';
  }

  // Determine dominant hue
  if (r === max && g >= b) return 'Red-Orange';
  if (r === max && b > g) return 'Red-Pink';
  if (g === max && r >= b) return 'Yellow-Green';
  if (g === max && b > r) return 'Green';
  if (b === max && r >= g) return 'Purple';
  if (b === max && g > r) return 'Blue';

  return 'Unknown';
};

// Generate descriptive color names based on lightness and saturation
export const getDescriptiveColorName = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const saturation = max === min ? 0 : lightness > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

  const baseName = getColorName(hex);
  
  let descriptor = '';
  if (lightness < 0.3) descriptor = 'Deep ';
  else if (lightness > 0.8) descriptor = 'Light ';
  else if (lightness > 0.6) descriptor = 'Pale ';
  
  if (saturation < 0.3) descriptor += 'Muted ';
  else if (saturation > 0.8) descriptor += 'Vibrant ';

  return `${descriptor}${baseName}`.trim();
};
