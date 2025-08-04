import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import { useSecurityProfile, useStoreCache } from 'hooks';
import { useAtom } from 'jotai';
import { EntityType, MenuFlagEnum, EditionMode } from 'models';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { atomWithHash } from 'jotai-location';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { BasicPageHeader } from 'layout/page.layout';
import { GeneralSetup, ManagerIndexControl, MetadataSetup } from '../components';
import type { MenuProps } from 'types/reports-manager';
import EditionForm from 'pages/reports-manager/forms/EditionForm';
import DeliverDataScopeForm from 'pages/reports-manager/forms/DeliverDataScopeForm';
import { ButtonTabPrimary } from 'components';

const locationAtom = atomWithHash<MenuProps>(
  'page',
  { type: undefined, id: undefined },
  {
    serialize: ({ type, id }) => {
      const parts = [];
      if (type !== null && type !== undefined) {
        parts.push(`type=${EntityType[type]}`); // Manually concatenate enum to string
      }
      if (id) parts.push(`id=${id}`);
      return parts.length > 0 ? parts.join('&') : '';
    },
    deserialize: (value) => {
      const params = value.split('&').reduce(
        (acc, pair) => {
          const [key, val] = pair.split('=');
          acc[key] = val;
          return acc;
        },
        {} as Record<string, string>
      );
      const typeString = params.type;
      const type =
        typeString !== null ? ((EntityType as any)[typeString] as EntityType) : undefined;
      const id = params.id || undefined;
      return { type, id };
    },
  }
);

const ReportsSettings = () => {
  const location = useLocation();
  const { checkPermission } = useSecurityProfile();
  const { managerSetup, handleManagerSetup, handleDataInfo, handleMetadata } = useStoreCache();
  const [state, setState] = useAtom(locationAtom);

  useEffect(() => {
    const setupData = async () => {
      await handleManagerSetup();
      await handleDataInfo();
      await handleMetadata(EntityType.Edition);
      checkPermission(MenuFlagEnum.ReportsSetup);
    };

    setupData();
  }, []);

  const [value, setValue] = useState('2');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <PageContainer
      maxWidth={false}
      title={managerSetup.currentEdition?.name}
      breadcrumbs={[
        { title: t('navigation.ReportsManager') },
        { title: t('navigation.ReportSetup'), path: location.pathname },
      ]}
      slots={{ header: BasicPageHeader }}
    >
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
        >
          <ButtonTabPrimary value="1" label={t('general.editions')} />
          <ButtonTabPrimary value="2" label={t('general.delivery-data-scope')} />
          <ButtonTabPrimary value="3" label={t('general.reportCategories')} />
          <ButtonTabPrimary value="4" label={t('general.reportVariations')} />
          <ButtonTabPrimary value="5" label={t('general.metadata')} />
          <ButtonTabPrimary value="6" label={t('general.generalSetup')} />
          <ButtonTabPrimary value="7" label={t('general.reportSources')} />
          <ButtonTabPrimary value="8" label={t('general.biographyQuota')} />
        </TabList>
        <TabPanel value="1" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.Edition}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <EditionForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.DeliveryDataScope}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <DeliverDataScopeForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.ReportCategory}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <EditionForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
        <TabPanel value="4" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.ReportVariation}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <EditionForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
        <TabPanel value="5" sx={{ px: 0, py: 1, mt: 1 }}>
          <MetadataSetup />
        </TabPanel>
        <TabPanel value="6" sx={{ px: 0, py: 1, mt: 1 }}>
          <GeneralSetup onClose={() => setState({ type: undefined, id: undefined })} />
        </TabPanel>
        <TabPanel value="7" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.ReportSource}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <EditionForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
        <TabPanel value="8" sx={{ px: 0, py: 1, mt: 1 }}>
          <ManagerIndexControl
            type={EntityType.BiographyQuota}
            form={(data: any, editionMode: EditionMode, onClose: () => void) => (
              <EditionForm
                data={data}
                type={state.type!}
                editionMode={editionMode}
                onClose={onClose}
              />
            )}
          />
        </TabPanel>
      </TabContext>
    </PageContainer>
  );
};

export default ReportsSettings;
