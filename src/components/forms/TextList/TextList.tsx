import { useState } from 'react';
import {
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import get from 'lodash/get';
import { IInputFieldProps } from 'models';
import config from '../../../baseConfig';

export const TextList = ({ hint, field, label, disabled, formik }: IInputFieldProps) => {
  const { values } = formik;

  const [newValue, setNewValue] = useState('');

  return (
    <List
      dense={true}
      sx={{
        borderRadius: `${config.borderRadius}px`,
        border: `1px solid silver`,
        py: 1,
      }}
      subheader={
        <ListSubheader>
          <TextField
            label={`Type new ${label?.toLowerCase()}`}
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            disabled={disabled}
            margin="dense"
            fullWidth
            size="small"
            helperText={hint}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      disabled={newValue.length < 3}
                      onClick={() => {
                        formik.setFieldValue(field, [...values[field], newValue]);
                        setNewValue('');
                      }}
                      edge="end"
                    >
                      <AddTwoToneIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </ListSubheader>
      }
    >
      {get(values, field)?.map((value: string, index: number) => (
        <ListItem
          sx={{ py: 0 }}
          key={`${value}-${index}`}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                formik.setFieldValue(
                  field,
                  values[field].filter((x: string) => x !== value)
                );
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          }
        >
          <ListItemText primary={value} />
        </ListItem>
      ))}
    </List>
  );
};
