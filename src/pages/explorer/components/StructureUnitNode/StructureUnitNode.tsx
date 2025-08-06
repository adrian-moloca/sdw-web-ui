import { Typography } from '@mui/material';
import { MainCard, MedalAvatarMap } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: any;
  competitionId: string;
  disciplineId: string;
  allData: any[];
};

function findMinMaxDates(data: any[]) {
  if (!data || data.length === 0) {
    return { minDate: null, maxDate: null };
  }
  const dayjsObjects = data
    .filter((item) => item.start?.datetime)
    .map((item) => dayjs(item.start?.datetime));
  if (dayjsObjects.length === 0) {
    return { minDate: null, maxDate: null };
  }
  let minDate = dayjsObjects[0];
  let maxDate = dayjsObjects[0];
  for (let i = 1; i < dayjsObjects.length; i++) {
    const currentDayjs = dayjsObjects[i];

    if (currentDayjs.isBefore(minDate)) {
      minDate = currentDayjs;
    }

    if (currentDayjs.isAfter(maxDate)) {
      maxDate = currentDayjs;
    }
  }

  return { minDate, maxDate };
}
export const StructureUnitNode = ({ data, competitionId, disciplineId, allData }: Props) => {
  const navigate = useNavigate();
  const baseRoute = `/explorer/competition/${competitionId}#disciplineId="${disciplineId}"&eventId="${data.id}"&target="2"&unitId="${data.id}"`;
  const isGolden =
    data.title.toLowerCase().includes('gold') || data.title.toLowerCase().includes('big final');
  const isBronze =
    data.title.toLowerCase().includes('bronze') || data.title.toLowerCase().includes('small final');
  const { minDate, maxDate } = findMinMaxDates(allData);
  return (
    <MainCard
      content={false}
      size="small"
      border={false}
      divider={false}
      title={normalizeTitle(data.title)}
      avatar={
        <>
          {isGolden && <>{MedalAvatarMap.golden(26)}</>}
          {isBronze && <>{MedalAvatarMap.bronze(26)}</>}
        </>
      }
      onClick={() => navigate(baseRoute)}
      subHeader={
        <>
          {(minDate || maxDate) && (
            <Typography variant="body2" color="text.secondary" lineHeight={1.1}>
              {dayjs(minDate).format(baseConfig.dayDateFormat).toUpperCase()}
              {' - '}
              {dayjs(maxDate).format(baseConfig.dayDateFormat).toUpperCase()}
            </Typography>
          )}
        </>
      }
    />
  );
};
