import { MainCard } from 'components/cards/MainCard';
import { CompetitorBrackets, ScheduleDisplay } from 'pages/explorer/components';

type Props = {
  data: any;
  discipline: string;
};

export const SubunitCard = ({ data, discipline }: Props) => {
  if (!data?.competitors || data?.competitors.length == 0) return null;

  return (
    <MainCard
      size="tiny"
      divider={false}
      border={false}
      content={false}
      sx={{ mb: 1 }}
      headerSX={{ p: 0, mb: 0.5 }}
      secondary={<ScheduleDisplay data={data} inline={true} />}
    >
      <CompetitorBrackets
        discipline={discipline}
        data={data.competitors}
        officials={data.officials}
        frames={data.frames}
      />
    </MainCard>
  );
};
