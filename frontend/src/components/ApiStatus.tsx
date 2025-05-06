import React from 'react';

interface ApiStatusProps {
  message: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ message }) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-700 p-3 rounded shadow mt-6">
      <p className="text-xs font-mono text-gray-600 dark:text-gray-400 text-center">
        API Status: <span className="font-semibold">{message}</span>
      </p>
    </div>
  );
};

export default ApiStatus;