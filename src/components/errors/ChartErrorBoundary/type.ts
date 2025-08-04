import { ReactNode } from 'react';

export interface ChartErrorBoundaryProps {
  name: string;
  children: ReactNode;
}

export interface ChartErrorBoundaryState {
  hasError: boolean;
}
