import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocation, useNavigate } from 'react-router-dom';
import DataScopeStatusPage from './DataScopeStatusPage';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('i18next', () => ({
  t: (key: string) => key,
}));

vi.mock('./IngestionPackagesTab', () => ({
  default: () => <div>Ingestion Packages Content</div>,
}));

vi.mock('./CompetitionsTab', () => ({
  default: () => <div>Competitions Dashboard Content</div>,
}));

vi.mock('components', () => ({
  Breadcrumbs: vi.fn(() => <div data-testid="breadcrumbs" />),
  StyledIconButton: vi.fn(() => <div data-testid="styledIconButton" />),
}));

describe('DataScopeStatusPage', () => {
  const mockedUseLocation = vi.mocked(useLocation);
  const mockedUseNavigate = vi.mocked(useNavigate);
  const mockNavigateImplementation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseNavigate.mockReturnValue(mockNavigateImplementation);
  });

  it('should display the Ingestion tab as active when opening the page', () => {
    mockedUseLocation.mockReturnValue({
      pathname: '/reports-manager/gds-dashboards',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    render(<DataScopeStatusPage />);

    expect(screen.getByRole('tab', { name: 'navigation.PackageSummary' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('Ingestion Packages Content')).toBeVisible();
  });

  it('should default to the Ingestion packages tab for an unknown URL path', () => {
    mockedUseLocation.mockReturnValue({
      pathname: '/reports-manager/dashboards/some-other-page',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    render(<DataScopeStatusPage />);

    expect(screen.getByRole('tab', { name: 'navigation.PackageSummary' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('should navigate to the correct URL and change tabs when a new tab is clicked', async () => {
    const user = userEvent.setup();
    mockedUseLocation.mockReturnValue({
      pathname: '/reports-manager/gds-dashboards',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
    render(<DataScopeStatusPage />);
    const ingestionTab = screen.getByRole('tab', { name: 'navigation.PackageSummary' });

    await user.click(ingestionTab);

    expect(ingestionTab).toHaveAttribute('aria-selected', 'true');
  });
});
