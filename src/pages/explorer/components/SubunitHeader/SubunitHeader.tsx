import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { lime } from '@mui/material/colors';
import { MasterData } from 'models';
import { useStoreCache } from 'hooks';
import { TypographyLink } from 'components';

type Props = {
  data: any;
};
export const SubunitAvatar = ({ data }: Props) => {
  return (
    <Avatar
      sx={{
        height: 30,
        width: 30,
        bgcolor: lime[600],
        fontSize: '12px',
        fontWeight: 500,
      }}
    >{`S${data.order ?? '0'}`}</Avatar>
  );
};
export const SubunitHeader = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const type = getMasterDataValue(data?.type, MasterData.UnitType)?.value;
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  return (
    <Stack direction="row" spacing={1}>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <TypographyLink value={data.title} typoSize="subtitle1" sx={{ lineHeight: 1.1 }} />
          {data.type && (
            <Chip
              size="small"
              variant="outlined"
              label={type.toUpperCase()}
              sx={{ fontWeight: 400 }}
            />
          )}
          {data.resultStatus && (
            <Chip size="small" label={status.toUpperCase()} sx={{ fontWeight: 400 }} />
          )}
        </Stack>
        {data.venue && (
          <Typography variant="body1" lineHeight={1.1} color="text.secondary" sx={{ mb: 0.5 }}>
            {data.venue.title}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
