import Grid from '@mui/material/Grid';
import { Divider, IconButton, Typography } from '@mui/material';
import Close from '@mui/icons-material/Close';
import get from 'lodash/get';
import { t } from 'i18next';
import { DrawerFormProps } from 'models';
import { MainCard } from 'components/cards/MainCard';
import { OfficialsDisplay } from 'pages/explorer/components';
import { ResultDisplay } from '../ResultDisplay';
import { OdfTable, OrganisationAvatar } from 'components';

const CompetitorUsdfDisplay = ({ data, onClose }: DrawerFormProps) => {
  const name = get(data.data, 'name');
  const participantNames = get(data.data, 'athletes')?.map((x: any) => x.participationName);
  const misc = get(data.data, 'extensions.odfExtensions.miscellaneous');
  const stats = get(data.data, 'extensions.odfExtensions.stats');

  return (
    <MainCard
      title={name}
      border={false}
      sx={{ height: '100%' }}
      contentSX={{ px: 3 }}
      avatar={<OrganisationAvatar data={data.data} size="medium" />}
      secondary={
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      }
    >
      <Grid container spacing={2} size={12}>
        <ResultDisplay data={data.data} />
        {participantNames && (
          <Grid size={12}>
            <Typography variant="body1" fontWeight="bold">
              {t('general.team-members')}
            </Typography>
            {participantNames.map((e: string, index: number) => (
              <Typography key={e} variant="body1">{`${index + 1}. ${e}`}</Typography>
            ))}
          </Grid>
        )}
        <OfficialsDisplay data={data.data} />
        {(misc || stats) && (
          <Grid size={12}>
            <Typography variant="body1" fontWeight="bold">
              {t('general.extendedInfo')}
            </Typography>
            <OdfTable
              data={get(data.data, 'extensions.odfExtensions.miscellaneous')}
              discipline={data.discipline}
            />
            <Divider sx={{ my: 1 }} />
            <OdfTable
              data={get(data.data, 'extensions.odfExtensions.stats')}
              discipline={data.discipline}
            />
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

export default CompetitorUsdfDisplay;
