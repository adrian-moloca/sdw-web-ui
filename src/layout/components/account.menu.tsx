import {
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Assessment from '@mui/icons-material/Assessment';
import CleaningServicesOutlined from '@mui/icons-material/CleaningServicesOutlined';
import LaptopWindowsOutlined from '@mui/icons-material/LaptopWindowsOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import useAppRoutes from 'hooks/useAppRoutes';
import { profileTitle } from '_helpers';
import { AccountPopoverFooter, AccountPreview, SignOutButton } from '@toolpad/core';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, notificationActions, RootState } from 'store';
import appConfig from 'config/app.config';
import { LanguageSwitcher } from 'components/LanguageSwitcher';
import { useStoreCache } from 'hooks';

export default function CustomMenu() {
  const { baseRoutes } = useAppRoutes();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { clearMetadata, clearReportSetup } = useStoreCache();
  const auth = useSelector((x: RootState) => x.auth);
  const systemInfo = useSelector((state: RootState) => state.auth.systemInfo);
  const navigate = useNavigate();

  if (auth.isAuthorized)
    return (
      <Stack direction="column">
        <AccountPreview
          variant="expanded"
          sx={{
            '& .MuiTypography-root': {
              fontSize: '1rem',
            },
          }}
        />
        <Divider />
        <MenuList dense disablePadding>
          <MenuItem
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
          >
            <Typography>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('messages.your-profile', { profile: profileTitle(auth).toUpperCase() }),
                }}
              />
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
          >
            <ListItemIcon>
              <LaptopWindowsOutlined />
            </ListItemIcon>
            {`${systemInfo?.applicationName} ${appConfig.version} - ${appConfig.forgeRockRealm.toUpperCase()}`}
          </MenuItem>
          <Divider />
          <MenuItem
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
            onClick={() => dispatch(notificationActions.purgeNotification())}
          >
            <ListItemIcon>
              <MarkEmailReadOutlinedIcon />
            </ListItemIcon>
            {t('message.mark-all-notifications-as-read')}
          </MenuItem>
          <MenuItem
            onClick={() => navigate(baseRoutes.Profile)}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
          >
            <ListItemIcon>
              <SecurityOutlined />
            </ListItemIcon>
            {t('actions.buttonSecuritySettings')}
          </MenuItem>
          <MenuItem
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
            onClick={() => {
              clearMetadata();
            }}
          >
            <ListItemIcon>
              <CleaningServicesOutlined />
            </ListItemIcon>
            {t('actions.buttonCleanMetadata')}
          </MenuItem>
          <MenuItem
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              fontSize: theme.typography.body1.fontSize,
            }}
            onClick={() => clearReportSetup()}
          >
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            {t('actions.clean-managers-setup')}
          </MenuItem>
        </MenuList>
        <Divider sx={{ mt: 2 }} />
        <AccountPopoverFooter>
          <SignOutButton />
        </AccountPopoverFooter>
      </Stack>
    );

  return (
    <Stack direction="column">
      <AccountPreview
        variant="expanded"
        sx={{
          '& .MuiTypography-root': {
            fontSize: '1rem',
          },
        }}
      />
      <Divider />
      <MenuList dense disablePadding>
        <MenuItem sx={{ justifyContent: 'flex-start', width: '100%' }}>
          <ListItemIcon>
            <LaptopWindowsOutlined />
          </ListItemIcon>
          {`${systemInfo?.applicationName} ${appConfig.version} - ${appConfig.forgeRockRealm.toUpperCase()}`}
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'flex-start', width: '100%' }}>
          <LanguageSwitcher />
        </MenuItem>
      </MenuList>
    </Stack>
  );
}
