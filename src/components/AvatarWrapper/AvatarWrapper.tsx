import { alpha, styled } from '@mui/material/styles';
import { Avatar, Theme } from '@mui/material';
import { CardType } from 'types/cards';
import { getColorByMode } from 'utils/card-wrapper';

const avatarCommonStyles = (theme: Theme, mode: CardType) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.largeAvatar,
  backgroundColor:
    mode === 'tertiary' || mode === 'quaternary'
      ? alpha(getColorByMode(theme, mode, 'light'), 0.25)
      : getColorByMode(theme, mode, 'light'),
  color: getColorByMode(theme, mode, 'dark'),
});

export const AvatarWrapper = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: CardType }>(({ theme, mode }) => avatarCommonStyles(theme, mode));

export const AvatarBackgroundWrapper = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: CardType }>(({ theme, mode }) => ({
  ...avatarCommonStyles(theme, mode),
  backgroundColor: getColorByMode(theme, mode, 'main'),
  color: '#fff',
}));
