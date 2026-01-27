import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

const PermissionDenied = ({ 
  message = 'You do not have permission to access this page.',
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Access Denied</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {showBackButton && (
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            Go back
          </Button>
        )}
      </div>
    </div>
  );
};

export default PermissionDenied;
