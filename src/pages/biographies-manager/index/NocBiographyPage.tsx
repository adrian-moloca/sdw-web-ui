import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import { EditionChip } from '../components';
import {
  useModelConfig,
  useSecurityProfile,
  usePersistedState,
  useStoreCache,
  useSecurity,
} from 'hooks';

const NocBiographyPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.NocBiography);
  const { checkPermission } = useSecurityProfile();
  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const { managerSetup, handleMetadata, handleManagerSetup, handleDataInfo, getMetadata } =
    useStoreCache();

  useEffect(() => {
    const setupData = async () => {
      await handleManagerSetup();
      await handleDataInfo();
      await handleMetadata(config.type);
      checkPermission(MenuFlagEnum.Biography);
    };
    setupData();
  }, []);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      metadata={getMetadata(config.type)}
      secondary={<EditionChip data={managerSetup?.currentEdition} />}
      tags={{
        countries: countryFilter?.map((e: Entry) => e.key),
      }}
      toolbar={[
        {
          type: GridActionType.MasterData,
          category: MasterData.Country,
          values: countryFilter,
          onChange: (data: any) => setCountryFilter(data),
          visible: true,
        },
      ]}
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.apiNode,
      }}
    />
  );
};

export default NocBiographyPage;
