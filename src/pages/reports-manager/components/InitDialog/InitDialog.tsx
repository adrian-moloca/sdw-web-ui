import useApiService from 'hooks/useApiService';
import get from 'lodash/get';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DialogProps } from '@mui/material';
import { EntityType } from 'models';
import { useModelConfig } from 'hooks';
import { ConfirmDialog } from 'components';

interface Props extends DialogProps {
  data: any;
  type: EntityType;
  onClose: () => void;
}

export const InitDialog = (props: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const { getDataSource } = useModelConfig();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = getDataSource(props.type).url;
  const mutation = useMutation({
    mutationFn: async () => apiService.put(`${url}/${props.data.id}/init`, undefined),
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
      title={`Initialize ${config.display}`}
      message={`Please click on <u>Yes</u> to initialize <b>${get(props.data, config.displayAccessor)}</b>, all the default data structures will be also initialized`}
      onClickOk={handleSubmit}
      onClickCancel={props.onClose}
      visible={props.open}
    />
  );
};
