import { Stack, Typography } from '@mui/material';
import { formatMasterCode } from '_helpers';
import useAppRoutes from 'hooks/useAppRoutes';
import { CountryChip, TypographyLink } from 'components';
import get from 'lodash/get';
import { EntityType } from 'models';

interface Props {
  data: any;
  extended: boolean;
  variant: 'body1' | 'body2';
}

export const OrganisationChip = (param: Props) => {
  const country = get(param.data, 'country') ?? get(param.data, 'code');
  const orgType = get(param.data, 'type');
  const name = get(param.data, 'name');
  const id = get(param.data, 'id');
  const code = get(param.data, 'code');
  const { getDetailRoute } = useAppRoutes();
  const formatCode = code?.startsWith('NOC') ? formatMasterCode(code) : formatMasterCode(country);
  const formatName = param.extended ? name : formatCode;

  return (
    <Stack
      spacing={2}
      direction={'row'}
      alignItems={'center'}
      sx={{ minWidth: 60 }}
      component={'span'}
    >
      <CountryChip
        code={country}
        hideTitle={true}
        size={param.variant == 'body1' ? 'small' : 'tiny'}
      />
      <TypographyLink
        value={formatName}
        route={id ? getDetailRoute(EntityType.Organization, id) : undefined}
        typoSize={param.variant}
        sx={{ fontWeight: 500 }}
      />
      {param.extended && (
        <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'italic' }}>
          {formatMasterCode(orgType)}
        </Typography>
      )}
    </Stack>
  );
};
