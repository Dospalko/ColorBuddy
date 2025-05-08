import React from 'react';
import type { Palette } from '../../types';
import { useClipboard } from '../../hooks/useClipboard';

interface ExportOptionsProps {
  palette: Palette;
}

type ExportFormat = 'tailwind' | 'css';

const ExportOptions: React.FC<ExportOptionsProps> = ({ palette }) => {
  const { copy: copyTailwind, hasCopied: hasCopiedTailwind } = useClipboard();
  const { copy: copyCss, hasCopied: hasCopiedCss } = useClipboard();

  const generateSnippet = (format: ExportFormat): string => {
    if (format === 'tailwind') {
      const colors = palette
        .map((color, index) => `        'brand-${index + 1}': '${color.hex}',${color.name ? ` // ${color.name}` : ''}`)
        .join('\n');
      return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
    },
  },
};`;
    } else { // css
      const variables = palette
        .map((color, index) => `  --brand-color-${index + 1}: ${color.hex};${color.name ? ` /* ${color.name} */` : ''}`)
        .join('\n');
      return `:root {
${variables}
}`;
    }
  };

  const CodeBlock: React.FC<{ format: ExportFormat, onCopy: () => void, hasCopied: boolean, title: string }> = 
    ({ format, onCopy, hasCopied, title }) => (
    <div>
      <button
        onClick={onCopy}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800
                   transition-colors duration-150 mb-2"
        aria-label={`Copy ${title} configuration`}
      >
        {hasCopied ? `Copied ${title}!` : `Copy ${title} Config`}
      </button>
      <pre
        className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto max-h-48 
                   border border-gray-200 dark:border-gray-700 select-all"
        role="textbox"
        aria-readonly="true"
        aria-label={`${title} code snippet`}
      >
        <code>{generateSnippet(format)}</code>
      </pre>
    </div>
  );

  return (
    <div className="mt-8 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Export Palette
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <CodeBlock 
            format="tailwind" 
            onCopy={() => copyTailwind(generateSnippet('tailwind'))} 
            hasCopied={hasCopiedTailwind}
            title="Tailwind CSS"
        />
        <CodeBlock 
            format="css" 
            onCopy={() => copyCss(generateSnippet('css'))} 
            hasCopied={hasCopiedCss}
            title="CSS Variables"
        />
      </div>
    </div>
  );
};

export default React.memo(ExportOptions);