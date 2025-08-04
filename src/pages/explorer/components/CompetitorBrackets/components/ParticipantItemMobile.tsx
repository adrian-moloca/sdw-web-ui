import React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import get from 'lodash/get';
import { formatAthleteName, formatMasterCode } from '_helpers';
import { useResults } from 'hooks';
import { ParticipantBracketChip } from './ParticipantBracketChip';
import { ParticipantIdentity } from './ParticipantIdentity';
import { ExtendedMetricsList } from './ExtendedMetricsList';
import { ParticipantTeamMembers } from './ParticipantTeamMembers';

type ParticipantProps = {
  data: any;
  textAlign: 'left' | 'right';
  open: boolean;
};

export const ParticipantItemMobile: React.FC<ParticipantProps> = ({ data, textAlign, open }) => {
  const displayName = formatAthleteName(data);
  const theme = useTheme();
  const { extendedResultMetrics } = useResults();
  const extendedMetrics = get(data, 'result.extensions.extendedResult');
  const detailScore = get(data, 'result.extensions.extendedResult.detailScore');
  const filterData = data?.participants;
  const hasFilterData = filterData && filterData.length > 0;
  if (!data) return null;
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <ParticipantBracketChip data={data} textAlign={textAlign} />
        <Typography
          variant={'h4'}
          lineHeight={1.1}
          fontFamily={theme.typography.body1.fontFamily}
          color={theme.palette.text.primary}
        >
          {formatMasterCode(data?.frameBracket.result)}
        </Typography>
      </Stack>
      <ParticipantIdentity data={data} textAlign={textAlign} displayName={displayName} />

      {(extendedMetrics || detailScore) && (
        <ExtendedMetricsList
          metrics={extendedMetrics}
          resultDefinitions={extendedResultMetrics}
          textAlign={textAlign}
          detailScore={detailScore}
        />
      )}

      {hasFilterData && (
        <ParticipantTeamMembers data={filterData} textAlign={textAlign} open={open} />
      )}
    </Stack>
  );
};
