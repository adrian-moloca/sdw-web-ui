import { Stack } from '@mui/material';
import { apiConfig } from 'config/app.config';
import isoCodes from '_locales/sports_data/isoCodes-min';
import { CountryChip } from 'components';

export const BiosCountry = (props: {
  countryCode: string;
  size: 'small' | 'default';
  position: '1' | '2';
}) => {
  if (props.countryCode.indexOf(',') > -1) {
    const countryCodes = props.countryCode.split(',');

    return (
      <Stack
        direction="row"
        spacing={0.4}
        sx={
          props.position === '1' ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
        }
      >
        {countryCodes.map((e: string) => (
          <CountryChip key={e} code={e} hideTitle={false} />
        ))}
      </Stack>
    );
  }

  const isoCode = isoCodes.countries.find((x: any) => x.code === props.countryCode);
  const display = isoCode?.title;

  if (isoCode == null) {
    return null;
  }

  return (
    <img
      alt={display}
      title={display}
      src={apiConfig.flagIso2EndPoint.replace('{0}', props.countryCode)}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        //currentTarget.src = flagIso;
      }}
      style={
        props.size === 'small'
          ? { height: '24px', width: 'auto' }
          : { height: '40px', width: 'auto' }
      }
    />
  );
};
