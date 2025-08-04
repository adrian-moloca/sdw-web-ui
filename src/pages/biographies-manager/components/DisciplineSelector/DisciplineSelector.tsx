import React from 'react';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import { Box, Button, Chip, styled, Typography } from '@mui/material';
import { t } from 'i18next';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { DisciplineAvatar } from 'components';

type Props = {
  data: any;
  slot: 'link' | 'create';
  onChangeSlot: (slot: 'link' | 'create') => void;
  selected: Array<string>;
  onSelect: (items: Array<string>) => void;
};

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export const DisciplineSelector = (props: Props): React.ReactElement => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Entry);
  const apiService = useApiService();

  const url = `${appConfig.masterDataEndPoint}${config.apiNode}/SDIS`;
  const variables: any = {
    enablePagination: true,
    rows: 300,
    start: 0,
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['SDIS_combo'],
    queryFn: () => apiService.getMasterData(url, variables),
  });

  const handleChange = (newValue: any) => {
    if (!props.selected.includes(newValue)) {
      props.onSelect([...props.selected, newValue]);
    } else {
      props.onSelect([...props.selected.filter((x) => x !== newValue)]);
    }
  };

  const mapDataContent = (content: any[], mappingFunction: (item: any) => any): any[] => {
    return content?.map(mappingFunction) ?? [];
  };

  const getDataArray = (data: any): any[] => {
    const filteredData = props.data.defaultDisciplines
      ? data?.content?.filter((x: any) => props.data.defaultDisciplines?.includes(x.key))
      : data?.content;

    return mapDataContent(filteredData, (item: any) => {
      const firstLetter = item.value[0].toUpperCase();

      return {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        ...item,
      };
    });
  };

  const controlData = isLoading || error ? { data: [] } : { data: getDataArray(data) };

  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid container size={12} alignItems="center"></Grid>
      <Grid size={12}>
        <Typography>{t('message.select-disciplines')}</Typography>
      </Grid>
      <Grid size={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {controlData.data.map((e: any) => (
            <ListItem key={e.key}>
              <Chip
                onClick={() => handleChange(e.key)}
                sx={{
                  cursor: 'pointer',
                  borderColor: 'secondary',
                  borderRadius: 0,
                  paddingLeft: 1,
                  border: '1px solid',
                  fontSize: '1rem',
                }}
                variant={props.selected.includes(e.key) ? 'filled' : 'outlined'}
                avatar={<DisciplineAvatar code={e.key} title={e.value} size={20} />}
                label={e.value}
              />
            </ListItem>
          ))}
        </Box>
      </Grid>
      <Grid size={12} sx={{ display: 'flex' }}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<CancelOutlined fontSize="small" />}
          disabled={props.selected.length === 0}
          onClick={() => props.onSelect([])}
          sx={{ mr: 1 }}
        >
          Clear Selection
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Typography variant="body1">{`${props.selected.length} disciplines selected`}</Typography>
      </Grid>
    </Grid>
  );
};
