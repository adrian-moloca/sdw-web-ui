import Grid from '@mui/material/Grid';
import { IconButton, useMediaQuery } from '@mui/material';
import Close from '@mui/icons-material/Close';
import get from 'lodash/get';
import { DrawerFormProps } from 'models';
import { MainCard } from 'components/cards/MainCard';
import { FrameResultsTable } from 'pages/explorer/components';
import {
  OdfMiscellaneous,
  OdfSchemaStats,
  OdfStats,
  OrganisationAvatar,
  TableExtendedResults,
} from 'components';
import { useResults } from 'hooks';
import { ParticipantTable } from 'pages/explorer/components/CompetitorTable/ParticipantTable';

const CompetitorDisplay = (props: DrawerFormProps) => {
  const { hasExpandedResultsPanel } = useResults();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const name = get(props.data.data, 'name');
  const extendedInfo = get(props.data.data, 'extendedInfo');
  const hasFrames = props.data.data.frames && props.data.data.frames.length > 0;
  const hasExtendedResults = hasExpandedResultsPanel(props.data.data, isMobile);

  return (
    <MainCard
      title={name}
      border={false}
      sx={{ height: '100%' }}
      contentSX={{ px: 3 }}
      avatar={<OrganisationAvatar data={props.data.data} size="medium" />}
      secondary={
        <IconButton onClick={props.onClose}>
          <Close />
        </IconButton>
      }
    >
      <Grid container spacing={2} size={12}>
        <ParticipantTable data={props.data} discipline={props.data.discipline} />
        <OdfMiscellaneous data={extendedInfo} discipline={props.data.discipline} name={name} />
        {hasExtendedResults && (
          <TableExtendedResults data={props.data.data} discipline={props.data.discipline} />
        )}
        <OdfStats {...props.data} />
        <OdfSchemaStats {...props.data} />
        {hasFrames && (
          <FrameResultsTable
            discipline={props.data.discipline}
            frameTable={props.data.frameTable}
          />
        )}
      </Grid>
    </MainCard>
  );
};

export default CompetitorDisplay;
