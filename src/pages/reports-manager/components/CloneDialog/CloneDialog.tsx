import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { DialogProps } from '@mui/material';
import get from 'lodash/get';
import { EntityType } from 'models';
import { useModelConfig } from 'hooks';
import { ConfirmDialog } from 'components';

interface Props extends DialogProps {
  data: any;
  type: EntityType;
  onClose: () => void;
}

export const CloneDialog = (props: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const { getDataSource } = useModelConfig();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = getDataSource(props.type).url;
  const mutation = useMutation({
    mutationFn: async () => apiService.put(`${url}/${props.data.id}/clone`, undefined),
    onSuccess: () => {
      props.onClose();
      queryClient.invalidateQueries({ queryKey: [`${config.apiNode}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const handleSubmit = async () => {
    await mutation.mutateAsync();
    props.onClose();
  };

  return (
    <ConfirmDialog
      title={`Clone ${config.display}`}
      message={`Please click on <u>Yes</u> to clone <b>${get(props.data, config.displayAccessor)}</b>, all the dependant structure data will be also cloned`}
      onClickOk={handleSubmit}
      onClickCancel={props.onClose}
      visible={props.open}
    />
  );
};
