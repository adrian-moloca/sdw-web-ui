import logo from 'assets/images/medal_blank.png';
import { MedalAvatarMap } from 'components';
import { MedalType } from 'types/explorer';

interface Props {
  size?: number;
  field?: MedalType;
}
export const MedalIcon = ({ size = 24, field }: Props) => {
  if (!field)
    return (
      <img
        src={logo}
        alt="Medal Icon"
        height={size}
        width={size}
        style={{ objectFit: 'contain' }}
      />
    );

  return MedalAvatarMap[field](size);
};
