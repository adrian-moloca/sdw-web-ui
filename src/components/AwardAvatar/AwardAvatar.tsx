import { Avatar } from '@mui/material';
import { medalColors, medalGradients } from 'models';
import { memo } from 'react';

type MedalAvatarProps = {
  label: string;
  color: string;
  size: number;
};

const MedalAvatar: React.FC<MedalAvatarProps> = memo(({ label, color, size = 21 }) => (
  <Avatar
    sx={{
      width: size,
      height: size,
      color: '#000',
      background: color,
      fontSize: `${(size * 2) / 3}px`,
      fontWeight: 400,
    }}
  >
    {label}
  </Avatar>
));

export const GoldAvatar = memo(() => (
  <MedalAvatar label="G" color={medalColors.golden} size={21} />
));
export const SilverAvatar = memo(() => (
  <MedalAvatar label="S" color={medalColors.silver} size={21} />
));
export const BronzeAvatar = memo(() => (
  <MedalAvatar label="B" color={medalColors.bronze} size={21} />
));
export const TotalAvatar = memo(() => (
  <MedalAvatar label="T" color={medalColors.total} size={21} />
));
export const MedalAvatarMap = {
  golden: (size: number) => <MedalAvatar label="G" color={medalGradients.golden} size={size} />,
  silver: (size: number) => <MedalAvatar label="S" color={medalGradients.silver} size={size} />,
  bronze: (size: number) => <MedalAvatar label="B" color={medalGradients.bronze} size={size} />,
  total: (size: number) => <MedalAvatar label="T" color={medalGradients.total} size={size} />,
};
