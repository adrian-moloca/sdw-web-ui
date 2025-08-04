import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { t } from 'i18next';
import { MergeRequestWizard } from 'pages/tools/consolidation/components';
import { EntityType } from 'models';
import { useModelConfig } from 'hooks';

const InitMergeRequestPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const { getConfig } = useModelConfig();
  const navigate = useNavigate();

  if (type && Object.values(EntityType).includes(type)) {
    return (
      <Alert
        action={
          <Button color="inherit" size="small" onClick={() => navigate(-1)}>
            {t('actions.buttonBack')}
          </Button>
        }
      >
        {t('common.dialogs.messageMissingParameters')}
      </Alert>
    );
  }

  const entityType: EntityType = type ? (parseInt(type) as EntityType) : EntityType.Person;

  return <MergeRequestWizard id={id ?? ''} config={getConfig(entityType)} />;
};

export default InitMergeRequestPage;
