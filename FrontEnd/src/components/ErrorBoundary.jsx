import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/pages/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                The application encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh page
              </Button>
              <Button onClick={this.handleReset}>
                Go to dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
