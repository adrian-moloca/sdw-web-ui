import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { MainCard } from 'components/cards/MainCard';
import useApiService from 'hooks/useApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EditionMode,
  EntityType,
  EnumType,
  IEnumProps,
  TemplateType,
  useEnums,
  ViewType,
} from 'models';
import { AvatarBox, FieldTemplate, GenericLoadingPanel } from 'components';
import get from 'lodash/get';
import { Button, IconButton, Typography, useColorScheme, useTheme } from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import FlagCircleTwoToneIcon from '@mui/icons-material/FlagCircleTwoTone';
import { t } from 'i18next';
import { useModelConfig, useSecurity } from 'hooks';
import { isDevelopment, Logger } from '_helpers';
import { Transitions } from 'components/Transitions';
import { SectionForm } from '../../forms';
import { MetadataTreeView, SectionDisplay } from '../../components';
import { scrollToDiv } from './utils';

type Props = {
  id?: string;
};

type SectionProps = {
  data?: any;
  variation?: any;
  type?: IEnumProps;
  editionMode: EditionMode;
};

export const VariationSetup = (props: Props) => {
  const theme = useTheme();
  const { getEnumValues } = useEnums();
  const { mode } = useColorScheme();

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];

  const { getConfig, getDataSourceUrl } = useModelConfig();
  const config = getConfig(EntityType.ReportVariation);
  const { canUpdate, canCreate } = useSecurity(config.type, ViewType.View, false);
  const apiService = useApiService();

  const [status, setStatus] = useState<SectionProps>({ editionMode: EditionMode.Detail });

  const url = `${getDataSourceUrl(config.type)}/${props.id}`;
  const { data, isLoading } = useQuery({
    queryKey: [`${props.id}_view`],
    queryFn: () => apiService.fetch(url),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => apiService.put(`${url}/init`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const handleInit = async () => {
    try {
      await mutation.mutateAsync();
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  const showForm = (type: string) =>
    (status.editionMode == EditionMode.Create || status.editionMode == EditionMode.Update) &&
    status.type?.code === type &&
    canUpdate;

  return (
    <>
      <Grid size={12}>
        <MainCard
          size="tiny"
          headerSX={{ py: 0.5 }}
          border={false}
          divider={false}
          content={false}
          avatar={
            <FieldTemplate
              value={get(data.data, 'disciplines')}
              type={TemplateType.ListDiscipline}
              withText={false}
            />
          }
          title={
            <FieldTemplate
              value={get(data.data, 'disciplines')}
              type={TemplateType.Discipline}
              withText={true}
            />
          }
          subHeader={
            <Typography>{`${get(data.data, 'code')} - ${get(data.data, 'subCode')}`}</Typography>
          }
          secondary={
            <>
              {canCreate && (
                <Button
                  disableElevation
                  size="small"
                  color="secondary"
                  variant="outlined"
                  startIcon={<FlagCircleTwoToneIcon />}
                  onClick={handleInit}
                >
                  {t('actions.buttonInitDefault')}
                </Button>
              )}
            </>
          }
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 4, md: 4, lg: 2, xl: 2 }} spacing={1}>
        <MetadataTreeView data={data.data} onSelect={(ids: string | null) => scrollToDiv(ids)} />
      </Grid>
      <Grid container size={{ xs: 8, sm: 8, md: 8, lg: 10, xl: 10 }} spacing={1}>
        {getEnumValues(EnumType.SectionType).map((sectionType: IEnumProps) => {
          const currentSections =
            data.data.sections?.filter(
              (x: any) => x.section.toUpperCase() === sectionType.code.toUpperCase() && !x.inactive
            ) ?? [];
          return (
            <Grid size={12} key={sectionType.code}>
              <MainCard
                id={sectionType.code}
                title={<Typography sx={{ fontWeight: 500 }}>{sectionType.text}</Typography>}
                headerSX={{ backgroundColor: color, py: 1 }}
                elevation={1}
                contentSX={
                  currentSections.length > 0
                    ? { paddingBottom: '10px!important', paddingTop: '10px!important' }
                    : undefined
                }
                avatar={<AvatarBox size={'tiny'} icon={sectionType.icon} text={sectionType.text} />}
                size="tiny"
                border={true}
                divider={currentSections.length > 0}
                content={currentSections.length > 0}
                secondary={
                  <>
                    {canCreate && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() =>
                          setStatus({
                            ...status,
                            type: sectionType,
                            variation: data.data,
                            editionMode: EditionMode.Create,
                          })
                        }
                      >
                        <AddCircleTwoToneIcon />
                      </IconButton>
                    )}
                  </>
                }
              >
                <Grid container spacing={2}>
                  {showForm(sectionType.code) ? (
                    <Grid size={12}>
                      <Transitions
                        type="slide"
                        position={'top-right'}
                        in={status.editionMode != EditionMode.Detail}
                        direction={'left'}
                      >
                        <SectionForm
                          data={status.data}
                          variation={data.data}
                          sectionType={status.type}
                          type={EntityType.ReportSection}
                          editionMode={status.editionMode}
                          onClose={() => setStatus({ ...status, editionMode: EditionMode.Detail })}
                        />
                      </Transitions>
                    </Grid>
                  ) : (
                    <>
                      {currentSections.map((section: any) => (
                        <SectionDisplay
                          data={section}
                          key={section.id}
                          id={props.id ?? ''}
                          onEdit={(dataItem: any) =>
                            setStatus({
                              variation: data.data,
                              data: dataItem,
                              type: sectionType,
                              editionMode: EditionMode.Update,
                            })
                          }
                        />
                      ))}
                    </>
                  )}
                </Grid>
              </MainCard>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
