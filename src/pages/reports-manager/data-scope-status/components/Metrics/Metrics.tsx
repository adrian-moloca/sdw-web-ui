import { Box } from '@mui/material';
import { t } from 'i18next';
import { MetricCard } from '../MetricCard';
import { colors } from 'themes/colors';
import { IconWrapper } from '../IconWrapper';
import { Check, Close, WarningAmber, ChecklistOutlined } from '@mui/icons-material';
import { JSX, useMemo } from 'react';
import { DeliveryStatus } from 'types/delivery-data-scope';

type Tab = 'ingestion-packages' | 'competitions';
type StatusKey = keyof DeliveryStatus;

type Props = {
  deliveryStatus: DeliveryStatus;
  currentTab: Tab;
  onCardSelect: (statusKey: string) => void;
  selectedCard: string;
};

type Metric = {
  id: string;
  title: string;
  value: number;
  hasProgressBar?: boolean;
  progressValue?: number;
  label?: string;
  icon?: {
    node: JSX.Element;
    color: string;
    backgroundColor: string;
  };
};

const statusConfig: {
  id: StatusKey;
  titleKey: string;
  labelKey?: string;
  icon: JSX.Element;
  color: string;
  backgroundColor: string;
}[] = [
  {
    id: 'fullyReceived',
    titleKey: 'report-manager.fully-received',
    icon: <Check color="inherit" />,
    color: colors.green['600'],
    backgroundColor: colors.green['100'],
  },
  {
    id: 'partiallyReceived',
    titleKey: 'report-manager.partially-received',
    labelKey: 'report-manager.without-errors',
    icon: <ChecklistOutlined color="inherit" />,
    color: colors.neutral.black,
    backgroundColor: colors.yellow['100'],
  },
  {
    id: 'partiallyReceivedWithErrors',
    titleKey: 'report-manager.partially-received',
    labelKey: 'report-manager.with-errors',
    icon: <WarningAmber color="inherit" />,
    color: colors.neutral.black,
    backgroundColor: colors.yellow['400'],
  },
  {
    id: 'notReceived',
    titleKey: 'report-manager.not-received',
    icon: <Close color="inherit" />,
    color: colors.red['600'],
    backgroundColor: colors.red['100'],
  },
];

export const mapDataToMetrics = (deliveryStatus: DeliveryStatus, currentTab: Tab): Metric[] => {
  const total = Object.values(deliveryStatus).reduce((sum, item) => sum + item.count, 0);

  const base: Metric[] = [
    {
      id: 'all',
      title:
        currentTab === 'competitions'
          ? t('report-manager.total-competitions')
          : t('report-manager.total-packages'),
      value: total,
    },
  ];

  const metrics: Metric[] = statusConfig
    .filter((cfg) => deliveryStatus?.[cfg.id]?.count > 0)
    .map((cfg) => ({
      id: cfg.id,
      title: t(cfg.titleKey),
      value: deliveryStatus[cfg.id].count,
      hasProgressBar: true,
      progressValue: deliveryStatus[cfg.id].readinessPercentage,
      label: cfg.labelKey ? t(cfg.labelKey) : undefined,
      icon: {
        node: cfg.icon,
        color: cfg.color,
        backgroundColor: cfg.backgroundColor,
      },
    }));

  return [...base, ...metrics];
};

export const Metrics = ({
  deliveryStatus,
  currentTab,
  onCardSelect,
  selectedCard,
}: Props): JSX.Element => {
  const metrics = useMemo(
    () => mapDataToMetrics(deliveryStatus, currentTab),
    [deliveryStatus, currentTab]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      aria-label="Metrics"
      tabIndex={0}
      role="tree"
    >
      {metrics.map((metric) => {
        const { id, title, value, icon, hasProgressBar, progressValue, label } = metric;
        const isSelected = id === selectedCard;

        return (
          <MetricCard
            key={id}
            title={title}
            value={value}
            isSelected={isSelected}
            hasProgressBar={hasProgressBar}
            progressValue={progressValue}
            label={label}
            {...(icon
              ? {
                  icon: (
                    <IconWrapper
                      icon={icon.node}
                      color={icon.color}
                      backgroundColor={icon.backgroundColor}
                    />
                  ),
                }
              : {})}
            onClick={() => onCardSelect(id)}
          />
        );
      })}
    </Box>
  );
};
