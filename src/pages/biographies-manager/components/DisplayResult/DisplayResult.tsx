import { Chip, Stack, Theme } from '@mui/material';

export const DisplayResult = (props: { data: any; code: string; theme: Theme }) => {
  const showCode = props.code && props.code !== 'Normal' && props.code !== 'W';

  if (props.data.indexOf(':') > -1)
    return (
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
        <Chip
          variant="outlined"
          label={props.data}
          sx={{
            borderStyle: 'solid',
            borderRadius: 1,
            borderColor: props.theme.palette.divider,
            borderWidth: '1px',
            fontSize: props.theme.typography.h5.fontSize,
            fontFamily: 'Olympic Headline',
            py: 0,
          }}
        />
        {showCode && (
          <Chip
            variant="filled"
            label={props.code}
            sx={{
              borderStyle: 'solid',
              borderRadius: 1,
              borderColor: props.theme.palette.divider,
              borderWidth: '1px',
              fontSize: props.theme.typography.h5.fontSize,
              fontFamily: 'Olympic Headline',
              py: 0,
            }}
          />
        )}
      </Stack>
    );

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
      {props.data.split(' ').map((e: string, i: number) => (
        <Chip
          variant="outlined"
          label={e}
          key={i}
          sx={{
            borderStyle: 'solid',
            borderRadius: 1,
            borderColor: props.theme.palette.divider,
            borderWidth: '1px',
            fontSize: props.theme.typography.h5.fontSize,
            fontFamily: 'Olympic Headline',
            py: 0,
          }}
        />
      ))}
    </Stack>
  );
};
