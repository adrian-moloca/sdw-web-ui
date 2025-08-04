import { Stack, useMediaQuery } from '@mui/material';
import { getDisciplineCode, getDisciplineTitle } from '_helpers';
import { TypographyLink } from 'components/TypographyLink';
import { apiConfig } from 'config/app.config';
import { IIconChipProps } from 'types/cards';

function getIconStyle(param: any, matchDownSM: boolean): React.CSSProperties {
  if (param.sizeNumber) {
    return {
      height: param.sizeNumber,
      width: param.sizeNumber,
    };
  }

  return {
    height: matchDownSM ? '28px' : '40px',
    width: 'auto',
    backgroundColor: 'white',
  };
}
export const DisciplineChip = (param: IIconChipProps) => {
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const code = getDisciplineCode(param.code, param.title);
  const title = param.title ?? getDisciplineTitle(code);
  const display = param.prefix ? `${param.prefix}: ${title}` : title;

  if (!param.hideTitle)
    return (
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <img
          alt={display}
          title={display}
          src={apiConfig.disciplinesIconEndPoint.replace('{0}', code)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = apiConfig.disciplinesIconEndPoint.replace('{0}', 'ATH');
          }}
          style={getIconStyle(param, matchDownSM)}
        />
        <TypographyLink
          typoSize={param.typoSize ?? 'body1'}
          value={display ?? ''}
          route={param.route}
        />
      </Stack>
    );
  return (
    <img
      alt={display}
      title={display}
      src={apiConfig.disciplinesIconEndPoint.replace('{0}', code)}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = apiConfig.disciplinesIconEndPoint.replace('{0}', 'ATH');
      }}
      style={getIconStyle(param, matchDownSM)}
    />
  );
};
