import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import { EditionChip } from '../components';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import {
  useModelConfig,
  useSecurityProfile,
  usePersistedState,
  useStoreCache,
  useSecurity,
} from 'hooks';

const HorseBiographyPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.HorseBiography);
  const { checkPermission } = useSecurityProfile();

  const [nocFilter, setNocFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_noc`
  );
  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const { getMetadata, managerSetup, handleMetadata, handleManagerSetup, handleDataInfo } =
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
      config={config}
      showHeader={true}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      metadata={getMetadata(config.type)}
      sorting={[{ column: config.displayAccessor, operator: 'ASC' }]}
      tags={{
        countries: countryFilter?.map((e: Entry) => e.key),
        nocs: nocFilter?.map((e: Entry) => e.key),
      }}
      secondary={<EditionChip data={managerSetup?.currentEdition} />}
      toolbar={[
        {
          type: GridActionType.MasterData,
          category: MasterData.Noc,
          values: nocFilter,
          onChange: (data: any) => setNocFilter(data),
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
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.apiNode,
      }}
    />
  );
};

export default HorseBiographyPage;
