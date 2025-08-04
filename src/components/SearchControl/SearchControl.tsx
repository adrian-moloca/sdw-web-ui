import { t } from 'i18next';
import { InputAdornment, InputBase, InputBaseProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { layout } from 'themes/layout';
import { olympicsDesignColors } from 'themes/colors';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'text.primary',
  borderRadius: layout.radius.lg,
  height: '40px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  ...theme.applyStyles('dark', {
    background: olympicsDesignColors.dark.general.background,
    border: `1px solid ${olympicsDesignColors.dark.general.divider}`,
  }),
  '& .MuiInputBase-input': {
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '16ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const SearchControl = (props: InputBaseProps) => {
  return (
    <StyledInputBase
      placeholder={t('actions.buttonSearch')}
      startAdornment={
        <InputAdornment position="start" sx={{ mx: 1 }}>
          <SearchIcon />
        </InputAdornment>
      }
      inputProps={{ 'aria-label': 'search' }}
      {...props}
    />
  );
};
