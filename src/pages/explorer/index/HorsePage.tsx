import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import {
  useModelConfig,
  useSecurityProfile,
  usePersistedState,
  useStoreCache,
  useSecurity,
} from 'hooks';

function HorsePage(): React.ReactElement {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Horse);
  const { checkPermission } = useSecurityProfile();

  const [nocFilter, setNocFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_noc`
  );
  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Explorer);
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
    />
  );
}

export default HorsePage;
