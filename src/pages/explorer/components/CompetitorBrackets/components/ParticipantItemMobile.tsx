import React from 'react';
import { Stack, useTheme } from '@mui/material';
import { formatAthleteName } from '_helpers';
import { ParticipantBracketChip } from './ParticipantBracketChip';
import { ParticipantIdentity } from './ParticipantIdentity';
import { ParticipantTeamMembers } from './ParticipantTeamMembers';

type ParticipantProps = {
  data: any;
  textAlign: 'left' | 'right';
  open: boolean;
};

export const ParticipantItemMobile: React.FC<ParticipantProps> = ({ data, textAlign, open }) => {
  const displayName = formatAthleteName(data);
  const theme = useTheme();
  const filterData = data?.participants;
  const hasFilterData = filterData && filterData.length > 0;
  if (!data) return null;
  return (
    <Stack spacing={1} sx={{ width: '100%', pb: theme.spacing(4) }}>
      <ParticipantBracketChip data={data} textAlign={'center'} />
      <ParticipantIdentity data={data} textAlign={'center'} displayName={displayName} />
      {hasFilterData && (
        <ParticipantTeamMembers data={filterData} textAlign={textAlign} open={open} />
      )}
    </Stack>
  );
};
