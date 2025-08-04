import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useColorScheme,
  useTheme,
} from '@mui/material';
import {
  BorderedTable,
  ConfirmDialog,
  EnumTemplate,
  ErrorPanel,
  GenericLoadingPanel,
  MainCard,
  StyledTableCell,
  StyledTableRow,
  ViewSkeleton,
} from 'components';
import appConfig from 'config/app.config';
import get from 'lodash/get';
import {
  ConflictStatusEnum,
  EntityType,
  EnumType,
  ExcludedFields,
  IConfigProps,
  MergeEntitySubTypeEnum,
  MergeStatusEnum,
} from 'models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import {
  areAllElementsEqual,
  areAllElementsEqualTo,
  formatAthleteName,
  isAtLeastOneElementEqualTo,
  isDevelopment,
  Logger,
} from '_helpers';
import { useEffect, useState } from 'react';
import sortedUniq from 'lodash/sortedUniq';
import { Link as RouteLink } from 'react-router-dom';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import useApiService from 'hooks/useApiService';
import Circle from '@mui/icons-material/Circle';
import { useAppModel, useModelConfig, useStoreCache } from 'hooks';

export type MergeOperation = 'reject' | 'cancel' | 'update' | 'decouple' | 'confirm';

type Props = {
  id: string;
  type: EntityType;
  onFinish: (operation: MergeOperation) => void;
};

