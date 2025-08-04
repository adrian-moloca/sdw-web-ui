import React from 'react';
import { Stack } from '@mui/material';
import get from 'lodash/get';
import { formatAthleteName } from '_helpers';
import { useResults } from 'hooks';
import { ExtendedMetricsList } from './ExtendedMetricsList';
import { ParticipantBracketChip } from './ParticipantBracketChip';
import { ParticipantIdentity } from './ParticipantIdentity';
import { ParticipantTeamMembers } from './ParticipantTeamMembers';
type ParticipantProps = {
  data: any;
  textAlign: 'left' | 'right';
  open: boolean;
};

export const ParticipantItem: React.FC<ParticipantProps> = ({ data, textAlign, open }) => {
  const displayName = formatAthleteName(data);
  const { extendedResultMetrics } = useResults();
  const extendedMetrics = get(data, 'result.extensions.extendedResult');
  const detailScore = get(data, 'result.extensions.extendedResult.detailScore');
  const filterData = data?.participants;
  const hasFilterData = filterData && filterData.length > 0;
  if (!data) return null;
  return (
    <Stack
      alignItems={textAlign == 'left' ? 'flex-end' : 'flex-start'}
      spacing={1}
      sx={{ minWidth: 160, width: '35%' }}
    >
      <ParticipantBracketChip data={data} textAlign={textAlign} />
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
