import React from 'react';

interface ApiStatusProps {
  message: string;
}

const ApiStatus: React.FC<ApiStatusProps> = React.memo(({ message }) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-6">
      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 text-center">
        API Status: <span className="font-semibold text-gray-700 dark:text-gray-300">{message}</span>
      </p>
    </div>
  );
});

export default ApiStatus;