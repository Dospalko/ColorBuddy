import React, { useState } from 'react';
import { Color } from '../../types';

interface ColorCardProps {
  color: Color;
}

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-24 h-24 md:w-28 md:h-28 rounded-md shadow-md mb-2 cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color.hex }}
        title={`Click to copy ${color.hex}`}
        onClick={handleCopy}
      >
        {/* Optional: Display color name if available */}
        {/* color.name && <span className="text-xs p-1 bg-black bg-opacity-50 text-white">{color.name}</span> */}
      </div>
      <button
        onClick={handleCopy}
        className="px-3 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
      >
        {copied ? 'Copied!' : color.hex}
      </button>
    </div>
  );
};

export default ColorCard;