import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import { useSecurity, useSecurityProfile } from 'hooks/useSecurity';
import { useModelConfig, usePersistedState, useStoreCache } from 'hooks';

const OrganisationPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Organization);
  const { checkPermission } = useSecurityProfile();

  const [nocFilter, setNocFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_noc`
  );
  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const [disciplineFilter, setDisciplineFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_discipline`
  );
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      metadata={getMetadata(config.type)}
      tags={{
        countries: countryFilter?.map((e: Entry) => e.key),
        disciplines: disciplineFilter?.map((e: Entry) => e.key),
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
        {
          type: GridActionType.MasterData,
          category: MasterData.Discipline,
          values: disciplineFilter,
          onChange: (data: any) => setDisciplineFilter(data),
          visible: true,
        },
      ]}
    />
  );
};

export default OrganisationPage;
