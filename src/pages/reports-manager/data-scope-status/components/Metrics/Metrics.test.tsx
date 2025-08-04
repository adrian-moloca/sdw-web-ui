/* eslint-disable no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Metrics } from './Metrics';
import { MetricCard } from '../MetricCard';
import { DeliveryStatus } from 'types/delivery-data-scope';

vi.mock('i18next', () => ({
  t: (key: string) => key,
}));

let idCounter = 0;
vi.mock('nanoid', () => ({
  nanoid: () => `mock-id-${idCounter++}`,
}));

vi.mock('../MetricCard', () => ({
  MetricCard: vi.fn(({ title, value, isSelected, onClick }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div data-testid={`metric-card-${title}`} onClick={onClick} data-selected={isSelected}>
      <p>{title}</p>
      <p>{value}</p>
    </div>
  )),
}));

vi.mock('../IconWrapper', () => ({
  IconWrapper: vi.fn(() => <div data-testid="icon-wrapper" />),
}));

const mockDeliveryStatus: DeliveryStatus = {
  fullyReceived: { count: 50, readinessPercentage: 100 },
  partiallyReceived: { count: 20, readinessPercentage: 50 },
  partiallyReceivedWithErrors: { count: 10, readinessPercentage: 25 },
  notReceived: { count: 5, readinessPercentage: 0 },
};

describe('Metrics Component', () => {
  beforeEach(() => {
    idCounter = 0;
    vi.clearAllMocks();
  });

  it('should render all metric cards correctly', () => {
    render(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={() => {}}
        selectedCard="all"
      />
    );

    expect(screen.getByText('report-manager.total-packages')).toBeInTheDocument();
    expect(screen.getByText('report-manager.fully-received')).toBeInTheDocument();
    expect(screen.getAllByText('report-manager.partially-received').length).toBe(2);
    expect(screen.getByText('report-manager.not-received')).toBeInTheDocument();
  });

  it('should calculate and display the total number of packages', () => {
    render(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={() => {}}
        selectedCard="all"
      />
    );

    const totalPackagesCard = screen.getByTestId('metric-card-report-manager.total-packages');
    expect(totalPackagesCard).toHaveTextContent('85');
  });

  it('should have the first card selected by default', () => {
    render(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={() => {}}
        selectedCard="all"
      />
    );

    const firstCard = screen.getByTestId('metric-card-report-manager.total-packages');
    expect(firstCard).toHaveAttribute('data-selected', 'true');

    const secondCard = screen.getByTestId('metric-card-report-manager.fully-received');
    expect(secondCard).toHaveAttribute('data-selected', 'false');
  });

  it('should change the selected card on click', () => {
    let selected = 'all';
    const handleSelect = (id: string) => {
      selected = id;
    };

    const { rerender } = render(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={handleSelect}
        selectedCard={selected}
      />
    );

    const firstCard = screen.getByTestId('metric-card-report-manager.total-packages');
    const secondCard = screen.getByTestId('metric-card-report-manager.fully-received');

    expect(firstCard).toHaveAttribute('data-selected', 'true');
    expect(secondCard).toHaveAttribute('data-selected', 'false');

    fireEvent.click(secondCard);

    rerender(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={handleSelect}
        selectedCard="fullyReceived"
      />
    );

    expect(firstCard).toHaveAttribute('data-selected', 'false');
    expect(secondCard).toHaveAttribute('data-selected', 'true');
  });

  it('should pass the correct props to MetricCard', () => {
    render(
      <Metrics
        deliveryStatus={mockDeliveryStatus}
        currentTab="ingestion-packages"
        onCardSelect={() => {}}
        selectedCard="all"
      />
    );

    const allMetricCardCalls = (MetricCard as ReturnType<typeof vi.fn>).mock.calls;

    const totalPackagesCall = allMetricCardCalls.find(
      (call) => call[0].title === 'report-manager.total-packages'
    );

    const fullyReceivedCall = allMetricCardCalls.find(
      (call) => call[0].title === 'report-manager.fully-received'
    );

    expect(totalPackagesCall?.[0]).not.toHaveProperty('icon');
    expect(totalPackagesCall?.[0].value).toBe(85);
    expect(totalPackagesCall?.[0].hasProgressBar).toBeUndefined();

    expect(fullyReceivedCall?.[0]).toHaveProperty('icon');
    expect(fullyReceivedCall?.[0].value).toBe(50);
    expect(fullyReceivedCall?.[0].hasProgressBar).toBe(true);
    expect(fullyReceivedCall?.[0].progressValue).toBe(100);
  });
});
