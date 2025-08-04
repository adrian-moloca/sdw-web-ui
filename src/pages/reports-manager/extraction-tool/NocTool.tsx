import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import { BasicPageHeader } from 'layout/page.layout';
import { NocExportPanel } from './modules/NocExportPanel';

const NocExtractionTool = () => {
  return (
    <PageContainer
      maxWidth={false}
      title={t('general.nocs')}
      breadcrumbs={[{ title: t('navigation.Extractions'), path: '/' }]}
      slots={{ header: BasicPageHeader }}
    >
      <NocExportPanel />
    </PageContainer>
  );
};
export default NocExtractionTool;
