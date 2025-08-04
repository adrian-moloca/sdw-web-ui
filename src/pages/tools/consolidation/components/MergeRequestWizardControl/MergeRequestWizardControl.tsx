import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CallMergeOutlinedIcon from '@mui/icons-material/CallMergeOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import { t } from 'i18next';
import { EntityType, IConfigProps } from 'models';
import { ErrorPanel, GenericLoadingPanel, ViewSkeleton } from 'components';
import { MergeRequestComparison } from '../MergeRequestComparison';
import { MergeRequestCandidate } from '../MergeRequestCandidate';
import appConfig from 'config/app.config';
import { Logger, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import useConsolidation from 'hooks/useConsolidation';
import { useModelConfig } from 'hooks';

const steps = ['Select Candidates', 'Validate and Merge!'];

type Props = {
  config: IConfigProps;
  id: string;
  onFinish: () => void;
};

export const MergeRequestWizardControl = ({ config: sourceConfig, id, onFinish }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Array<any>>([]);
  const [weights, setWeights] = useState<{ [id: string]: number }>();
  const [hiddenFields, setHiddenFields] = useState<{ [id: string]: string[] }>({});
  const [originalWeights, setOriginalWeights] = useState<any>();

  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.MergeRequest);
  const apiService = useApiService();

  const { data, error, isLoading } = useQuery({
    queryKey: [`${sourceConfig.entityName}_view`, sourceConfig.type, id],
    queryFn: () => apiService.getById(sourceConfig, id),
  });

  const { upStreamURL } = useConsolidation();
  const { data: dataUpstreams, isLoading: isLoadingUpstreams } = useQuery({
    queryKey: ['upstreams'],
    queryFn: () => apiService.fetch(upStreamURL),
  });

  const queryClient = useQueryClient();

  const url = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_CREATE}`;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.post(url, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      onFinish();
    },
    onError: (error: any) => {
      setActiveStep(0);
      return error;
    },
  });

  const getElement = (): any =>
    isLoading || error ? {} : sourceConfig.type === EntityType.MergeRequest ? data : data?.data;

  const getUpstreams = (): any => (isLoadingUpstreams ? [] : dataUpstreams);

  const handleNext = async () => {
    if (activeStep === 1) {
      const ids: string[] = [];
      ids.push(id);
      selectedItems.forEach((e: any) => ids.push(e.id));

      try {
        if (isEqual(weights, originalWeights))
          await mutation.mutateAsync({ candidates: ids, hiddenFields });
        else
          await mutation.mutateAsync({
            candidates: ids,
            weights,
            hiddenFields,
          });
      } catch {
        if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
      }
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const isNextDisabled = (): boolean => {
    return activeStep === 0 && selectedItems.length === 0;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSetItems = useCallback(
    (items: Array<any>) => {
      setSelectedItems(items);
      const selectedWeights: any = {};
      const currentWeight =
        getUpstreams().find((x: any) => x.ingestSystem == getElement().ingestSystem)?.weight ?? 0;
      set(selectedWeights, id.toString(), currentWeight);
      items.forEach((e: any) => {
        const eWeight =
          getUpstreams().find((x: any) => x.ingestSystem == getElement().ingestSystem)?.weight ?? 0;
        set(selectedWeights, e.id.toString(), eWeight);
      });
      setWeights(selectedWeights);
      setOriginalWeights(selectedWeights);
    },
    [weights, getElement, getUpstreams]
  );

  const handleChangeWeight = (id: string, weight: number) => {
    setWeights({ ...weights, [id.toString()]: weight });
  };

  const handleAddHidden = (id: string, field: string) => {
    setHiddenFields((prevState: { [id: string]: string[] }) => {
      if (prevState[id]) {
        return {
          ...prevState,
          [id]: [...prevState[id], field],
        };
      }
      return {
        ...prevState,
        [id]: [field],
      };
    });
  };

  const handleRemoveHidden = (id: string, searchString: string) => {
    setHiddenFields((prevState: { [id: string]: string[] }) => {
      if (prevState[id]) {
        const updatedStrings = prevState[id].filter((string) => string !== searchString);
        if (updatedStrings.length === 0) {
          // eslint-disable-next-line
          const { [id]: _, ...rest } = prevState;
          return rest;
        }
        return {
          ...prevState,
          [id]: updatedStrings,
        };
      }
      return prevState;
    });
  };

  if (isLoading) return <ViewSkeleton />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ px: 0, marginTop: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {activeStep === 0 && (
              <MergeRequestCandidate
                data={getElement()}
                config={sourceConfig}
                onSelectMultiple={handleSetItems}
              />
            )}
            {activeStep === 1 && (
              <MergeRequestComparison
                data={[getElement(), ...selectedItems]}
                weights={weights}
                hiddenFields={hiddenFields}
                config={sourceConfig}
                onChangeWeight={handleChangeWeight}
                onAddHidden={handleAddHidden}
                onRemoveHidden={handleRemoveHidden}
              />
            )}
            <GenericLoadingPanel loading={mutation.isPending} />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            startIcon={<ArrowBackOutlinedIcon />}
            disabled={activeStep === 0 || mutation.isPending}
            onClick={handleBack}
            sx={{ mr: 1 }}
            aria-label={t('actions.buttonBack')}
          >
            {t('actions.buttonBack')}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            variant={activeStep === steps.length - 1 ? 'contained' : undefined}
            onClick={handleNext}
            startIcon={activeStep === steps.length - 1 ? <CallMergeOutlinedIcon /> : undefined}
            endIcon={activeStep === steps.length - 1 ? undefined : <ArrowForwardOutlinedIcon />}
            disabled={isNextDisabled() || mutation.isPending}
            aria-label={
              activeStep === steps.length - 1 ? t('actions.finish') : t('actions.buttonNext')
            }
          >
            {activeStep === steps.length - 1 ? t('actions.finish') : t('actions.buttonNext')}
          </Button>
        </Box>
      </Box>
    </>
  );
};
