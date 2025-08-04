import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SvgIcon } from '@mui/material';
import { describe, it, expect } from 'vitest';
import React, { JSX } from 'react';
import { IconWrapper } from './IconWrapper';

const TestIcon: React.FC = (): JSX.Element => (
  <SvgIcon data-testid="test-icon">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

describe('IconWrapper', () => {
  it('should render the icon with the correct styles', () => {
    const testColor = 'rgb(255, 0, 0)';
    const testBackgroundColor = 'rgb(0, 0, 255)';

    render(
      <IconWrapper icon={<TestIcon />} color={testColor} backgroundColor={testBackgroundColor} />
    );

    const iconElement = screen.getByTestId('test-icon');
    expect(iconElement).toBeInTheDocument();

    const wrapperElement = iconElement.parentElement;
    expect(wrapperElement).toHaveStyle(`color: ${testColor}`);
    expect(wrapperElement).toHaveStyle(`background-color: ${testBackgroundColor}`);
    expect(wrapperElement).toHaveStyle('border-radius: 4px');
    expect(wrapperElement).toHaveStyle('position: absolute');
    expect(wrapperElement).toHaveStyle('width: 32px');
    expect(wrapperElement).toHaveStyle('height: 32px');
    expect(wrapperElement).toHaveStyle('top: 10px');
    expect(wrapperElement).toHaveStyle('right: 10px');
    expect(wrapperElement).toHaveStyle('display: flex');
    expect(wrapperElement).toHaveStyle('justify-content: center');
    expect(wrapperElement).toHaveStyle('align-items: center');
  });

  it('should render with different color and background color props', () => {
    const testColor = 'rgb(0, 128, 0)';
    const testBackgroundColor = 'rgb(255, 255, 0)';

    render(
      <IconWrapper icon={<TestIcon />} color={testColor} backgroundColor={testBackgroundColor} />
    );

    const wrapperElement = screen.getByTestId('test-icon').parentElement;
    expect(wrapperElement).toHaveStyle(`color: ${testColor}`);
    expect(wrapperElement).toHaveStyle(`background-color: ${testBackgroundColor}`);
  });
});
