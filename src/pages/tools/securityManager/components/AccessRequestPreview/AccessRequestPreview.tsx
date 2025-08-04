import { Button, Divider, Grid, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GenericLoadingPanel, MainCard } from 'components';
import { apiConfig } from 'config/app.config';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { t } from 'i18next';
import { EntityType } from 'models';
import { renderArrayField, renderField } from '../AccessRequestDetail/utils';
import { Fragment } from 'react/jsx-runtime';
import { mapSecurityGroupLabels, mapSecurityScopesLabels } from '../config';
import { formatMasterCode } from '_helpers';
interface Props {
  id: string;
  onClose: () => void;
}
export const AccessRequestPreview = (props: Props) => {
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.AccessRequest);
  const url = `${apiConfig.toolsEndPoint}${config.apiNode}/${props.id}/preview`;
  const { data, isLoading } = useQuery({
    queryKey: [props.id, 'preview'],
    queryFn: () => apiService.fetch(url),
    refetchOnWindowFocus: true,
  });
  const urlRunAuto = `${apiConfig.toolsEndPoint}${config.apiNode}/${props.id}/auto`;
  const mutationAuto = useMutation({
    mutationFn: async () => apiService.post(urlRunAuto),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [config.apiNode] });
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
      props.onClose();
    },
    onError: (error: any) => error,
  });
  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  const hasUsers = data.users && data.users.length > 0;
  const hasClients = data.clients && data.clients.length > 0;
  return (
    <MainCard>
      <Grid container spacing={2}>
        {hasUsers && (
          <Grid size={12}>
            <Typography fontWeight="500">{`${t('access-request.web-access')} (${data.users.length})`}</Typography>
          </Grid>
        )}
        {data.users?.map((e: any, index: number) => (
          <Fragment key={e.id}>
            {renderField(t('general.givenName'), e.givenName)}
            {renderField(t('general.lastName'), e.lastName)}
            {renderField(t('general.userName'), e.username)}
            {renderField(t('general.email'), e.mail)}
            {renderArrayField(
              t('common.operationsProfile'),
              mapSecurityGroupLabels(e.groups.filter((x: string) => !x.includes('$')))
            )}
            {renderArrayField(
              t('common.dataProfile'),
              e.groups
                .filter((x: string) => x.includes('$'))
                .map((x: string) => formatMasterCode(x))
            )}
            {index < data.users.length - 1 && (
              <Grid size={12}>
                <Divider />
              </Grid>
            )}
          </Fragment>
        ))}
        {hasClients && (
          <Grid size={12}>
            <Typography fontWeight="500">{`${t('access-request.api-access')} (${data.clients.length})`}</Typography>
          </Grid>
        )}
        {data.clients?.map((e: any, index: number) => (
          <Fragment key={e.id}>
            {renderField(t('general.clientName'), e.clientName)}
            {renderField(t('general.email'), e.mail)}
            {renderArrayField(
              t('common.operationsProfile'),
              mapSecurityScopesLabels(e.groups.filter((x: string) => !x.includes('$')))
            )}
            {renderArrayField(
              t('common.dataProfile'),
              e.groups
                .filter((x: string) => x.includes('$'))
                .map((x: string) => formatMasterCode(x))
            )}
            {index < data.clients.length - 1 && (
              <Grid size={12}>
                <Divider />
              </Grid>
            )}
          </Fragment>
        ))}
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          startIcon={<SmartToyOutlinedIcon color={'primary'} />}
          onClick={() => mutationAuto.mutate()}
        >
          {t('access-request.auto_process')}
        </Button>
      </Grid>
    </MainCard>
  );
};