export const MergeRequestControl = (props: Props) => {
  const apiService = useApiService();
  const { getMetadata } = useStoreCache();
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { formatField } = useAppModel();
  const { getConfig: getModelConfig } = useModelConfig();
  const config = getModelConfig(EntityType.MergeRequest);

  const [hiddenFields, setHiddenFields] = useState<{ [id: string]: string[] }>({});
  const [confirmInfo, setConfirmInfo] = useState({
    message: '',
    title: '',
    visible: false,
    operation: '',
    id: '',
  });

  const queryClient = useQueryClient();

  const getConfig = (): IConfigProps => {
    return getModelConfig(props.type);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`${config.entityName}_merge${props.id}`],
    queryFn: () =>
      apiService.getById(config, props.id ?? '', `${appConfig.apiEndPoint}${config.apiNode}`),
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setHiddenFields(data.hiddenFields ?? {});
    }
  }, [isLoading, data]);

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

  const isHiddenField = (id: string, field: string) => {
    if (hiddenFields[id]) {
      return hiddenFields[id].includes(field);
    }
    return false;
  };

  const metaData = getMetadata(props.type);

  const splitUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_SPLIT}`;
  const mutationSplit = useMutation({
    mutationFn: () => apiService.put(splitUrl, { requestId: data.requestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      props.onFinish('decouple');
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const cancelUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_CANCEL}${data?.requestId}`;
  const mutationCancel = useMutation({
    mutationFn: () => apiService.put(cancelUrl, { requestId: data.requestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      props.onFinish('cancel');
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const rejectUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_REJECT}`;
  const mutationReject = useMutation({
    mutationFn: () => apiService.put(rejectUrl, { consolidationId: data.requestId, remove: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      props.onFinish('reject');
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const detachUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_DETACH}${confirmInfo.id}`;
  const mutationDetach = useMutation({
    mutationFn: () => apiService.put(detachUrl, { requestId: confirmInfo.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_merge${props.id}`] });
      queryClient.invalidateQueries({ queryKey: [config.entityName] });
      window.location.reload();
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const confirmUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_CONFIRM}`;
  const mutationConfirm = useMutation({
    mutationFn: () => apiService.put(confirmUrl, { id: data?.requestId, hiddenFields }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_merge${props.id}`] });
      queryClient.invalidateQueries({ queryKey: [config.entityName] });
      props.onFinish('confirm');
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const updateUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_UPDATE}`;
  const mutationUpdate = useMutation({
    mutationFn: () => apiService.put(updateUrl, { id: data?.requestId, hiddenFields }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_merge${props.id}`] });
      queryClient.invalidateQueries({ queryKey: [config.entityName] });
      props.onFinish('update');
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const getName = () => {
    if (isLoading || error) {
      return t('common.unknown');
    }

    if (data?.entitySubType === MergeEntitySubTypeEnum.Person) {
      return formatAthleteName(data.consolidationRecord);
    }
    const displayName = get(data, config.displayAccessor) ?? '';
    if (displayName) {
      return displayName;
    }

    const names = data?.records
      .map((e: any) => get(e, getConfig().displayAccessor) ?? '')
      .filter((e: string) => e && e != '');
    if (names.length > 1) {
      return names.join(', ');
    }

    return t('common.unknown');
  };

  if (isLoading) return <ViewSkeleton />;
  if (error) return <ErrorPanel error={error} />;
  if (!data) return <ErrorPanel error={`Ups! ${config.display} not found`} />;

  const canEditHidden =
    data?.status === MergeStatusEnum.PendingConfirmation ||
    data?.status === MergeStatusEnum.Done ||
    data?.status === MergeStatusEnum.Active;
  const hasUpdate =
    data?.status === MergeStatusEnum.Done || data?.status === MergeStatusEnum.Active;
  const hasDecouple = data?.status === MergeStatusEnum.Done;
  const hasConfirm = data?.status === MergeStatusEnum.PendingConfirmation;
  const hasCancel =
    data?.status === MergeStatusEnum.Active ||
    data?.status === MergeStatusEnum.PendingConfirmation ||
    (MergeStatusEnum.Done && data?.conflictStatus !== ConflictStatusEnum.OK);

  const BuildActionMapping = () => {
    return (
      <ButtonGroup disableRipple variant="outlined" color="secondary">
        {(hasDecouple || hasCancel) && (
          <Button
            startIcon={<DoNotDisturbOnOutlinedIcon />}
            onClick={() =>
              setConfirmInfo({
                title: `${t('consolidation.title_reject')}: ${getName()}`,
                message: t('consolidation.message_reject'),
                visible: true,
                operation: 'reject',
                id: data.requestId,
              })
            }
            disabled={mutationReject.isPending}
          >
            {t('actions.reject')}
          </Button>
        )}
        {hasDecouple && (
          <Button
            startIcon={<CallSplitOutlinedIcon />}
            onClick={() =>
              setConfirmInfo({
                title: `${t('consolidation.title_split')}: ${data.title}`,
                message: t('consolidation.message_split'),
                visible: true,
                operation: 'split',
                id: data.requestId,
              })
            }
            disabled={mutationCancel.isPending}
          >
            {t('actions.buttonDecouple')}
          </Button>
        )}
        {hasCancel && (
          <Button
            startIcon={<CancelOutlinedIcon />}
            onClick={() =>
              setConfirmInfo({
                title: `${t('consolidation.title_cancel')}: ${getName()}`,
                message: t('consolidation.message_cancel'),
                visible: true,
                operation: 'cancel',
                id: data.requestId,
              })
            }
            disabled={mutationCancel.isPending}
          >
            {t('actions.buttonCancel')}
          </Button>
        )}
        {hasConfirm && (
          <Button
            startIcon={<CheckCircleOutlinedIcon />}
            onClick={() =>
              setConfirmInfo({
                title: `${t('consolidation.title_confirm')}: ${getName()}`,
                message: t('consolidation.message_confirm'),
                visible: true,
                operation: 'confirm',
                id: data.requestId,
              })
            }
            disabled={mutationConfirm.isPending}
          >
            {t('actions.buttonConfirm')}
          </Button>
        )}
        {hasUpdate && (
          <Button
            startIcon={<SaveOutlinedIcon />}
            onClick={() =>
              setConfirmInfo({
                title: `${t('consolidation.title_update')}`,
                message: t('consolidation.message_update'),
                visible: true,
                operation: 'update',
                id: data.requestId,
              })
            }
            disabled={mutationConfirm.isPending}
          >
            {t('actions.buttonUpdateSetup')}
          </Button>
        )}
      </ButtonGroup>
    );
  };

  const renderConflictStatus = (field: string) => {
    if (
      data?.status === MergeStatusEnum.Done ||
      data?.status === MergeStatusEnum.Active ||
      data?.status === MergeStatusEnum.PendingConfirmation
    ) {
      return ValidateConflictStatus(field);
    }

    const value = data.conflicts.find((e: any) => e.attribute === field);
    if (!value) return ValidateConflictStatus(field);

    return (
      <EnumTemplate type={EnumType.ConflictStatus} value={value.conflictStatus} withText={false} />
    );
  };

  const ValidateConflictStatus = (field: string) => {
    const fieldValues = data?.records?.map((e: any) => get(e, field) ?? '-');
    if (areAllElementsEqualTo(fieldValues, '-'))
      return <Circle sx={{ color: theme.palette.info.main, fontSize: '14px' }} />;

    if (areAllElementsEqual(fieldValues))
      return <Circle sx={{ color: theme.palette.success.main, fontSize: '14px' }} />;

    if (isAtLeastOneElementEqualTo(fieldValues, '-'))
      return <Circle sx={{ color: theme.palette.success.main, fontSize: '14px' }} />;

    return <Circle sx={{ color: theme.palette.warning.main, fontSize: '14px' }} />;
  };

  const hasNonEmptyRecords = (field: string) => {
    return data.records.some((record: any) => get(record, field));
  };

  const hasDetach = data.records && data.records.length > 2;
  const sortedConflicts = sortedUniq(data.conflicts);
  const sortedConflictField = sortedConflicts.map((e: any) => e.attribute);

  let sortedOtherFields = sortedUniq(
    Object.keys(metaData ?? data.records[0]).filter(
      (e) => !sortedConflictField.includes(e) && e != 'id'
    )
  );

  if (props.type === EntityType.Person && metaData) {
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'PERSON'
    );
  }

  if (props.type === EntityType.Horse && metaData) {
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'HORSE'
    );
  }

  const handleDetach = (record: any) => {
    setConfirmInfo({
      title: t('consolidation.title_detach'),
      message: `${t('consolidation.message_detach')}<br/><b>${get(record, 'ingestOrganisation')}</b>: ${get(record, 'id')}`,
      visible: true,
      operation: 'detach',
      id: get(record, 'id'),
    });
  };

  return (
    <>
      <MainCard
        boxShadow={false}
        border={false}
        title={t('common.fieldsMapping')}
        secondary={<BuildActionMapping />}
      >
        <GenericLoadingPanel loading={mutationCancel.isPending || mutationConfirm.isPending} />
        <TableContainer component={Box} sx={{ px: 0, paddingBottom: 2 }}>
          <BorderedTable stickyHeader sx={{ minWidth: 300, tableLayout: 'fixed' }} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 20 }}></StyledTableCell>
                <StyledTableCell sx={{ width: 160 }}>{t('common.field')}</StyledTableCell>
                {data?.records?.map((e: any) => (
                  <StyledTableCell sx={{ width: 210 }} key={`${e.id}_header`}>
                    {e.sourceid}
                    {hasDetach && (
                      <IconButton
                        color="primary"
                        sx={{ marginLeft: '5px', p: 0 }}
                        onClick={() => handleDetach(e)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </StyledTableCell>
                ))}
                <StyledTableCell sx={{ width: 210 }}>{t('general.result')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <TableCell align="center"></TableCell>
                <TableCell scope="row">{t('general.internalId')}</TableCell>
                {data.records?.map((record: any, i: number) => (
                  <TableCell key={`${i}_id`}>
                    {!hasDecouple ? (
                      <RouteLink
                        to={`/${getConfig().path}/${get(record, 'id')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                      >
                        {get(record, 'id')}
                      </RouteLink>
                    ) : (
                      `${get(record, 'id')}`
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {get(data.consolidationRecord, 'id') ? (
                    <RouteLink
                      to={`/${getConfig().path}/${get(data.consolidationRecord, 'id')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {get(data.consolidationRecord, 'id') ?? '-'}
                    </RouteLink>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </StyledTableRow>
              {sortedConflicts.map((conflict: any) => (
                <StyledTableRow key={conflict.attribute}>
                  <TableCell align="center">{renderConflictStatus(conflict.attribute)}</TableCell>
                  <TableCell scope="row">
                    {get(metaData, conflict.attribute)?.displayName ?? conflict.attribute}
                  </TableCell>
                  {data.records?.map((record: any, i: number) => {
                    const isHidden = isHiddenField(get(record, 'id'), conflict.attribute);
                    const isReadOnly = ExcludedFields.includes(conflict.attribute);
                    return (
                      <TableCell key={`${i}_other`}>
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                          <IconButton
                            color={isHidden ? 'warning' : 'inherit'}
                            size="small"
                            sx={{ marginRight: '3px', p: 0 }}
                            disabled={isReadOnly || !canEditHidden}
                            onClick={() =>
                              isHidden
                                ? handleRemoveHidden(get(record, 'id'), conflict.attribute)
                                : handleAddHidden(get(record, 'id'), conflict.attribute)
                            }
                          >
                            {isReadOnly ? (
                              <LockOutlinedIcon
                                fontSize="small"
                                sx={{ color: theme.palette.warning.main }}
                              />
                            ) : isHidden ? (
                              <VisibilityOffOutlinedIcon
                                fontSize="small"
                                sx={{ color: theme.palette.text.secondary }}
                              />
                            ) : (
                              <VisibilityOutlinedIcon
                                fontSize="small"
                                sx={{ color: theme.palette.primary.main }}
                              />
                            )}
                          </IconButton>
                          {formatField(
                            conflict.attribute,
                            get(record, conflict.attribute),
                            metaData
                          )}
                        </Stack>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {formatField(
                      conflict.attribute,
                      get(data.consolidationRecord, conflict.attribute),
                      metaData
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
              {sortedOtherFields
                .filter((x) => hasNonEmptyRecords(x))
                .map((field: any) => (
                  <StyledTableRow key={field}>
                    <TableCell align="center">{ValidateConflictStatus(field)}</TableCell>
                    <TableCell scope="row">{get(metaData, field)?.displayName ?? field}</TableCell>
                    {data.records?.map((record: any, i: number) => {
                      const isHidden = isHiddenField(get(record, 'id'), field);
                      const isReadOnly = ExcludedFields.includes(field);

                      return (
                        <TableCell key={`${i}_other`}>
                          <Stack direction="row" sx={{ alignItems: 'center' }}>
                            <IconButton
                              color={isHidden ? 'warning' : 'inherit'}
                              size="small"
                              sx={{ marginRight: '3px', p: 0 }}
                              disabled={isReadOnly || !canEditHidden}
                              onClick={() =>
                                isHidden
                                  ? handleRemoveHidden(get(record, 'id'), field)
                                  : handleAddHidden(get(record, 'id'), field)
                              }
                            >
                              {isReadOnly ? (
                                <LockOutlinedIcon
                                  fontSize="small"
                                  sx={{ color: theme.palette.warning.dark }}
                                />
                              ) : isHidden ? (
                                <VisibilityOffOutlinedIcon
                                  fontSize="small"
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              ) : (
                                <VisibilityOutlinedIcon
                                  fontSize="small"
                                  sx={{ color: theme.palette.primary.main }}
                                />
                              )}
                            </IconButton>
                            {formatField(field, get(record, field), metaData)}
                          </Stack>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {formatField(field, get(data.consolidationRecord, field), metaData)}
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </BorderedTable>
        </TableContainer>
      </MainCard>
      <ConfirmDialog
        title={confirmInfo.title}
        message={confirmInfo.message}
        onClickOk={async () => {
          try {
            if (confirmInfo.operation === 'cancel') await mutationCancel.mutateAsync();
            if (confirmInfo.operation === 'confirm') await mutationConfirm.mutateAsync();
            if (confirmInfo.operation === 'split') await mutationSplit.mutateAsync();
            if (confirmInfo.operation === 'detach') await mutationDetach.mutateAsync();
            if (confirmInfo.operation === 'update') await mutationUpdate.mutateAsync();
            if (confirmInfo.operation === 'reject') await mutationReject.mutateAsync();
          } catch {
            if (isDevelopment) Logger.error('Error during request submission');
          }

          setConfirmInfo({
            message: '',
            title: '',
            visible: false,
            operation: '',
            id: '',
          });
        }}
        onClickCancel={() =>
          setConfirmInfo({
            message: '',
            title: '',
            visible: false,
            operation: '',
            id: '',
          })
        }
        visible={confirmInfo.visible}
      />
    </>
  );
};
