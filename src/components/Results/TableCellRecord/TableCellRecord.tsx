import { Avatar, Stack } from '@mui/material';
import { amber, blue, brown, indigo, lime, pink } from '@mui/material/colors';
import { formatMasterCode } from '_helpers';
import uniqBy from 'lodash/uniqBy';
import { memo } from 'react';
import sortBy from 'lodash/sortBy';
type MedalAvatarProps = {
  label: string;
  color: string;
  size: number;
};
const RecordAvatar: React.FC<MedalAvatarProps> = memo(({ label, color, size = 21 }) => (
  <Avatar
    variant="rounded"
    sx={{
      width: size + 10,
      height: size,
      color: '#000',
      backgroundColor: color,
      fontSize: '12px',
      fontWeight: 500,
    }}
  >
    {label}
  </Avatar>
));
type Props = {
  value?: any[];
};
export const RecordChip = ({ value }: Props) => {
  const levelColor = (level: string) => {
    switch (level) {
      case 'RCLV$OR':
        return blue[300];
      case 'RCLV$WR':
      case 'RCLV$JWR':
      case 'RCLV$WJ':
      case 'RCLV$WU20R':
        return pink.A100;
      case 'RCLV$NR':
        return amber.A100;
      case 'RCLV$SB':
        return indigo[100];
      case 'RCLV$PB':
        return brown.A100;
      case 'RCLV$AF':
      case 'RCLV$AM':
      case 'RCLV$AS':
      case 'RCLV$CR':
      case 'RCLV$ER':
      case 'RCLV$SA':
        return lime[200];
      default:
        return lime[200];
    }
  };
  const recordOrder: Record<string, number> = { RCLV$WR: 1, RCLV$OR: 2, RCLV$NR: 3, RCLV$SB: 98 };
  const sortedRecords = sortBy(value, (p: any) => recordOrder[p.level ?? ''] ?? 99);
  return (
    <Stack direction={'row'} spacing={0.2}>
      {uniqBy(sortedRecords, 'level')?.map((e: any) => (
        <RecordAvatar
          key={e.level}
          label={formatMasterCode(e.level)}
          color={levelColor(e.level)}
          size={20}
        />
      ))}
    </Stack>
  );
};
