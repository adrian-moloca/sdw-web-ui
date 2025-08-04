import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { ListItemIcon, MenuItem, Select, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { apiConfig } from 'config/app.config';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (event: SelectChangeEvent<typeof i18n.language>) => {
    const {
      target: { value },
    } = event;

    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
    window.location.reload();
  };

  const menuItemSx = {
    justifyContent: 'flex-start',
    width: '100%',
    border: 'none',
  };

  return (
    <Select
      disableUnderline
      value={i18n.language}
      onChange={handleChangeLanguage}
      displayEmpty={false}
      sx={{ width: '100%', borderBottom: 'none!important' }}
      size="small"
      variant="standard"
    >
      <MenuItem value="en" sx={menuItemSx}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ListItemIcon>
            <img
              src={apiConfig.flagIso2EndPoint.replace('{0}', 'gb')}
              alt={t('languages.english')}
              height={15}
            />
          </ListItemIcon>
          <Typography>{t('languages.english')}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem value="es" sx={menuItemSx}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ListItemIcon>
            <img
              src={apiConfig.flagIso2EndPoint.replace('{0}', 'es')}
              alt={t('languages.espanol')}
              height={15}
            />
          </ListItemIcon>
          <Typography>{t('languages.espanol')}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem value="fr" sx={menuItemSx}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ListItemIcon>
            <img
              src={apiConfig.flagIso2EndPoint.replace('{0}', 'fr')}
              alt={t('languages.francais')}
              height={15}
            />
          </ListItemIcon>
          <Typography>{t('languages.francais')}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem value="it" sx={menuItemSx}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ListItemIcon>
            <img
              src={apiConfig.flagIso2EndPoint.replace('{0}', 'it')}
              alt={t('languages.italian')}
              height={15}
            />
          </ListItemIcon>
          <Typography>{t('languages.italian')}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem value="zh" sx={menuItemSx}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ListItemIcon>
            <img
              src={apiConfig.flagIso2EndPoint.replace('{0}', 'zh')}
              alt={t('languages.chinese')}
              height={15}
            />
          </ListItemIcon>
          <Typography>{t('languages.chinese')}</Typography>
        </Stack>
      </MenuItem>
    </Select>
  );
};
