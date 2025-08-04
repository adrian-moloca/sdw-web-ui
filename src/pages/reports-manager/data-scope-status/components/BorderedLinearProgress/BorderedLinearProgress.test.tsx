import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BorderedLinearProgress } from './BorderedLinearProgress';

vi.mock('themes/colors', () => ({
  colors: {
    neutral: {
      '100': '#F0F0F0',
    },
    blue: {
      '300': '#64B5F6',
    },
  },
}));

describe('BorderedLinearProgress', () => {
  it('should render the linear progress bar with the correct value', () => {
    render(<BorderedLinearProgress variant="determinate" value={50} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('should not display the percentage label by default', () => {
    render(<BorderedLinearProgress value={30} />);

    const label = screen.queryByText('30%');
    expect(label).not.toBeInTheDocument();
  });

  it('should display the percentage label when displayLabel is true', () => {
    render(<BorderedLinearProgress value={75} displayLabel />);

    const label = screen.getByText('75%');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle('font-weight: 700');
  });

  it('should apply a custom color to the percentage label', () => {
    const customColor = 'rgb(255, 0, 0)';
    render(<BorderedLinearProgress value={90} displayLabel labelColor={customColor} />);

    const label = screen.getByText('90%');
    expect(label).toHaveStyle(`color: ${customColor}`);
  });

  it('should apply a custom width to the progress bar container', () => {
    const customWidth = 200;
    render(<BorderedLinearProgress value={25} width={customWidth} />);

    const progressBar = screen.getByRole('progressbar');
    const container = progressBar.parentElement;

    expect(container).toHaveStyle(`width: ${customWidth}px`);
  });

  it('should pass other LinearProgressProps to the styled component', () => {
    render(<BorderedLinearProgress value={10} variant="determinate" />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
});
