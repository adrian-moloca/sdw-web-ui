import { useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntityType, Entry, GridActionType, MasterData, ViewType } from 'models';
import { useModelConfig, usePersistedState, useSecurity } from 'hooks';
import { formatMasterCode } from '_helpers';

const HeadToHeadPage = () => {
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.HeadToHead);

  const [countryFilter, setCountryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_country`
  );
  const [disciplineFilter, setDisciplineFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_discipline`
  );
  const [categoryFilter, setCategoryFilter] = usePersistedState<Array<Entry>>(
    [],
    `${config.entityName}${appConfig.forgeRockRealm}_category`
  );

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      tags={{
        countries: countryFilter?.map((e: Entry) => formatMasterCode(e.key)),
        disciplines: disciplineFilter?.map((e: Entry) => {
          let modifiedKey = formatMasterCode(e.key);
          if (modifiedKey.startsWith('ARC-')) {
            modifiedKey = modifiedKey.replace(/^ARC-.*/, 'ARC');
          }
          return modifiedKey;
        }),
        categories: categoryFilter?.map((e: string) => e),
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
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      onSelect={(row: any) =>
        navigate(
          `/${config.path}/${get(row, 'disciplineCode')}|${get(row, 'opponent1.id')}|${get(row, 'opponent2.id')}|${get(row, 'eventGender')}`
        )
      }
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};

export default HeadToHeadPage;
