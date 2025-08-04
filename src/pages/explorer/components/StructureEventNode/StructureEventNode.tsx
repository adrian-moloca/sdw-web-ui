import { Typography } from '@mui/material';
import { MainCard } from 'components';
import { MasterData } from 'models';
import { useStoreCache } from 'hooks';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: any;
  competitionId: string;
  disciplineId: string;
};

export const StructureEventNode = ({ data, competitionId, disciplineId }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const navigate = useNavigate();
  const baseRoute = `/explorer/competition/${competitionId}#disciplineId="${disciplineId}"&eventId="${data.id}"&target="2"&unitId="${data.id}"`;
  //#disciplineId=%22DSP-4e3749d9-b84f-3eae-9fb1-acbb6e59de5e%22&eventId=%22EVT-1a809066-abf3-3cef-b2df-3ee54f9ddf73%22&target=%222%22&unitId=%22UNT-d2866174-b00b-3a1b-99b0-33cb1f3d53ed%22
  const getEventDetail = (option: any) => {
    if (!option) return '';
    let display = option?.title ?? '';
    if (option.gender) {
      const gender = getMasterDataValue(option.gender, MasterData.SportGender)?.value;
      if (!display.includes(gender)) display = `${display} | ${gender}`;
    }

    if (option.type?.startsWith('ETP-')) {
      const type = getMasterDataValue(option.type, MasterData.EventType)?.value;
      if (!display.includes(type) && !display.includes(type.replace(',', '')))
        display = `${display} (${type})`;
    }

    if (option.type) {
      const type = getMasterDataValue(option.type, MasterData.EventType)?.value;
      if (!display.includes(type) && !display.includes(type.replace(',', '')))
        display = `${display} (${type})`;
    }
    return display;
  };
  return (
    <MainCard
      content={false}
      border={false}
      divider={false}
      size="small"
      title={getEventDetail(data)}
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
