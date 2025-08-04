import { Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { PageHeader, PageHeaderProps, PageHeaderToolbar } from '@toolpad/core';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { t } from 'i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { AppDispatch, drawerActions } from 'store';
import { EditionMode, EntityType } from 'models';
import { useDispatch } from 'react-redux';

function SecurityPageToolbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const apiService = useApiService();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const urlRun = `${apiConfig.toolsEndPoint}/security/build`;
  const dispatch = useDispatch<AppDispatch>();
  const mutationRun = useMutation({
    mutationFn: async () => apiService.post(urlRun),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
    },
    onError: (error: any) => error,
  });
  if (isMobile) {
    return (
      <PageHeaderToolbar>
        <IconButton
          color="secondary"
          size="small"
          title={t('actions.buttonReload')}
          onClick={() => mutationRun.mutate()}
          sx={{ border: '1px solid #ccc', height: 35 }}
          aria-label={t('actions.buttonReload')}
        >
          <CachedOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="secondary"
          size="small"
          title={t('actions.createUser')}
          onClick={() =>
            dispatch(
              drawerActions.setSelectedItem({
                item: { data: {} },
                type: EntityType.SecurityUser,
                mode: EditionMode.Create,
              })
            )
          }
          sx={{ border: '1px solid #ccc', height: 35 }}
          aria-label={t('actions.createUser')}
        >
          <PersonAddAltOutlinedIcon fontSize="small" />
        </IconButton>

        <IconButton
          color="secondary"
          size="small"
          title={t('actions.createApiClient')}
          onClick={() =>
            dispatch(
              drawerActions.setSelectedItem({
                item: { data: {} },
                type: EntityType.SecurityClient,
                mode: EditionMode.Create,
              })
            )
          }
          sx={{ border: '1px solid #ccc', height: 35 }}
          aria-label={t('actions.createApiClient')}
        >
          <AddModeratorOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ border: '1px solid #ccc', height: 35 }}
          title={t('actions.buttonBack')}
          aria-label={t('actions.buttonBack')}
          onClick={() => navigate(-1)}
          size="small"
        >
          <ArrowBack fontSize="small" />
        </IconButton>
      </PageHeaderToolbar>
    );
  }
  return (
    <PageHeaderToolbar>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<CachedOutlinedIcon />}
        onClick={() => mutationRun.mutate()}
        loading={mutationRun.isPending}
        aria-label={t('actions.buttonReload')}
        sx={{ borderRadius: '20px' }}
      >
        {t('actions.buttonReload')}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<PersonAddAltOutlinedIcon />}
        onClick={() =>
          dispatch(
            drawerActions.setSelectedItem({
              item: { data: {} },
              type: EntityType.SecurityUser,
              mode: EditionMode.Create,
            })
          )
        }
        aria-label={t('actions.createUser')}
        sx={{ borderRadius: '20px' }}
      >
        {t('actions.createUser')}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<AddModeratorOutlinedIcon />}
        onClick={() =>
          dispatch(
            drawerActions.setSelectedItem({
              item: { data: {} },
              type: EntityType.SecurityClient,
              mode: EditionMode.Create,
            })
          )
        }
        aria-label={t('actions.createApiClient')}
        sx={{ borderRadius: '20px' }}
      >
        {t('actions.createApiClient')}
      </Button>
      <IconButton
        sx={{ border: '1px solid #ccc', height: 35 }}
        title={t('actions.buttonBack')}
        aria-label={t('actions.buttonBack')}
        onClick={() => navigate(-1)}
        size="small"
      >
        <ArrowBack fontSize="small" />
      </IconButton>
    </PageHeaderToolbar>
  );
}
export function SecurityPageHeader(props: Readonly<PageHeaderProps>) {
  return <PageHeader slots={{ toolbar: SecurityPageToolbar }} {...props} />;
}
