import { DataGridPanel } from 'components/datagrid';
import appConfig, { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import { useEffect, useMemo } from 'react';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { t } from 'i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { formatMasterCode, isDevelopment, Logger } from '_helpers';
import {
  useModelConfig,
  useSecurityProfile,
  useStoreCache,
  usePersistedState,
  useSecurity,
} from 'hooks';

const QualifiedHorsePage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.QualifiedHorse);
  const { checkPermission, hasPermission } = useSecurityProfile();
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(EntityType.Horse);
    checkPermission(MenuFlagEnum.GamesTimeInfo);
  }, []);

  const url = `${apiConfig.apiEndPoint}/data-ingest/OG2024/sync`;
  const mutationAutoMap = useMutation({
    mutationFn: () => apiService.post(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const urlDownload = `${appConfig.biographiesManagerEndPoint}/qualifiers/horses/download`;
  const mutationDownload = useMutation({
    mutationFn: () =>
      apiService.downloadExport(
        urlDownload,
        `Olympic_Qualified_Horses_${dayjs().format('yyyyMMDD')}.xlsx`
      ),
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const [disciplineFilter, setDisciplineFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_discipline`
  );
  const [mappedFilter, setMappedFilter] = usePersistedState(
    { mapped: true, unmapped: true },
    `${config.entityName}${appConfig.forgeRockRealm}_map`
  );

  const mapped = useMemo(() => {
    return (mappedFilter.mapped && mappedFilter.unmapped) ||
      (!mappedFilter.mapped && !mappedFilter.unmapped)
      ? undefined
      : Boolean(mappedFilter.mapped);
  }, [mappedFilter]);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      metadata={getMetadata(config.type)}
      tags={{
        countries: countryFilter?.map((e: Entry) => formatMasterCode(e.key)),
        disciplines: disciplineFilter?.map((e: Entry) => {
          let modifiedKey = formatMasterCode(e.key);
          if (modifiedKey.startsWith('ARC-')) {
            modifiedKey = modifiedKey.replace(/^ARC-.*/, 'ARC');
          }
          return modifiedKey;
        }),
        mapped,
      }}
      toolbar={[
        {
          type: GridActionType.MappingFilter,
          value: mappedFilter,
          onChange: (data: any) => setMappedFilter(data),
          visible: true,
        },
        {
          type: GridActionType.LoadingButton,
          label: t('actions.autoMap'),
          action: () => mutationAutoMap.mutate(),
          visible: hasPermission(MenuFlagEnum.Administrator),
          loading: mutationAutoMap.isPending,
          disabled: mutationAutoMap.isPending,
          icon: <AutoFixHighOutlinedIcon />,
        },
        {
          type: GridActionType.LoadingButton,
          label: t('actions.buttonDownload'),
          action: () => mutationDownload.mutate(),
          visible: hasPermission(MenuFlagEnum.Administrator),
          loading: mutationDownload.isPending,
          disabled: mutationDownload.isPending,
          icon: <FileDownloadOutlinedIcon />,
        },
        {
          type: GridActionType.MasterData,
          category: MasterData.Country,
          values: countryFilter,
          onChange: (data: any) => setCountryFilter(data),
          visible: true,
        },
        {
          type: GridActionType.MasterData,
          category: MasterData.Discipline,
          values: disciplineFilter,
          onChange: (data: any) => setDisciplineFilter(data),
          visible: true,
        },
      ]}
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};

export default QualifiedHorsePage;
