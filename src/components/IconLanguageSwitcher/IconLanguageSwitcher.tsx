import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import { apiConfig } from 'config/app.config';

export const IconLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setOpen(false);
    window.location.reload();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getFlagUrl = (countryCode: string) => {
    return apiConfig.flagIso2EndPoint.replace(
      '{0}',
      countryCode == 'en' ? 'gb' : countryCode == 'zh' ? 'cn' : countryCode
    );
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ width: 24, height: 24 }}>
          <img
            src={getFlagUrl(i18n.language)}
            alt={i18n.language}
            style={{ width: '100%', height: '100%' }}
          />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleChangeLanguage('en')}>
          <Avatar variant="square" src={getFlagUrl('us')} sx={{ width: 26, height: 20, mr: 2 }} />
          <Typography>{t('languages.english')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage('es')}>
          <Avatar variant="square" src={getFlagUrl('es')} sx={{ width: 26, height: 20, mr: 2 }} />
          <Typography>{t('languages.espanol')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage('fr')}>
          <Avatar variant="square" src={getFlagUrl('fr')} sx={{ width: 26, height: 20, mr: 2 }} />
          <Typography>{t('languages.francais')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage('it')}>
          <Avatar variant="square" src={getFlagUrl('it')} sx={{ width: 26, height: 20, mr: 2 }} />
          <Typography>{t('languages.italian')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage('zh')}>
          <Avatar variant="square" src={getFlagUrl('cn')} sx={{ width: 26, height: 20, mr: 2 }} />
          <Typography>{t('languages.chinese')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
