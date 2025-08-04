import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ViewPanel } from 'components';
import { ActionType, EntityType, MenuFlagEnum } from 'models';
import { ParticipantsTab } from 'pages/explorer/tabs/ParticipantsTab';
import { DisciplineEventsResultsTab } from '../tabs/DisciplineEventsResultsTab';
import { HideShowDialog } from 'pages/tools/consolidation/components';
import { DisciplineEventsTab } from '../tabs/DisciplineEventsTab';
import { isNullOrEmpty } from '_helpers';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';

const DisciplineDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Discipline);
  const { checkPermission, hasPermission } = useSecurityProfile();
  const [openHide, setOpenHide] = useState(false);
  const [item, setItem] = useState<any>(undefined);
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    handleMetadata(EntityType.Event);
    handleMetadata(EntityType.Phase);
    handleMetadata(EntityType.Unit);
    handleMetadata(EntityType.Participant);
    handleMetadata(EntityType.Official);
    handleMetadata(EntityType.Result);
    handleMetadata(EntityType.Record);
    handleMetadata(EntityType.Award);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  const handleHideShow = (dataItem: any) => {
    setOpenHide(true);
    setItem(dataItem);
  };

  return (
    <>
      <ViewPanel
        config={config}
        expandInfo={false}
        metadata={getMetadata(config.type)}
        toolbar={[
          {
            type: ActionType.Disable,
            title: t('actions.buttonHideShowEntity'),
            handleClick: handleHideShow,
            condition: () => hasPermission(MenuFlagEnum.Consolidation),
          },
        ]}
        displayBoxes={[]}
        tabs={[
          { title: t('general.events'), component: DisciplineEventsTab },
          { title: t('general.eventsResults'), component: DisciplineEventsResultsTab },
          { title: t('general.participants'), component: ParticipantsTab },
        ]}
      />
      <HideShowDialog
        dataItem={item}
        config={config}
        onClickOk={() => setOpenHide(false)}
        onClickCancel={() => setOpenHide(false)}
        visible={openHide && !isNullOrEmpty(item)}
        operation="HIDE"
      />
    </>
  );
};

export default DisciplineDetailsPage;
