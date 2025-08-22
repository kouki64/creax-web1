interface AlertProps {
    type: 'error' | 'success' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
  }
  
  export default function Alert({ type, message, onClose }: AlertProps) {
    const styles = {
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
  
    const icons = {
      error: '❌',
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
    };
  
    return (
      <div className={`border rounded-md p-4 flex items-start ${styles[type]}`}>
        <span className="mr-2">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    );
  }