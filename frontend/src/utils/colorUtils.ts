import getContrast from 'get-contrast'; // Assuming you've run: npm install get-contrast

export interface ContrastInfo {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA (Large Text)' | 'Fail';
  isAccessibleSmall: boolean; // AA for small text
  isAccessibleLarge: boolean; // AA for large text
}

export const calculateContrast = (color1Hex: string, color2Hex: string): ContrastInfo => {
  const ratio = getContrast.ratio(color1Hex, color2Hex);
  let level: ContrastInfo['level'] = 'Fail';

  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'AA (Large Text)';

  return {
    ratio,
    level,
    isAccessibleSmall: getContrast.isAccessible(color1Hex, color2Hex, { level: 'AA', size: 'small' }),
    isAccessibleLarge: getContrast.isAccessible(color1Hex, color2Hex, { level: 'AA', size: 'large' }),
  };
};

// Function to determine a readable text color (black or white) for a given background
export const getReadableTextColor = (backgroundHex: string): '#000000' | '#FFFFFF' => {
    // Simple heuristic: if contrast with white is good, use white, else use black.
    // A more sophisticated approach might involve calculating luminance.
    const contrastWithWhite = getContrast.ratio(backgroundHex, '#FFFFFF');
    return contrastWithWhite >= 3 ? '#FFFFFF' : '#000000'; // Aim for at least AA for large text
};

// You might add more color utility functions here later (e.g., hexToRgb, rgbToHsl)