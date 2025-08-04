import { Typography } from '@mui/material';
import { MainCard } from 'components';
import { getRoundTitle, normalizeTitle } from '../../utils/event-rounds';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useStoreCache } from 'hooks/useStoreCache';
import { MasterData } from 'models';

type Props = {
  data: any;
  competitionId: string;
  disciplineId: string;
  eventId: string;
};
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');
export const StructurePhaseNode = ({ data, competitionId, disciplineId, eventId }: Props) => {
  const navigate = useNavigate();
  const { dataInfo } = useStoreCache();
  const title = getRoundTitle(data, dataInfo[MasterData.RoundType], dataInfo[MasterData.StageType]);
  const baseRoute = `/explorer/competition/${competitionId}/discipline/${disciplineId}/event/${eventId}?category=results&round=${slugify(title)}`;
  return (
    <MainCard
      content={false}
      size="small"
      border={false}
      divider={false}
      title={normalizeTitle(data.title)}
      onClick={() => navigate(baseRoute)}
      subHeader={
        <Typography variant="body2" color="text.secondary" lineHeight={1.1}>
          {dayjs(data.start.date).format(baseConfig.dayDateFormat).toUpperCase()}
          {' - '}
          {dayjs(data.end.date).format(baseConfig.dayDateFormat).toUpperCase()}
        </Typography>
      }
    />
  );
};
