import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

const ErrorState = ({ 
  message = 'Something went wrong. Please try again.', 
  onRetry,
  fullScreen = false 
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background p-4'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Unable to load</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
