import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { setupFilterMode, defaultFilterMode, buildFilter } from '_helpers';
import { FilterMode } from 'types/filters';
import { GridActionType, IConfigProps, ViewType } from 'models';
import { DataGridSelectionPanel } from 'components';
import { useStoreCache, useSecurity } from 'hooks';

type Props = {
  config: IConfigProps;
  data: any;
  onSelectMultiple: (items: Array<any>) => void;
};

export const MergeRequestCandidate = ({ config, data, onSelectMultiple }: Props) => {
  const defaultMode = setupFilterMode({ type: config.type, data });
  const [filterMode, setFilterMode] = useState<FilterMode>(
    defaultFilterMode({ type: config.type, data })
  );

  const { handleMetadata, getMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  return (
    <DataGridSelectionPanel
      config={config}
      id={data.id}
      showHeader={false}
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      query={buildFilter({ type: config.type, data, mode: filterMode }).filters}
      search={buildFilter({ type: config.type, data, mode: filterMode }).search}
      metadata={getMetadata(config.type)}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      toolbarType="default-custom"
      onSelectMultiple={(items: Array<any>) => {
        onSelectMultiple(items);
      }}
      toolbar={[
        {
          type: GridActionType.SwitchButton,
          label: t('general.dob-yod'),
          visible: defaultMode.date,
          onChange: () => setFilterMode({ ...filterMode, date: !filterMode.date }),
          value: filterMode.date,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('common.gender'),
          visible: defaultMode.gender,
          onChange: () => setFilterMode({ ...filterMode, gender: !filterMode.gender }),
          value: filterMode.gender,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('general.discipline'),
          visible: defaultMode.discipline,
          onChange: () => setFilterMode({ ...filterMode, discipline: !filterMode.discipline }),
          value: filterMode.discipline,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('general.country-nationality'),
          visible: defaultMode.country,
          onChange: () => setFilterMode({ ...filterMode, country: !filterMode.country }),
          value: filterMode.country,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('general.full-name'),
          visible: defaultMode.name,
          onChange: () => setFilterMode({ ...filterMode, name: !filterMode.name }),
          value: filterMode.name,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('common.type'),
          visible: defaultMode.type,
          onChange: () => setFilterMode({ ...filterMode, type: !filterMode.type }),
          value: filterMode.type,
        },
        {
          type: GridActionType.SwitchButton,
          label: t('general.event-type'),
          visible: defaultMode.eventType,
          onChange: () => setFilterMode({ ...filterMode, eventType: !filterMode.eventType }),
          value: filterMode.eventType,
        },
      ]}
    />
  );
};
