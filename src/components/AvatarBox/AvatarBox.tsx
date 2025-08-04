import { Avatar, useMediaQuery, useTheme } from '@mui/material';
import { apiConfig } from 'config/app.config';
import { formatMasterCode, stringAvatar, stringImageAvatar, stringLargeAvatar } from '_helpers';
import React, { ElementType } from 'react';

type AvatarSize = 'xlarge' | 'large' | 'medium' | 'tiny' | 'small' | null;

type AvatarBoxProps = {
  text: string | number;
  image?: string;
  isoCode?: string;
  icon?: ElementType;
  variant?: 'circular' | 'rounded' | 'square';
  size?: AvatarSize;
};

const AvatarBoxTemplate = (props: AvatarBoxProps) => {
  const { text, image, variant, size } = props;
  const theme = useTheme();
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

  if (props.isoCode) {
    let countryCode = formatMasterCode(props.isoCode);
    if (['REF', 'IOP', 'AIN', 'XXB', 'UKN'].includes(countryCode)) {
      countryCode = 'EOR';
    }
    const getAvatarStylesLookup = (size: AvatarSize | undefined) => {
      const commonStyles = {
        bgcolor: theme.palette.grey[100],
        color: theme.palette.primary.main,
      };

      if (!size) {
        return {
          ...theme.typography.smallAvatar,
          ...commonStyles,
        };
      }

      const styleMap = {
        xlarge: {
          ...theme.typography.imageAvatar,
          ...commonStyles,
        },
        large: {
          ...theme.typography.largeAvatar,
          ...commonStyles,
        },
        medium: {
          ...theme.typography.mediumAvatar,
          ...commonStyles,
        },
        tiny: {
          height: '12px',
          width: '12px',
          ...commonStyles,
        },
        small: {
          ...theme.typography.smallAvatar,
          ...commonStyles,
        },
      };

      return styleMap[size];
    };

    return (
      <Avatar
        sx={getAvatarStylesLookup(size)}
        variant={variant ?? 'rounded'}
        color="primary"
        src={apiConfig.flagIso3EndPoint.replace('{0}', countryCode)}
        alt={countryCode}
        {...stringImageAvatar(countryCode?.toLocaleString().toUpperCase() ?? 'unknown')}
      />
    );
  }

  if (image && image !== '/') {
    const getAvatarStyles = (size: AvatarSize | undefined, matchDownSM: boolean) => {
      let typographyStyles;

      if (size === 'xlarge') {
        typographyStyles = theme.typography.xlargeAvatar;
      } else if (size === 'large' || !matchDownSM) {
        typographyStyles = theme.typography.imageAvatar;
      } else {
        typographyStyles = theme.typography.largeAvatar;
      }

      return {
        ...typographyStyles,
        bgcolor: theme.palette.grey[100],
        color: theme.palette.primary.main,
      };
    };

    return (
      <Avatar
        sx={getAvatarStyles(size, matchDownSM)}
        color="primary"
        src={image}
        variant={variant ?? 'circular'}
        alt={text as string}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.style.display = 'none';
        }}
        {...stringImageAvatar(text?.toLocaleString().toUpperCase() ?? 'unknown')}
      />
    );
  }

  if (props.icon) {
    const getAvatarStyles = (size: AvatarSize | undefined, matchDownSM: boolean) => {
      if (size === 'tiny') {
        return {
          ...theme.typography.mediumAvatar,
          bgcolor: theme.palette.divider,
          color: theme.palette.secondary.main,
        };
      } else if (matchDownSM) {
        return {
          ...theme.typography.mediumAvatar,
          color: theme.palette.grey[100],
          bgcolor: theme.palette.primary.main,
        };
      }

      return {
        ...theme.typography.largeAvatar,
        color: theme.palette.grey[100],
        bgcolor: theme.palette.primary.main,
      };
    };

    return (
      <Avatar
        sx={getAvatarStyles(size, matchDownSM)}
        color="primary"
        variant={variant ?? 'circular'}
      >
        <props.icon />
      </Avatar>
    );
  }

  if (props.size === 'large') {
    return (
      <Avatar {...stringLargeAvatar(props.text?.toLocaleString().toUpperCase() ?? 'unknown')} />
    );
  }

  return <Avatar {...stringAvatar(props.text?.toLocaleString().toUpperCase() ?? 'unknown')} />;
};

const avatarBoxPropsAreEqual = (prev: AvatarBoxProps, next: AvatarBoxProps) => {
  return (
    prev.image === next.image &&
    prev.variant === next.variant &&
    prev.isoCode === next.isoCode &&
    prev.text === next.text &&
    prev.size === next.size &&
    prev.icon === next.icon
  );
};

export const AvatarBox = React.memo(AvatarBoxTemplate, avatarBoxPropsAreEqual);
