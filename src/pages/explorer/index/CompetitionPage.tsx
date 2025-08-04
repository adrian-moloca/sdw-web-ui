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
import { useTranslation } from 'react-i18next';

const CompetitionPage = () => {
  const { getConfig } = useModelConfig();
  const { i18n } = useTranslation();
  const config = getConfig(EntityType.Competition);
  const { checkPermission } = useSecurityProfile();

  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_noc`
  );
  const [categoryFilter, setCategoryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_category`
  );
  const [disciplineFilter, setDisciplineFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_discipline`
  );

  const { getMetadata, handleMetadata, handleHidden } = useStoreCache();

  useEffect(() => {
    handleHidden(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  useEffect(() => {
    handleMetadata(config.type);
  }, [i18n.language]);

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
        disciplines: disciplineFilter?.map((e: Entry) => e.key),
        categories: categoryFilter?.map((e: Entry) => e.key),
      }}
      toolbar={[
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
        {
          type: GridActionType.MasterData,
          category: MasterData.CompetitionCategory,
          values: categoryFilter,
          onChange: (data: any) => setCategoryFilter(data),
          visible: true,
        },
      ]}
    />
  );
};

export default CompetitionPage;
