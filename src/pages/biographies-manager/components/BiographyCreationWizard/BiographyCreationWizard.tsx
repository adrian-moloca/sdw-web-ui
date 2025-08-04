import { MainCard } from 'components/cards/MainCard';
import { EntityType } from 'models';
import { Avatar, Divider, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { ViewSkeleton } from 'components/skeletons';
import appConfig, { apiConfig } from 'config/app.config';
import { Logger, isDevelopment } from '_helpers';
import baseConfig from 'baseConfig';
import useAppRoutes from 'hooks/useAppRoutes';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiographyCandidates, DisciplineSelector } from 'pages/biographies-manager/components';
import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import { useModelConfig, useStoreCache } from 'hooks';

interface Props {
  type: EntityType;
  onFinish?: () => void;
}

export const BiographyCreationWizard = (props: Readonly<Props>): React.ReactElement => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getIndexRoute, baseRoutes } = useAppRoutes();
  const { getConfig, parseEntityType } = useModelConfig();
  const { clearNocs } = useStoreCache();
  const config = getConfig(props.type);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const apiService = useApiService();
  const location = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ['managers_setup'],
    queryFn: () => apiService.fetch(`${apiConfig.reportManagerEndPoint}/setup`),
  });

  const [slot, setSlot] = useState<'link' | 'create'>('link');
  const queryClient = useQueryClient();
  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}`;

  const mutation = useMutation({
    mutationFn: async (updateData: any) =>
      apiService.put(slot == 'link' ? `${url}/link` : `${url}/create`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      clearNocs();
      navigate(getIndexRoute(props.type));
    },
    onError: (error: any) => {
      return error;
    },
  });

  const [selectedItems, setSelectedItems] = React.useState<Array<any>>([]);
  const [createdItem, setCreatedItem] = React.useState<any>(undefined);
  const [disciplines, setDisciplines] = React.useState<Array<any>>([]);

  const handleCreate = async () => {
    try {
      await mutation.mutateAsync(createdItem);
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  const handleSelect = async () => {
    const ids: string[] = [];
    selectedItems.forEach((e: any) => ids.push(e.id));

    try {
      await mutation.mutateAsync({ ids, disciplines });
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  const disable = !disciplines || disciplines.length === 0;

  if (isLoading) return <ViewSkeleton />;

  return (
    <PageContainer
      maxWidth="xl"
      title={`New ${config.display}`}
      breadcrumbs={[
        { title: config.area, path: baseRoutes.Biographies },
        { title: config.displayPlural, path: getIndexRoute(props.type) },
        { title: 'New', path: location.pathname },
      ]}
    >
      <Grid container spacing={matchDownSM ? baseConfig.gridSpacing - 1 : baseConfig.gridSpacing}>
        <Grid size={12}>
          <MainCard
            size="medium"
            avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>1</Avatar>}
            divider={false}
            border={false}
            title={t('messages.select-the-disciplines')}
            headerSX={{ paddingBottom: 0 }}
          >
            <DisciplineSelector
              {...props}
              data={data}
              selected={disciplines}
              slot={slot}
              onChangeSlot={(slot) => setSlot(slot)}
              onSelect={(e: any) => setDisciplines(e)}
            />
          </MainCard>
        </Grid>
        {!disable && (
          <Grid size={12}>
            <Divider />
          </Grid>
        )}
        {!disable && (
          <Grid container size={12} spacing={1}>
            <Grid size={{ xs: 12, md: 5 }}>
              <BiographyCandidates
                {...props}
                slot="link"
                candidateType={parseEntityType(props.type)}
                onSelect={(data: any[]) => {
                  setSelectedItems(data);
                  handleSelect();
                }}
                disciplines={disciplines}
                onCreate={(dataItem: any) => {
                  setCreatedItem(dataItem);
                  handleCreate();
                }}
              />
            </Grid>
            <Grid size={{ xs: 0, md: 1 }}>
              <Divider orientation="vertical">or</Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BiographyCandidates
                {...props}
                slot="create"
                candidateType={parseEntityType(props.type)}
                onSelect={(data: any[]) => setSelectedItems(data)}
                disciplines={disciplines}
                onCreate={(dataItem: any) => {
                  setCreatedItem(dataItem);
                  handleCreate();
                }}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};
