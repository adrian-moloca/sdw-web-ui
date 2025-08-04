import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Stack, Typography } from '@mui/material';
import { MasterData } from 'models';
import { useStoreCache } from 'hooks';

export const QualificationChip = (param: { value: string }) => {
  const { getMasterDataValue } = useStoreCache();
  if (!param.value) return <>{''}</>;
  const qualification = getMasterDataValue(param.value, MasterData.QualificationMark)?.value;
  if (qualification.toLocaleUpperCase() == 'Q' || qualification.indexOf('Qualified') > -1)
    return (
      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }} component={'span'}>
        <CheckOutlinedIcon color="success" style={{ fontSize: '16px' }} />
        <Typography variant="body1">{qualification}</Typography>
      </Stack>
    );

  return <Typography variant="body1">{qualification ?? '-'}</Typography>;
};
