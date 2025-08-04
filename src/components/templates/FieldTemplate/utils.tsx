import { ITemplateIconProps } from './types';
import { Chip, useTheme } from '@mui/material';

export const extractCode = (input: string) => {
  const match = RegExp(/^(\w{3}-\w{8})/).exec(input);
  return match ? match[1] : null;
};

export const TemplateIcon = (props: ITemplateIconProps) => {
  const theme = useTheme();
  const Icon = props.icon;
  return (
    <Chip
      size="small"
      variant="outlined"
      component={'span'}
      sx={{
        fontSize:
          props.size == 'xs' ? theme.typography.body2.fontSize : theme.typography.body1.fontSize,
      }}
      icon={
        <Icon
          style={{ color: props.color, fontSize: '14px' }}
          title={props.display}
          size={props.size}
        />
      }
      label={props.display}
    />
  );
};
