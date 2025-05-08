import React from "react";
import type { Palette } from "../../types";
import { useClipboard } from "../../hooks/useClipboard";

interface ExportOptionsProps {
  palette: Palette;
}

type ExportFormat = "tailwind" | "css";

const ExportOptions: React.FC<ExportOptionsProps> = ({ palette }) => {
  const { copy: copyTailwind, hasCopied: hasCopiedTailwind } = useClipboard();
  const { copy: copyCss, hasCopied: hasCopiedCss } = useClipboard();

  const generateSnippet = (format: ExportFormat): string => {
    if (format === "tailwind") {
      const colors = palette
        .map(
          (color, index) =>
            `        'brand-${index + 1}': '${color.hex}',${
              color.name ? ` // ${color.name}` : ""
            }`
        )
        .join("\n");
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
    } else {
      // css
      const variables = palette
        .map(
          (color, index) =>
            `  --brand-color-${index + 1}: ${color.hex};${
              color.name ? ` /* ${color.name} */` : ""
            }`
        )
        .join("\n");
      return `:root {
${variables}
}`;
    }
  };

  const CodeBlock: React.FC<{
    format: ExportFormat;
    onCopy: () => void;
    hasCopied: boolean;
    title: string;
  }> = ({ format, onCopy, hasCopied, title }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-5">
      <h4 className="text-lg font-semibold text-slate-200 mb-3">{title}</h4>
      <button
        onClick={onCopy}
        className="w-full bg-sky-600/80 hover:bg-sky-700/80 text-white font-semibold py-2.5 px-4 rounded-lg
                   focus-ring transition-colors duration-150 mb-3 text-sm"
        aria-label={`Copy ${title} configuration`}
      >
        {hasCopied ? `Copied!` : `Copy Config`}
      </button>
      <pre
        className="text-xs bg-slate-900/70 p-3.5 rounded-md overflow-x-auto max-h-48 
                   border border-slate-700 select-all text-sky-300" // Different text color for code
        role="textbox"
        aria-readonly="true"
        aria-label={`${title} code snippet`}
      >
        <code className="whitespace-pre-wrap break-all">
          {generateSnippet(format)}
        </code>
      </pre>
    </div>
  );

  return (
    <div className="p-0 md:p-0">
      {" "}
      {/* Parent PaletteView now handles main padding for this section */}
      <h3 className="text-2xl font-semibold text-slate-100 mb-5 text-center md:text-left">
        Export Your Palette
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <CodeBlock
          format="tailwind"
          onCopy={() => copyTailwind(generateSnippet("tailwind"))}
          hasCopied={hasCopiedTailwind}
          title="Tailwind CSS"
        />
        <CodeBlock
          format="css"
          onCopy={() => copyCss(generateSnippet("css"))}
          hasCopied={hasCopiedCss}
          title="CSS Variables"
        />
      </div>
    </div>
  );
};

export default React.memo(ExportOptions);
