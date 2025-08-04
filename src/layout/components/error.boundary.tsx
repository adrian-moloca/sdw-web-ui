import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught in Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or null
      return null; // Prevents any overlay/message from being shown
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
