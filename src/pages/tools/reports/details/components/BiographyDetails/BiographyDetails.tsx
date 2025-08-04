import { Typography } from '@mui/material';
import { getReportFormat } from '../../utils/getters';
import { renderXmlData } from '../../utils/render-xml';

type Props = {
  data: any;
};

export const BiographyDetails = (props: Props) => {
  const format = getReportFormat(props.data);

  return (
    <>
      {format === 'individual' && (
        <>
          <Typography variant="h4" color="primary">
            Participant Biography
          </Typography>
          {renderXmlData(props.data.OdfBody.Competition.ParticipantBiography)}
        </>
      )}
      {format === 'team' && (
        <>
          <Typography variant="h4" color="primary">
            Team Biography
          </Typography>
          {renderXmlData(props.data.OdfBody.Competition.TeamBiography)}
        </>
      )}
      {format === 'horse' && (
        <>
          <Typography variant="h4" color="primary">
            Horse Biography
          </Typography>
          {renderXmlData(props.data.OdfBody.Competition.HorseBiography)}
        </>
      )}
      {format === 'noc' && (
        <>
          <Typography variant="h4" color="primary">
            NOC Biography
          </Typography>
          {renderXmlData(props.data.OdfBody.Competition.Organisation)}
        </>
      )}
    </>
  );
};
