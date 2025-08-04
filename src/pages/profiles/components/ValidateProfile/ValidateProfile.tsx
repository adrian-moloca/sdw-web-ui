import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import { Button } from '@mui/material';
import { t } from 'i18next';
import { EditionMode, EntityType, IConfigProps } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';
import { MainCard } from 'components';
import { MergeRequestControl, MergeOperation } from 'pages/tools/details/components';

type Props = {
  data: any;
  setup: any;
  config: IConfigProps;
  editionMode: EditionMode;
  onClose: () => void;
};

export const ValidateProfile = (props: Props) => {
  const navigate = useNavigate();
  const { getIndexRoute } = useAppRoutes();

  if (props.editionMode !== EditionMode.Validate) return null;

  return (
    <Grid size={12}>
      <MainCard
        title={t('general.validate-merge-request')}
        secondary={
          <Button
            startIcon={<DoDisturbAltOutlinedIcon />}
            disableElevation
            variant="outlined"
            color="secondary"
            onClick={props.onClose}
          >
            {t('actions.buttonCancel')}
          </Button>
        }
      >
        <MergeRequestControl
          id={props.data.id}
          type={props.config.type}
          onFinish={(operation: MergeOperation) => {
            switch (operation) {
              case 'cancel':
              case 'reject':
              case 'decouple':
                navigate(getIndexRoute(props.config.type));
                break;
              case 'confirm':
                navigate(getIndexRoute(EntityType.MergeRequest));
                break;
              case 'update':
                props.onClose();
                break;
            }
          }}
        />
      </MainCard>
    </Grid>
  );
};
