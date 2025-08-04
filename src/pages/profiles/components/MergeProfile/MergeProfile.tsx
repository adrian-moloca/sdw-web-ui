import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import DoDisturbAltOutlined from '@mui/icons-material/DoDisturbAltOutlined';
import { EditionMode, EntityType, IConfigProps } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';
import { MergeRequestWizardControl } from 'pages/tools/consolidation/components';
import { MainCard } from 'components';

type Props = {
  data: any;
  setup: any;
  config: IConfigProps;
  editionMode: EditionMode;
  onClose: () => void;
};

export const MergeProfile = (props: Props) => {
  const navigate = useNavigate();
  const { getIndexRoute } = useAppRoutes();

  if (props.editionMode !== EditionMode.Merge) return null;

  return (
    <Grid size={12}>
      <MainCard
        title={t('general.new-merge-request')}
        content={false}
        divider={false}
        headerSX={{ paddingBottom: 0 }}
        size="small"
        secondary={
          <Button
            startIcon={<DoDisturbAltOutlined />}
            disableElevation
            variant="outlined"
            color="secondary"
            size="small"
            onClick={props.onClose}
          >
            {t('actions.buttonCancel')}
          </Button>
        }
      >
        <MergeRequestWizardControl
          id={props.data.id}
          config={props.config}
          onFinish={() => {
            props.onClose();
            navigate(getIndexRoute(EntityType.MergeRequest));
          }}
        />
      </MainCard>
    </Grid>
  );
};
