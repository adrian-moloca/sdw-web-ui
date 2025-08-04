import { Typography } from '@mui/material';
import { useMediaQuery, Stack } from '@mui/system';
import { formatMasterCode } from '_helpers';
import { apiConfig } from 'config/app.config';
import { useStoreCache } from 'hooks';
import { Entry, MasterData } from 'models';
import { IIconChipProps } from 'types/cards';

export const CountryChip = (param: IIconChipProps) => {
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const { dataInfo } = useStoreCache();
  let countryCode = formatMasterCode(param.code);
  if (['REF', 'IOP', 'AIN', 'EUN', 'IOA', 'XXB', 'FIS'].includes(countryCode)) {
    countryCode = 'EOR';
  }

  const countryEntry =
    dataInfo[MasterData.Country]?.find((x: Entry) => x.key === param.code) ?? null;
  let display = param.title ?? countryEntry?.value;
  if (param.prefix) display = `${param.prefix}: ${display}`;

  const renderCountryImage = () => {
    const getSizeStyles = () => {
      if (param.sizeNumber) {
        return { height: param.sizeNumber, width: param.sizeNumber };
      }

      if (matchDownSM) {
        switch (param.size) {
          case 'tiny':
            return { height: '10px', width: 'auto' };
          case 'small':
            return { height: '12px', width: 'auto' };
          case 'medium':
            return { height: '16px', width: 'auto' }; //, boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.5)' }
          default:
            return { height: '28px', width: 'auto' }; //, boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.5)' }
        }
      } else {
        switch (param.size) {
          case 'tiny':
            return { height: '18px', width: 'auto' };
          case 'small':
            return { height: '20px', width: 'auto' };
          case 'medium':
            return { height: '24px', width: 'auto' }; //, boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.5)' }
          case 'large':
            return { height: '45px', width: 'auto' }; //, boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.5)' }
          case 'xlarge':
            return { height: '100px', width: 'auto' };
          default:
            return { height: '40px', width: 'auto' }; //, boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.5)' }
        }
      }
    };

    return (
      <img
        alt={display}
        title={display}
        src={apiConfig.flagIso3EndPoint.replace('{0}', countryCode)}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.style.display = 'none';
        }}
        style={{ ...getSizeStyles(), border: '0.5px solid #ccc', borderRadius: '4px' }}
      />
    );
  };

  if (!countryCode || countryCode === '-') {
    return null;
  }
  if (!param.hideTitle && display)
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        {renderCountryImage()}
        <Typography variant={param.typoSize ?? 'body1'}>{display}</Typography>
      </Stack>
    );

  return <>{renderCountryImage()}</>;
};
