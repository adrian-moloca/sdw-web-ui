import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import { BasicPageHeader } from 'layout/page.layout';
import { ParticipationsExportPanel } from './modules/ParticipationsExportPanel';

const ParticipationExtractionTool = () => {
  return (
    <PageContainer
      maxWidth={false}
      title={t('general.olympic-participations')}
      breadcrumbs={[{ title: t('navigation.Extractions'), path: '/' }]}
      slots={{ header: BasicPageHeader }}
    >
      <ParticipationsExportPanel />
    </PageContainer>
  );
};
export default ParticipationExtractionTool;
