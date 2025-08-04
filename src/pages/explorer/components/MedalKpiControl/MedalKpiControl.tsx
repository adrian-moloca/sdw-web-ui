import { useQuery } from '@tanstack/react-query';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import { Divider, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import type { IPanelTabProps } from 'types/views';
import type { MedalType } from 'types/explorer';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { ErrorPanel, GenericLoadingPanel } from 'components';
import { MedalCard } from '../MedalCard';

const MEDAL_TYPES: { field: MedalType; label: string }[] = [
  { field: 'golden', label: 'general.golden' },
  { field: 'silver', label: 'general.silver' },
  { field: 'bronze', label: 'general.bronze' },
];

export const MedalKpiControl = (props: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const theme = useTheme();
  const config = getConfig(props.parameter.type);

  const url = `${config.apiNode}/${props.parameter.id}/medals`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_medals`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading
    ? []
    : (orderBy(data?.data, ['competition.startDate', 'competition.title'], 'desc') ?? []);

  const olympicDataContent = isLoading
    ? []
    : (orderBy(
        data?.data?.filter((x: any) => x.competition.categories?.includes('CCAT$OLYMPIC_GAMES')),
        ['competition.startDate', 'competition.title'],
        'desc'
      ) ?? []);
  if (isLoading) return <GenericLoadingPanel loading={true} />;

  if (error) return <ErrorPanel error={error} />;

  if (dataContent.length == 0 && olympicDataContent.length == 0) return null;

  return (
    <>
      {olympicDataContent.length > 0 && (
        <>
          <Divider
            variant="fullWidth"
            sx={{ fontSize: theme.typography.body2.fontSize, color: 'text.secondary' }}
          >
            {t('general.olympic-medals')}
          </Divider>
          <Grid container spacing={2} display="flex" justifyContent="center">
            {MEDAL_TYPES.map(({ field, label }) => (
              <BuildKpi
                key={`olympic-${field}`}
                dataContent={olympicDataContent}
                field={field}
                title={t(label)}
              />
            ))}
          </Grid>
        </>
      )}
      {dataContent.length > 0 && (
        <>
          <Divider
            variant="fullWidth"
            sx={{ fontSize: theme.typography.body2.fontSize, color: 'text.secondary' }}
          >
            {t('general.all-medals')}
          </Divider>
          <Grid container spacing={2} display="flex" justifyContent="center">
            {MEDAL_TYPES.map(({ field, label }) => (
              <BuildKpi
                key={`all-${field}`}
                dataContent={dataContent}
                field={field}
                title={t(label)}
              />
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

type BuildKpiProps = {
  dataContent: Array<any>;
  field: MedalType;
  title: string;
};

const BuildKpi = ({ dataContent, field, title }: BuildKpiProps) => {
  const value = sumBy(dataContent, field);
  if (value === 0) return null;

  return (
    <Grid size="auto">
      <MedalCard field={field} data={{ value: value.toString(), title }} />
    </Grid>
  );
};
