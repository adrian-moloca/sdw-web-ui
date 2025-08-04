import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { JSX } from 'react';
import { MetricCard } from './MetricCard';

vi.mock('../BorderedLinearProgress', () => ({
  BorderedLinearProgress: (props: { value: string; labelColor: string }): JSX.Element => (
    <div role="progressbar" data-testid="mock-progress-bar">
      <span data-testid="progress-value">{props.value}</span>
      <span data-testid="progress-label-color">{props.labelColor}</span>
    </div>
  ),
}));

vi.mock('themes/colors', () => ({
  colors: { neutral: { '200': '#EEEEEE' } },
  OlympicColors: { BLUE: 'rgb(0, 129, 200)' },
  olympicsDesignColors: {
    base: {
      neutral: {
        black: '#000',
        white: '#fff',
      },
    },
    dark: {
      general: {
        backgroundLight: '#0d0d10',
      },
    },
  },
}));

vi.mock('themes/layout', () => ({
  layout: { spacing: { '2': '8px', '3': '12px', '4': '16px', '5': '20px' } },
}));

const mockTheme = {
  palette: { background: { paper: '#fff' } },
};
vi.mock('@mui/material/useTheme', () => ({
  default: () => mockTheme,
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Total Views',
    value: 1250,
    onClick: vi.fn(),
  };

  it('should render correctly in its default, non-selected state', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();

    expect(screen.queryByTestId('metric-icon')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('Sub-label')).not.toBeInTheDocument();

    const card = screen.getByTestId('metric-card');
    expect(card).toHaveStyle(`background-color: ${mockTheme.palette.background.paper}`);
    expect(card).toHaveStyle('border-color: #EEEEEE');

    expect(screen.getByText('Total Views')).toHaveStyle('color: rgb(0, 0, 0)');
    expect(screen.getByText('1250')).toHaveStyle('color: rgb(0, 129, 200)');
  });

  it('should apply selected styles when isSelected is true', () => {
    render(<MetricCard {...defaultProps} isSelected />);

    const card = screen.getByTestId('metric-card');
    expect(card).toHaveStyle('background-color: rgb(0, 129, 200)');
    expect(card).toHaveStyle('border-color: rgb(0, 129, 200)');

    expect(screen.getByText('Total Views')).toHaveStyle('color: rgb(255, 255, 255)');
    expect(screen.getByText('1250')).toHaveStyle(`color: ${mockTheme.palette.background.paper}`);
  });

  it('should render the icon and label when provided', () => {
    const icon = <div data-testid="metric-icon">Icon</div>;
    render(<MetricCard {...defaultProps} icon={icon} label="This is a label" />);

    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
    expect(screen.getByText('This is a label')).toBeInTheDocument();
  });

  it('should render the progress bar when hasProgressBar and progressValue are provided', () => {
    render(<MetricCard {...defaultProps} hasProgressBar progressValue={75} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    expect(screen.getByTestId('progress-value')).toHaveTextContent('75');
  });

  it('should pass the correct labelColor to the progress bar based on selection state', () => {
    const { rerender } = render(<MetricCard {...defaultProps} hasProgressBar progressValue={75} />);
    expect(screen.getByTestId('progress-label-color')).toHaveTextContent('rgb(0, 129, 200)');

    rerender(<MetricCard {...defaultProps} hasProgressBar progressValue={75} isSelected />);
    expect(screen.getByTestId('progress-label-color')).toHaveTextContent(
      mockTheme.palette.background.paper
    );
  });

  it('should NOT render the progress bar if progressValue is missing', () => {
    render(<MetricCard {...defaultProps} hasProgressBar />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should call the onClick handler when the card is clicked', () => {
    const handleClick = vi.fn();
    render(<MetricCard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByTestId('metric-card');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
