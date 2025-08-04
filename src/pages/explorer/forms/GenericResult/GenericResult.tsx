import { Stack, Typography } from '@mui/material';

export const GenericResult = (param: { value: string; title: string; icon?: React.ReactNode }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center" component="span">
      <Typography variant="body1" fontWeight="bold">
        {`${param.title}: `}
      </Typography>
      {param.icon}
      <Typography variant="body1" lineHeight={1}>
        {param.value}
      </Typography>
    </Stack>
  );
};
