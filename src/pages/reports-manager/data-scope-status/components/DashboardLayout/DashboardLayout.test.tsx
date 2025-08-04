import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import DashboardLayout from './DashboardLayout';

import { useSelector } from 'react-redux';
import { useModelConfig } from 'hooks';

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-redux')>();
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock('hooks', () => ({
  useModelConfig: vi.fn(),
}));

vi.mock('models', () => ({
  EntityType: {
    GdsDashboard: 'GdsDashboard',
  },
}));

const mockedUseSelector = useSelector as unknown as Mock;
const mockedUseModelConfig = useModelConfig as Mock;

const mockConfig = { type: '57' };
const leftContentText = 'Left Panel Content';
const rightContentText = 'Right Panel Content';
describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseModelConfig.mockReturnValue({
      getConfig: vi.fn().mockReturnValue(mockConfig),
    });
  });

  it('renders left and right content correctly', () => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        drawer: { profile: { [mockConfig.type]: { open: true } } },
      })
    );

    render(
      <DashboardLayout
        leftContent={<div>{leftContentText}</div>}
        rightContent={<div>{rightContentText}</div>}
      />
    );

    expect(screen.getByText(leftContentText)).toBeInTheDocument();
    expect(screen.getByText(rightContentText)).toBeInTheDocument();
  });

  it('should render only right content when displayMetrics is false', () => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        drawer: { profile: { [mockConfig.type]: { open: false } } },
      })
    );

    render(
      <DashboardLayout
        leftContent={<div>{leftContentText}</div>}
        rightContent={<div>{rightContentText}</div>}
      />
    );

    expect(screen.queryByText(leftContentText)).not.toBeInTheDocument();
    expect(screen.getByText(rightContentText)).toBeInTheDocument();
  });

  it('should render only right content if displayMetrics is undefined', () => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        drawer: { profile: {} },
      })
    );

    render(
      <DashboardLayout
        leftContent={<div>{leftContentText}</div>}
        rightContent={<div>{rightContentText}</div>}
      />
    );

    expect(screen.queryByText(leftContentText)).not.toBeInTheDocument();
    expect(screen.getByText(rightContentText)).toBeInTheDocument();
  });

  it('applies default left width and full height', () => {
    const { container } = render(
      <DashboardLayout leftContent={<div>Left</div>} rightContent={<div>Right</div>} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle('height: calc(100vh - 100px)');
  });

  it('applies custom leftWidth, gap, and disables fullHeight', () => {
    const { container } = render(
      <DashboardLayout
        leftContent={<div>Custom Left</div>}
        rightContent={<div>Custom Right</div>}
        gap={3}
        fullHeight={false}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle('gap: 24px');
    expect(wrapper).toHaveStyle('height: auto');
  });
});
