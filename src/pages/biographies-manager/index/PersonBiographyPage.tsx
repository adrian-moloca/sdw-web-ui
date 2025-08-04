import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, MenuFlagEnum, ViewType } from 'models';
import { EditionChip } from '../components';
import {
  useModelConfig,
  usePersistedState,
  useSecurityProfile,
  useStoreCache,
  useSecurity,
} from 'hooks';

const PersonBiographyPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.PersonBiography);
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
  const { checkPermission } = useSecurityProfile();

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
      config={config}
      showHeader={true}
      toolbarType={'default'}
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      metadata={getMetadata(config.type)}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      secondary={<EditionChip data={managerSetup?.currentEdition} />}
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
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.apiNode,
      }}
    />
  );
};
export default PersonBiographyPage;
