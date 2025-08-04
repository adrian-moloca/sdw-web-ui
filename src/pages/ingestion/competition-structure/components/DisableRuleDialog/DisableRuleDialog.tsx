import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { RuleModeEnum } from 'models';
import type { DialogProps } from 'types/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { humanize } from '_helpers';
import get from 'lodash/get';

interface Props extends DialogProps {
  data: any;
  width?: string;
  disciplineCode: string;
  edition: string;
}

export const DisableRuleDialog = (props: Props) => {
  const theme = useTheme();
  const apiService = useApiService();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const kind = get(props.data, 'kind');
  const isIgnored = kind === RuleModeEnum.Ignored;
  const isManual = kind === RuleModeEnum.Manual;

  const url = `${appConfig.toolsEndPoint}/odf/structure/rules`;
  const mutation = useMutation({
    mutationFn: async (updateData: any) =>
      isIgnored
        ? apiService.put(`${url}/activate?edition=${updateData.edition}&id=${updateData.id}`, null)
        : apiService.deleteAny(`${url}?edition=${updateData.edition}&id=${updateData.id}`, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint] });
      props.onClickOk();
    },
    onError: () => {
      props.onClickOk();
    },
  });

  const handleSubmit = () => {
    mutation.mutateAsync({
      id: props.data.id,
      edition: props.edition,
    });
  };

  const operation = isIgnored ? 'ACTIVATE' : isManual ? 'DELETE' : 'DISABLE';

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="md"
      fullScreen={fullScreen}
      aria-labelledby="disable-rule-title"
    >
      <DialogTitle aria-labelledby="create-rule-title">
        {isIgnored
          ? `${props.disciplineCode}: Activate Rule`
          : `${props.disciplineCode}: ${operation} Rule`}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {`Are you sure you want to ${operation} rule `}
          <u>{humanize(props.data?.displayName)}</u> for <b>{props.data?.code}</b>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 2, px: 2 }}>
        <Button
          startIcon={<CancelOutlined />}
          disableElevation
          variant="text"
          color="secondary"
          onClick={props.onClickCancel}
          sx={{ mr: 1 }}
        >
          {t('actions.buttonCancel')}
        </Button>
        <Button
          loadingPosition="start"
          loading={mutation.isPending}
          disableElevation
          color="secondary"
          variant="outlined"
          startIcon={<SaveOutlined />}
          onClick={handleSubmit}
        >
          {t('actions.buttonOK')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
