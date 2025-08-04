import { Box, Typography } from '@mui/material';
import { Check, WarningAmber, Close, ChecklistOutlined } from '@mui/icons-material';
import { colors } from 'themes/colors';
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusType } from '../types';

export const StatusCell: React.FC<{ status: StatusType }> = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig: Record<
    StatusType,
    {
      icon: JSX.Element;
      text: string;
      color: string;
      bgColor: string;
    }
  > = {
    fullyReceived: {
      icon: <Check fontSize="small" color="inherit" />,
      text: t('report-manager.fully-received'),
      color: colors.green['600'],
      bgColor: colors.green['100'],
    },
    partiallyReceived: {
      icon: <ChecklistOutlined color="inherit" />,
      text: `${t('report-manager.partially-received')}`,
      color: colors.neutral.black,
      bgColor: colors.yellow['100'],
    },
    partiallyReceivedWithErrors: {
      icon: <WarningAmber fontSize="small" color="inherit" />,
      text: `${t('report-manager.partially-received')}`,
      color: colors.neutral.black,
      bgColor: colors.yellow['400'],
    },
    notReceived: {
      icon: <Close fontSize="small" color="inherit" />,
      text: t('report-manager.not-received'),
      color: colors.red['600'],
      bgColor: colors.red['100'],
    },
    notApplicable: {
      icon: <Close fontSize="small" color="inherit" />,
      text: t('report-manager.not-applicable'),
      color: colors.red['600'],
      bgColor: colors.red['100'],
    },
  };

  const config = statusConfig[status];

  if (!config) return null;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1}
      px={1.5}
      py={0.5}
      height="24px"
      borderRadius={2}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.icon}
      <Typography variant="body2" fontWeight={400}>
        {config.text}
      </Typography>
    </Box>
  );
};
