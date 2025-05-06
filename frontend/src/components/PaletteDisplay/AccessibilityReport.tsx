import React from 'react';
import type { Palette } from '../../types';
interface AccessibilityReportProps {
  palette: Palette;
}

// Basic stub for WCAG contrast calculation.
// In a real app, you'd use a library or a more robust implementation.
// This function is a placeholder.
const calculateContrastRatio = (color1Hex: string, color2Hex: string): number => {
  // This is a DUMMY calculation. Replace with a real one.
  // Example: Convert hex to RGB, then calculate luminance and ratio.
  // For now, returns a random number for demonstration.
  console.warn(`AccessibilityReport: calculateContrastRatio(${color1Hex}, ${color2Hex}) is a DUMMY function.`);
  return Math.random() * 15 + 1; // Random ratio between 1 and 16
};

const getContrastLevel = (ratio: number): string => {
  if (ratio >= 7) return 'AAA'; // For normal text
  if (ratio >= 4.5) return 'AA'; // For normal text
  if (ratio >= 3) return 'AA (Large Text)';
  return 'Fail';
};

const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ palette }) => {
  if (!palette || palette.length < 2) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 my-4">Not enough colors for contrast check.</p>;
  }

  // Example: Check contrast of first color (as background) against others (as text)
  const backgroundColor = palette[0];
  const textColors = palette.slice(1);

  return (
    <div className="my-8 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-3">
        Accessibility Contrast (WCAG 2.1)
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Contrast ratios (e.g., text on background). Higher is better.
        (Using placeholder calculations)
      </p>
      <ul className="space-y-2">
        {textColors.map((textColor, index) => {
          const ratio = calculateContrastRatio(backgroundColor.hex, textColor.hex);
          const level = getContrastLevel(ratio);
          return (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-mono p-1 rounded" style={{ backgroundColor: backgroundColor.hex, color: textColor.hex }}>
                Text ({textColor.hex})
              </span>
              {' on '}
              <span className="font-mono p-1 rounded" style={{ backgroundColor: textColor.hex, color: backgroundColor.hex }}>
                BG ({backgroundColor.hex})
              </span>
              {': '}
              <span className="font-semibold">{ratio.toFixed(2)}</span> -{' '}
              <span className={`font-bold ${level.includes('Fail') ? 'text-red-500' : 'text-green-500'}`}>
                {level}
              </span>
            </li>
          );
        })}
        {palette.length > 2 && ( // Example of another pair if you have more colors
            (() => {
                const colorA = palette[1];
                const colorB = palette[2];
                const ratio = calculateContrastRatio(colorA.hex, colorB.hex);
                const level = getContrastLevel(ratio);
                return (
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-mono p-1 rounded" style={{ backgroundColor: colorA.hex, color: colorB.hex }}>
                        Text ({colorB.hex})
                    </span>
                    {' on '}
                    <span className="font-mono p-1 rounded" style={{ backgroundColor: colorB.hex, color: colorA.hex }}>
                        BG ({colorA.hex})
                    </span>
                    {': '}
                    <span className="font-semibold">{ratio.toFixed(2)}</span> -{' '}
                    <span className={`font-bold ${level.includes('Fail') ? 'text-red-500' : 'text-green-500'}`}>
                        {level}
                    </span>
                    </li>
                );
            })()
        )}
      </ul>
    </div>
  );
};

export default AccessibilityReport;