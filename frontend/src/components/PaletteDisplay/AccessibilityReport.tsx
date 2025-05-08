import React from 'react';
import type { Palette, Color } from '../../types';
import { calculateContrast, type ContrastInfo } from '../../utils/colorUtils';

interface AccessibilityReportProps {
  palette: Palette;
}

interface ContrastPair {
  bg: Color;
  fg: Color;
  contrast: ContrastInfo;
}

const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ palette }) => {
  if (!palette || palette.length < 2) {
    return (
      <div className="my-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Palette too small for contrast checks. Needs at least 2 colors.
        </p>
      </div>
    );
  }

  const contrastPairs: ContrastPair[] = [];
  // Example: Check first color as background against all others as foreground
  const primaryBg = palette[0];
  for (let i = 1; i < palette.length; i++) {
    contrastPairs.push({
      bg: primaryBg,
      fg: palette[i],
      contrast: calculateContrast(primaryBg.hex, palette[i].hex),
    });
  }
  // Example: Check second color as background against all others (except itself)
  if (palette.length > 1) {
    const secondaryBg = palette[1];
    for (let i = 0; i < palette.length; i++) {
      if (i === 1) continue; // Skip self-contrast
       contrastPairs.push({
        bg: secondaryBg,
        fg: palette[i],
        contrast: calculateContrast(secondaryBg.hex, palette[i].hex),
      });
    }
  }
  // Add more sophisticated pairing logic if needed

  return (
    <div className="my-8 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
        Accessibility Check (WCAG 2.1)
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Contrast ratios for selected pairs. Higher is better. AA/AAA pass for normal text.
      </p>
      {contrastPairs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No contrast pairs to display.</p>
      ) : (
        <ul className="space-y-2.5">
          {contrastPairs.map((pair, index) => (
            <li
              key={`${pair.bg.hex}-${pair.fg.hex}-${index}`}
              className="text-sm text-gray-700 dark:text-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="mb-1 sm:mb-0">
                <span
                  className="font-mono px-1.5 py-0.5 rounded mr-1 shadow-sm text-xs"
                  style={{
                    backgroundColor: pair.bg.hex,
                    color: pair.fg.hex,
                    border: `1px solid ${pair.contrast.isAccessibleSmall ? 'transparent' : pair.fg.hex }`, // Visual cue for failure
                  }}
                >
                  Text ({pair.fg.hex})
                </span>
                <span className="text-gray-600 dark:text-gray-400">on</span>
                <span
                  className="font-mono px-1.5 py-0.5 rounded ml-1 shadow-sm text-xs"
                  style={{ backgroundColor: pair.bg.hex }}
                  title={pair.bg.hex}
                >
                  BG ({pair.bg.hex})
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-3 tabular-nums">{pair.contrast.ratio.toFixed(2)}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-xs leading-tight
                    ${
                      pair.contrast.level === 'AAA' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                      pair.contrast.level === 'AA' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100' :
                      pair.contrast.level === 'AA (Large Text)' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100' :
                      'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                    }`}
                >
                  {pair.contrast.level}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Note: These are example pairings. Always test your specific design's text/background combinations.
      </p>
    </div>
  );
};

export default React.memo(AccessibilityReport);