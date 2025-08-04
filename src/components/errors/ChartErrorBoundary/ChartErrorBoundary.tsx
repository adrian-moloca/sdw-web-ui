import React from 'react';
import { ChartErrorBoundaryProps, ChartErrorBoundaryState } from './type';

export class ChartErrorBoundary extends React.Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): ChartErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`⚠️ Chart "${this.props.name}" crashed:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '1rem', border: '1px dashed red' }}>
          🚨 Chart <strong>{this.props.name}</strong> failed to render.
        </div>
      );
    }

    return this.props.children;
  }
}
