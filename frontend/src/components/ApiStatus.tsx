interface ApiStatusProps {
  message: string;
}

const ApiStatus = ({ message }: ApiStatusProps) => {
  const isOnline = !message.toLowerCase().includes('failed') && !message.toLowerCase().includes('error');
  
  return (
    <div className="inline-flex items-center px-4 py-2 glassmorphic border-slate-600/30">
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className="text-xs font-medium text-slate-300">API Status</span>
        </div>
        <div className="h-4 w-px bg-slate-600/50"></div>
        <span className={`text-xs font-mono ${
          isOnline ? 'text-green-300' : 'text-red-300'
        }`}>
          {isOnline ? '✓ Connected' : '✗ Disconnected'}
        </span>
      </div>
    </div>
  );
};

export default ApiStatus;