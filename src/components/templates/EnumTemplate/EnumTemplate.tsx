import React from 'react';
import { Chip, Typography, useTheme, type Theme } from '@mui/material';
import { EntityStatusType, EnumType, IEnumProps, useEnums } from '../../../models';

export interface IEnumTemplateProps {
  type: EnumType;
  value: any;
  size?: string;
  className?: string;
  shortText?: boolean;
  filled?: boolean;
  border?: boolean;
  withText: boolean;
  defaultIfEmpty?: boolean;
}

const EntityStatusChip = ({
  enumValue,
  value,
  theme,
}: {
  enumValue: IEnumProps;
  value: any;
  theme: Theme;
}) => {
  let bgcolor = theme.palette.success.light;
  let color = theme.palette.success.main;

  if (value === EntityStatusType.Disable) {
    color = theme.palette.warning.main;
    bgcolor = theme.palette.warning.light;
  }

  if (value === EntityStatusType.Inactive) {
    color = theme.palette.error.main;
    bgcolor = theme.palette.error.light;
  }

  const Icon = enumValue.icon;
  return (
    <Chip
      size="small"
      sx={{ bgcolor, color, width: '85px' }}
      icon={Icon ? <Icon sx={{ color }} fontSize="small" /> : undefined}
      label={enumValue.text.toLocaleUpperCase()}
    />
  );
};

const EnumTextDisplay = ({
  variant,
  enumValue,
  shortText,
}: {
  variant: 'body1' | 'body2';
  enumValue: IEnumProps;
  shortText?: boolean;
}) => {
  return (
    <Typography variant={variant}>{shortText ? enumValue.shortText : enumValue.text}</Typography>
  );
};

const EnumChipWithText = ({
  enumValue,
  props,
  theme,
  variant,
}: {
  enumValue: IEnumProps;
  props: Readonly<IEnumTemplateProps>;
  theme: Theme;
  variant: 'body1' | 'body2';
}) => {
  const Icon = enumValue.icon;

  return (
    <Chip
      size="small"
      variant={props.filled ? 'filled' : 'outlined'}
      sx={{
        fontSize:
          props.size == 'small' ? theme.typography.body2.fontSize : theme.typography.body1.fontSize,
        my: props.filled ? undefined : 0,
        borderWidth: 0,
        px: 0,
        mx: 0,
        '.MuiChip-label':
          props.size === 'small' ? { ...theme.typography.body2 } : { ...theme.typography.body1 },
      }}
      icon={Icon ? <Icon style={{ color: enumValue.color }} fontSize="small" /> : undefined}
      label={
        <EnumTextDisplay variant={variant} shortText={props.shortText} enumValue={enumValue} />
      }
    />
  );
};

const EnumTemplateBase = (props: Readonly<IEnumTemplateProps>): React.ReactElement => {
  const theme = useTheme();
  const { getEnumValueOf, defaultValueOf } = useEnums();

  const variant = props.size === 'small' ? 'body2' : 'body1';

  const getEnumValue = (): IEnumProps | null => {
    if (props.value == null) {
      if (props.defaultIfEmpty === true) return defaultValueOf(props.type);
      return null;
    }
    const enumValue = getEnumValueOf(props.value.toString(), props.type);
    return enumValue ?? { text: props.value, code: props.value, id: 100, color: 'black' };
  };

  const enumValue = getEnumValue();

  if (!enumValue) return <span>-</span>;

  const Icon = enumValue.icon;
  if (props.type === EnumType.EntityStatus) {
    return <EntityStatusChip enumValue={enumValue} value={props.value} theme={theme} />;
  }

  if (!enumValue.icon) {
    return <EnumTextDisplay shortText={props.shortText} enumValue={enumValue} variant={variant} />;
  }

  if (props.withText) {
    return <EnumChipWithText enumValue={enumValue} props={props} theme={theme} variant={variant} />;
  }

  return Icon ? (
    <Icon
      title={enumValue.code}
      style={{ color: enumValue.color }}
      fontSize="small"
      className={props.className}
      fixedWidth
    />
  ) : (
    <EnumTextDisplay variant={variant} enumValue={enumValue} shortText={props.shortText} />
  );
};

const EnumTemplatePropsAreEqual = (prev: IEnumTemplateProps, next: IEnumTemplateProps) => {
  return (
    prev.withText === next.withText &&
    prev.value === next.value &&
    prev.size === next.size &&
    prev.filled === next.filled &&
    prev.border === next.border &&
    prev.className === next.className &&
    prev.type === next.type &&
    prev.defaultIfEmpty === next.defaultIfEmpty &&
    prev.shortText === next.shortText
  );
};

export const EnumTemplate = React.memo(EnumTemplateBase, EnumTemplatePropsAreEqual);
