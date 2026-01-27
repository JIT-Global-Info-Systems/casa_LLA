import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './button';

const EmptyState = ({ 
  title = 'No data found',
  message = 'There are no items to display.',
  action,
  actionLabel,
  icon: Icon = FileQuestion
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="rounded-full bg-muted p-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {action && actionLabel && (
          <Button onClick={action} variant="outline" size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
