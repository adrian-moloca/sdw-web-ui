import { useState } from 'react';
import { IPanelTabProps } from 'types/views';
import { isNullOrEmpty } from '_helpers';
import { EntityType, ViewType } from 'models';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { EntryDialog } from 'pages/tools/components';
import { useModelConfig, useSecurity } from 'hooks';

export const EntryDetails = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Entry);

  const [item, setItem] = useState<any>(undefined);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  return (
    <>
      <DataGridPanel
        config={config}
        showHeader={false}
        flags={useSecurity(config.type, ViewType.Index, false).flags}
        toolbarType="search"
        onSelect={(e: any) => {
          setItem(e);
          setOpenUpdateForm(true);
        }}
        dataSource={{
          url: `${appConfig.masterDataEndPoint}${config.apiNode}/${props.parameter.id}`,
          apiVersion: 'master',
          queryKey: `${config.apiNode}${props.parameter.id}`,
        }}
      />
      <EntryDialog
        dataItem={item}
        onClickOk={() => setOpenUpdateForm(false)}
        onClickCancel={() => setOpenUpdateForm(false)}
        visible={openUpdateForm && !isNullOrEmpty(item)}
      />
    </>
  );
};
