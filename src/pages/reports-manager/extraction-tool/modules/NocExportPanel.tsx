import { useEffect, useState } from 'react';
import { DataGridPanel } from 'components';
import {
  EditionFlagEnum,
  EntityType,
  Entry,
  GridActionType,
  MasterData,
  MenuFlagEnum,
} from 'models';
import { useModelConfig, usePersistedState, useSecurityProfile, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import dayjs from 'dayjs';
import { t } from 'i18next';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export const NocExportPanel = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Noc);
  const apiService = useApiService();
  const { checkPermission } = useSecurityProfile();
  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Extractor);
  }, []);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    setDownloading(true);
    const fileName = `Olympic_NOCs_${dayjs().format('YYYYMMDD')}.xlsx`;
    await apiService.downloadExtractor(
      `${appConfig.extractorEndPoint}/extractor/noc/download`,
      undefined,
      fileName
    );
    setDownloading(false);
  };
  return (
    <DataGridPanel
      showHeader={false}
      config={config}
      toolbarType="default"
      flags={EditionFlagEnum.CanView}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      metadata={getMetadata(config.type)}
      tags={{
        countries: countryFilter?.map((e: Entry) => e.key),
      }}
      toolbar={[
        {
          type: GridActionType.Button,
          label: t('actions.buttonDownload'),
          icon: <FileDownloadOutlinedIcon />,
          action: () => handleDownload(),
          loading: downloading,
          visible: true,
        },
        {
          type: GridActionType.MasterData,
          category: MasterData.Country,
          values: countryFilter,
          onChange: (data: any) => setCountryFilter(data),
          visible: true,
        },
      ]}
    />
  );
};
