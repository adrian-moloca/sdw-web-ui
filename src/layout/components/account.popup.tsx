import { Account } from '@toolpad/core';
import CustomMenuItems from './account.menu';
import { t } from 'i18next';
import Login from '@mui/icons-material/Login';

export default function AccountPopUp() {
  return (
    <Account
      slots={{
        popoverContent: CustomMenuItems,
      }}
      slotProps={{
        signInButton: {
          variant: 'outlined',
          startIcon: <Login />,
          sx: {
            textTransform: 'none',
            height: '40px',
          },
        },
      }}
      localeText={{
        accountSignInLabel: t('actions.buttonLogin'),
      }}
    />
  );
}
