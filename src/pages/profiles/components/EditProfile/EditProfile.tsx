import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { t } from 'i18next';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { EditionMode, EntityType, IConfigProps } from 'models';
import { MainCard } from 'components';
import {
  EditConsolidationPanel,
  EditMergeConsolidationPanel,
} from 'pages/tools/consolidation/components';
import { useStoreCache } from 'hooks';

type Props = {
  data: any;
  setup: any;
  config: IConfigProps;
  editionMode: EditionMode;
  onClose: () => void;
};

export const EditProfile = ({
  data,
  setup,
  editionMode,
  config,
  onClose,
}: Props): React.ReactElement | null => {
  const { getMetadata } = useStoreCache();
  const metadata = getMetadata(config.type);

  if (editionMode !== EditionMode.Update) return null;
  if (config.type == EntityType.PersonBiography) return null;
  if (config.type == EntityType.HorseBiography) return null;
  if (config.type == EntityType.TeamBiography) return null;
  if (config.type == EntityType.NocBiography) return null;

  return (
    <Grid size={12}>
      <MainCard
        divider={false}
        title={`${t('actions.buttonEdit')} ${data[config.displayAccessor]} Information`}
        secondary={
          <Button
            startIcon={<CancelOutlined />}
            disableElevation
            variant="outlined"
            color="secondary"
            size="small"
            onClick={onClose}
          >
            {t('actions.buttonCancel')}
          </Button>
        }
      >
        {setup.data.enabled === true ? (
          <EditConsolidationPanel
            id={data.id ?? ''}
            name={data.displayName}
            config={config}
            data={data}
            metadata={metadata}
            fieldSetup={setup.data}
            onCallback={onClose}
          />
        ) : (
          <EditMergeConsolidationPanel
            id={data.id ?? ''}
            name={data.displayName}
            config={config}
            data={data}
            metadata={metadata}
            fieldSetup={setup.data}
            onCallback={onClose}
          />
        )}
      </MainCard>
    </Grid>
  );
};
