import {
  Autocomplete,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { formatDisciplineList } from '_helpers';
import { DisciplineAvatar } from 'components';
import { olympicsDesignColors } from 'themes/colors';

interface Props {
  disciplines: any[];
  selectedDiscipline?: any;
  onSelect: (discipline: any) => void;
}

export const DisciplineSelect: React.FC<Props> = ({
  disciplines,
  selectedDiscipline,
  onSelect,
}) => {
  const theme = useTheme();
  const displayDisciplines = formatDisciplineList(disciplines);

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      options={displayDisciplines}
      value={selectedDiscipline}
      size="small"
      aria-label={t('general.disciplines')}
      onChange={(_e, value) => onSelect(value)}
      getOptionLabel={(option) => option.title}
      getOptionKey={(option) => option.sportDisciplineId ?? ''}
      isOptionEqualToValue={(option, value) => option.sportDisciplineId === value.sportDisciplineId}
      sx={[
        (theme) => ({ backgroundColor: theme.palette.background.paper }),
        (theme) =>
          theme.applyStyles('dark', {
            backgroundColor: olympicsDesignColors.dark.general.background,
          }),
      ]}
      renderOption={(props, option) => (
        <li {...props} key={option.sportDisciplineId}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <DisciplineAvatar code={option.sportDisciplineId} title={option.title} size={25} />
            <Typography variant="body1">{option.display}</Typography>
          </Stack>
        </li>
      )}
      renderInput={(params) => {
        const selected = selectedDiscipline;
        return (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            label={t('general.discipline')}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: theme.typography.body1.fontSize,
                fontFamily: theme.typography.body1.fontFamily,
                fontWeight: 500,
              },
            }}
            placeholder={t('actions.select-a-discipline')}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: selected ? (
                  <InputAdornment position="start">
                    <DisciplineAvatar
                      code={selected.sportDisciplineId}
                      title={selected.title}
                      size={23}
                    />
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        );
      }}
    />
  );
};
