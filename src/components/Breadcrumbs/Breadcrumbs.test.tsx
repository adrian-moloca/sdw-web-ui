import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

vi.mock('themes/colors', () => ({
  colors: {
    neutral: {
      black: 'rgb(0, 0, 0)',
      '600': 'rgb(100, 100, 100)',
    },
  },
  olympicsDesignColors: {
    base: {
      neutral: {
        black: '#000',
        white: '#fff',
      },
    },
  },
}));

const mockBreadcrumbs = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/products' },
  { title: 'Laptop' },
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    breadcrumbs: mockBreadcrumbs,
  };
  return render(
    <MemoryRouter>
      <Breadcrumbs {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('Breadcrumbs', () => {
  it('should render all breadcrumb titles', () => {
    renderComponent();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('should render items with a path as links', () => {
    renderComponent();
    const linkElement = screen.getByRole('link', { name: 'Products' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/products');
  });

  it('should not render an item as a link if no path is provided', () => {
    renderComponent();
    const nonLinkElement = screen.getByText('Laptop');
    expect(nonLinkElement.closest('a')).toBeNull();
  });

  it('should apply active styles to the last item', () => {
    renderComponent();
    const lastItem = screen.getByText('Laptop');
    expect(lastItem).toHaveStyle('font-weight: 700');
    expect(lastItem).toHaveStyle('color: rgb(0, 0, 0)');
  });

  it('should apply inactive styles to non-last items', () => {
    renderComponent();
    const firstItem = screen.getByText('Home');
    expect(firstItem).toHaveStyle('font-weight: 400');
    expect(firstItem).toHaveStyle('color: rgb(100, 100, 100)');
  });

  it('should use the custom separator when provided', () => {
    renderComponent({ separator: '>' });
    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(2);
  });

  it('should render correctly with only one breadcrumb', () => {
    renderComponent({ breadcrumbs: [{ title: 'Single Item' }] });
    const singleItem = screen.getByText('Single Item');
    expect(singleItem).toBeInTheDocument();
    expect(singleItem).toHaveStyle('font-weight: 700');
    expect(singleItem.closest('a')).toBeNull();
  });

  it('should render nothing inside when the breadcrumbs array is empty', () => {
    const { container } = renderComponent({ breadcrumbs: [] });
    const list = container.querySelector('ol');
    expect(list?.children.length).toBe(0);
  });
});
