import Close from '@mui/icons-material/Close';
import { Avatar, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import useConsolidation from 'hooks/useConsolidation';
import useDataGridHelper from 'hooks/useDataGridHelper';
import { GenericLoadingPanel, MainCard } from 'components';
import { DrawerFormProps } from 'models';
import { EditorHelper } from '../EditorHelper';

export const EditGeneralForm = ({ data, type, onClose }: DrawerFormProps) => {
  const { getConfig } = useModelConfig();
  const { getMetadata } = useStoreCache();
  const { getIcon } = useDataGridHelper();
  const config = getConfig(type);
  const metadata = getMetadata(type);
  const apiService = useApiService();
  const { editUrl, getFlatFields, getInitialValues, hasEdit } = useConsolidation();

  const name = get(data.data, config.displayAccessor);
  const { data: setup, isLoading } = useQuery({
    queryKey: [data.data.id, 'editFields', type],
    queryFn: () => apiService.getById(config, data.data.id, editUrl),
    enabled: hasEdit(type),
    refetchOnMount: true,
  });

  const fieldSetup = setup?.data ?? {};
  const fields = getFlatFields(fieldSetup, type, data, metadata);
  const Icon = getIcon(type);

  const buildInitialValues = () => {
    const result: any = {};
    fields.forEach((field) => {
      const value = getInitialValues(field, fieldSetup?.hidden ?? [], metadata);
      result[field.field] = value.data;
    });
    return result;
  };

  const formik = useFormik({
    initialValues: buildInitialValues(),
    onSubmit: (value: any) => {
      console.log(value);
    },
  });

  if (isLoading)
    return (
      <MainCard
        title={name}
        border={false}
        sx={{ height: '100%' }}
        contentSX={{ px: 3 }}
        avatar={
          <Avatar>
            <Icon />
          </Avatar>
        }
        secondary={
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        }
      >
        <GenericLoadingPanel loading={isLoading} />
      </MainCard>
    );

  return (
    <MainCard
      title={name}
      border={false}
      sx={{ height: '100%' }}
      contentSX={{ px: 3 }}
      avatar={
        <Avatar>
          <Icon />
        </Avatar>
      }
      secondary={
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {fields.map((field) => {
            return (
              <Grid size={12} key={field.field}>
                <EditorHelper dataItem={field} formik={formik} metadata={metadata} drawer={true} />
              </Grid>
            );
          })}
        </Grid>
      </form>
    </MainCard>
  );
};
