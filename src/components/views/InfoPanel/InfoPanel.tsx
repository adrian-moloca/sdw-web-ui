import { Alert, Box } from '@mui/material';
import { EntityType, IConfigProps, MetadataModel } from 'models';

import { t } from 'i18next';
import { ValidInfoEntities } from 'constants/views';
import { hasInfo } from 'utils/views';
import { BiographyBlock } from '../BiographyBlock';
import { CompetitionInfo, GenericInfo, OrganizationInfo, VenueInfo } from 'components';

type Props = { data: any; config: IConfigProps; metadata?: { [key: string]: MetadataModel } };

export const InfoPanel = (props: Props) => {
  if (!ValidInfoEntities.includes(props.config.type)) return null;
  if (!hasInfo(props.data, props.config))
    return <Alert severity="info">No additional information available</Alert>;

  if (props.config.type === EntityType.Person || props.config.type === EntityType.Horse)
    return (
      <Box sx={{ px: 2 }}>
        <BiographyBlock data={props.data} metadata={props.metadata} field={'clubName'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'coach'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'generalBiography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'summary'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'startedCompeting'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'officialBiography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'officialAppointment'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'coachingBiography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'family'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'education'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'occupation'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'ambition'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'hero'} />
        <BiographyBlock
          data={props.data}
          metadata={props.metadata}
          field={'memorableAchievement'}
        />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'milestones'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'injuries'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'hobbies'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'competingBiography'} />
        <GenericInfo data={props.data} />
      </Box>
    );
  else if (props.config.type === EntityType.Team)
    return (
      <Box sx={{ px: 2 }}>
        <BiographyBlock data={props.data} metadata={props.metadata} field={'generalBiography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'competingBiography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'biography'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'training'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'summary'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'awards'} />
        <GenericInfo data={props.data} />
      </Box>
    );
  else if (props.config.type === EntityType.Organization)
    return (
      <Box sx={{ px: 2 }}>
        <OrganizationInfo data={props.data} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'generalBiography'} />
        <BiographyBlock
          data={props.data}
          metadata={props.metadata}
          field={'summary'}
          title="Summary"
        />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'competingBiography'} />
        <GenericInfo data={props.data} />
      </Box>
    );
  else if (props.config.type === EntityType.Competition)
    return (
      <Box sx={{ px: 2 }}>
        <BiographyBlock data={props.data} metadata={props.metadata} field={'contact'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'information'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'mediaInformation'} />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'travelInformation'} />
        <CompetitionInfo data={props.data} />
      </Box>
    );
  else if (props.config.type === EntityType.Event)
    return (
      <Box sx={{ px: 2 }}>
        <BiographyBlock
          data={props.data}
          metadata={props.metadata}
          field={'extendedInfo.summary'}
          title={t('general.summary')}
        />
        <BiographyBlock data={props.data} metadata={props.metadata} field={'special'} />
        <GenericInfo data={props.data} />
      </Box>
    );
  else if (props.config.type === EntityType.Venue)
    return (
      <Box sx={{ px: 2 }}>
        <VenueInfo data={props.data} />
        <BiographyBlock
          data={props.data}
          metadata={props.metadata}
          field={'extendedInfo.summary'}
        />
      </Box>
    );
  return <Alert severity="info">No additional information available</Alert>;
};
