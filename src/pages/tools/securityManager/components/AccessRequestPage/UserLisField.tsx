import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import {
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import get from 'lodash/get';
import { IInputFieldProps } from 'models';
import React from 'react';

interface AdditionalUser {
  name: string;
  email: string;
}

export function UserLisField({
  field,
  disabled,
  formik,
}: Readonly<IInputFieldProps>): React.ReactElement {
  const { values, touched, errors, handleBlur } = formik;
  const theme = useTheme();
  const [newName, setNewName] = React.useState<string>('');
  const [newEmail, setNewEmail] = React.useState<string>('');
  const users: AdditionalUser[] = get(values, field, []);

  const handleAddUser = () => {
    formik.setFieldValue(field, [...users, { name: newName.trim(), email: newEmail.trim() }]);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    formik.setFieldValue(field, updatedUsers);
  };

  return (
    <FormControl
      error={touched[field] && Boolean(errors[field])}
      onBlur={handleBlur}
      id={field}
      style={{ width: '100%' }}
    >
      <Typography lineHeight={1} color="text.secondary">
        {t('access-request.additional-users')}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
        <TextField
          label={t('access-request.userName')}
          value={newName}
          size="small"
          onChange={(event) => setNewName(event.target.value)}
          disabled={disabled}
          margin="none"
          fullWidth
        />
        <TextField
          label={t('general.email')}
          value={newEmail}
          size="small"
          onChange={(event) => setNewEmail(event.target.value)}
          disabled={disabled}
          margin="none"
          fullWidth
        />

        <Button
          type="button"
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleAddUser}
          sx={{ minWidth: 120 }}
          disabled={disabled || !newName.trim() || !newEmail.trim()}
          startIcon={<AddCircleOutline />}
        >
          {t('access-request.add-user')}
        </Button>
      </Stack>
      {users.length > 0 && (
        <List
          dense
          sx={{
            borderRadius: '2px',
            border: `1px solid ${theme.palette.grey[400]}`,
            px: 0,
            py: 0,
            mt: 1,
          }}
        >
          {users.map((user, index) => (
            <ListItem
              key={index}
              sx={{ py: 0 }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUser(index)}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText primary={user.name} sx={{ color: 'text.secondary' }} />
              <ListItemText primary={user.email} sx={{ color: 'text.secondary' }} />
            </ListItem>
          ))}
        </List>
      )}
    </FormControl>
  );
}
