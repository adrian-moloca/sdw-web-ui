import useApiService from 'hooks/useApiService';
import { useQuery } from '@tanstack/react-query';
import { EditionMode, EntityType } from 'models';
import { MainCard, GenericLoadingPanel } from 'components';
import { useColorScheme, useTheme } from '@mui/material';
import { GeneralSetupForm } from '../../forms';
import { t } from 'i18next';

type Props = {
  onClose: () => void;
};

export const GeneralSetup = (props: Props) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];
  const apiService = useApiService();

  const { data, isLoading } = useQuery({
    queryKey: ['setup+manager'],
    queryFn: () => apiService.getManagerSetup(),
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard
      title={t('general.reports-manager-setup')}
      size="small"
      headerSX={{ backgroundColor: color }}
    >
      <GeneralSetupForm
        data={data}
        type={EntityType.ReportVariation}
        editionMode={EditionMode.Update}
        onClose={props.onClose}
      />
    </MainCard>
  );
};
