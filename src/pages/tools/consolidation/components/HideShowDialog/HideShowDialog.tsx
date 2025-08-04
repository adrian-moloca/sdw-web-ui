import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
  Button,
  DialogContentText,
  Divider,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { t } from 'i18next';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import { Logger, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import { IConfigProps, MetadataModel } from 'models';
import { AppDispatch, metadataActions, notificationActions } from 'store';
import { DialogProps } from 'types/dialog';

interface Props extends DialogProps {
  dataItem: any;
  config: IConfigProps;
  metadata?: { [key: string]: MetadataModel };
  width?: number;
  operation: 'HIDE' | 'SHOW';
}

export const HideShowDialog = (props: Props) => {
  const theme = useTheme();
  const apiService = useApiService();
  const dispatch = useDispatch<AppDispatch>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const title = props.dataItem ? props.dataItem[props.config.displayAccessor] : '';
  const queryClient = useQueryClient();

  const url = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}/${props.config.entityName}/hidden`;

  const mutation = useMutation({
    mutationFn: async (id) =>
      props.operation == 'HIDE' ? apiService.deleteAny(url, { id }) : apiService.post(url, { id }),
    onSuccess: () => {
      dispatch(
        notificationActions.addAlert({
          title: `Hide/Show for ${title} completed with success`,
          type: 1,
        })
      );
      queryClient.invalidateQueries({ queryKey: [`${props.config.entityName}_index`] });
      dispatch(metadataActions.clearHidden());
      props.onClickOk();
    },
    onError: (error: any) => {
      dispatch(
        notificationActions.addAlert({
          title: `Hide/Show for ${title} completed with errors: ${error?.response?.data}`,
          type: 3,
        })
      );
      props.onClickOk();
      return error;
    },
  });

  const executeMutation = async () => {
    try {
      await mutation.mutateAsync(props.dataItem.id);
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="consolidation-hide-title"
    >
      <DialogTitle aria-labelledby="consolidation-hide-title">{`Hide/Show ${props.config.entityName}: ${title}`}</DialogTitle>
      <Divider />
      <DialogContent sx={{ width: 400 }}>
        <DialogContentText>
          You are about to {props.operation} <b>{title}</b> {props.config.entityName}, therefore it
          will not longer be available. Are you sure you want to continue?
        </DialogContentText>
        <GenericLoadingPanel loading={mutation.isPending} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClickCancel}>{t('actions.buttonCancel')}</Button>
        <Button disableElevation variant="contained" onClick={executeMutation}>
          {t('actions.buttonOK')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
