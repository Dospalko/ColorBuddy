import React, { useState } from 'react';
import { Palette } from '../../types';

interface ExportOptionsProps {
  palette: Palette;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ palette }) => {
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const generateTailwindConfig = (): string => {
    const colors = palette
      .map((color, index) => `        'brand-${index + 1}': '${color.hex}', // ${color.name || `Color ${index+1}`}`)
      .join('\n');

    return `// Add to your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
    },
  },
  plugins: [],
};`;
  };

  const generateCssVariables = (): string => {
    const variables = palette
      .map((color, index) => `  --brand-color-${index + 1}: ${color.hex}; /* ${color.name || `Color ${index+1}`} */`)
      .join('\n');

    return `:root {
${variables}
}`;
  };

  const handleCopy = (textGenerator: () => string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    const textToCopy = textGenerator();
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="mt-8 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Export Palette
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <button
            onClick={() => handleCopy(generateTailwindConfig, setCopiedTailwind)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
          >
            {copiedTailwind ? 'Copied Tailwind!' : 'Copy Tailwind Config'}
          </button>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
            <code>{generateTailwindConfig()}</code>
          </pre>
        </div>
        <div>
          <button
            onClick={() => handleCopy(generateCssVariables, setCopiedCss)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
          >
            {copiedCss ? 'Copied CSS!' : 'Copy CSS Variables'}
          </button>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
            <code>{generateCssVariables()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;