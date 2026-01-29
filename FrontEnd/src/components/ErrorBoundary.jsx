import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log error to monitoring service (if available)
    if (typeof window !== 'undefined' && window.logError) {
      window.logError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, retryCount } = this.state;
      const { fallback: CustomFallback, showDetails = false } = this.props;

      // If custom fallback provided, use it
      if (CustomFallback) {
        return (
          <CustomFallback 
            error={error} 
            retry={this.handleRetry}
            retryCount={retryCount}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              {error?.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {showDetails && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4" />
                {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Retry attempts: {retryCount}/3
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for async error boundaries
export const withAsyncErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasAsyncError: false, asyncError: null };
    }

    componentDidMount() {
      // Listen for unhandled promise rejections
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    componentWillUnmount() {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.setState({
        hasAsyncError: true,
        asyncError: event.reason
      });
      // Prevent the default browser behavior
      event.preventDefault();
    };

    render() {
      if (this.state.hasAsyncError) {
        return (
          <ErrorBoundary>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium">Async Error Occurred</h3>
              <p className="text-red-600 text-sm mt-1">
                {this.state.asyncError?.message || 'An async operation failed'}
              </p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => this.setState({ hasAsyncError: false, asyncError: null })}
              >
                Dismiss
              </Button>
            </div>
          </ErrorBoundary>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default ErrorBoundary;