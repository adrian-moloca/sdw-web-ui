import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import {
  DisplayEntry,
  EditionMode,
  EntityType,
  Entry,
  GridActionType,
  IWhereProps,
  MasterData,
  QueryExtendFilter,
  ViewType,
} from 'models';
import { drawerActions } from 'store';
import { EmbeddedDataGrid } from 'components';

type Props = {
  type: EntityType;
  form: (dataItem: any, editionMode: EditionMode, onClose: () => void) => any;
  where?: IWhereProps[];
  tags?: QueryExtendFilter;
};

export const ManagerIndexControl = (props: Props) => {
  const { managerSetup } = useStoreCache();
  const dispatch = useDispatch();
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(props.type);

  const [editionFilter, setEditionFilter] = useState<Array<DisplayEntry>>(
    managerSetup.currentEdition
      ? [
          {
            id: managerSetup.currentEdition.id ?? '',
            code: managerSetup.currentEdition.code ?? '',
            title: managerSetup.currentEdition.name ?? '',
          },
        ]
      : []
  );
  const [disciplineFilter, setDisciplineFilter] = useState<Array<Entry>>([]);
  const [categoryFilter, setCategoryFilter] = useState<Array<DisplayEntry>>([]);

  return (
    <EmbeddedDataGrid
      config={config}
      showHeader={false}
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      toolbarType="default"
      onSelect={
        props.type !== EntityType.Report && props.type !== EntityType.DeliveryPlan
          ? (e: any) =>
              dispatch(
                drawerActions.setSelectedItem({
                  item: e,
                  type: props.type,
                  mode: EditionMode.Update,
                })
              )
          : undefined
      }
      onCreate={() =>
        dispatch(
          drawerActions.setSelectedItem({ item: null, type: props.type, mode: EditionMode.Create })
        )
      }
      tags={{
        ...props.tags,
        editionId: editionFilter.length > 0 ? editionFilter[0].id : managerSetup.currentEdition?.id,
        parentId: categoryFilter.length > 0 ? categoryFilter[0].id : null,
        disciplines: disciplineFilter?.map((e: Entry) => e.key),
      }}
      toolbar={[
        {
          type: GridActionType.ManagerData,
          category: EntityType.Edition,
          values: editionFilter,
          onChange: (data: any) => setEditionFilter(data),
          visible:
            props.type == EntityType.ReportCategory || props.type == EntityType.ReportVariation,
        },
        {
          type: GridActionType.MasterData,
          category: MasterData.Discipline,
          values: disciplineFilter,
          onChange: (data: any) => setDisciplineFilter(data),
          visible: props.type == EntityType.ReportVariation || props.type == EntityType.Report,
        },
        {
          type: GridActionType.ManagerData,
          category: EntityType.ReportCategory,
          values: categoryFilter,
          onChange: (data: any) => setCategoryFilter(data),
          visible:
            props.type == EntityType.ReportVariation ||
            props.type == EntityType.Report ||
            props.type == EntityType.DeliveryPlan,
        },
      ]}
      dataSource={getDataSource(config.type)}
    />
  );
};
