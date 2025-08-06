import { RoundCard } from 'components';
import type { TCardProps } from 'types/explorer';
import {
  CompetitorBrackets,
  CompetitorTable,
  PhaseHeader,
  ScheduleDisplay,
} from 'pages/explorer/components';

export const PhaseCard = ({ data, discipline }: TCardProps) => {
  if (data?.competitors)
    return (
      <RoundCard title={<PhaseHeader data={data} />} secondary={<ScheduleDisplay data={data} />} />
    );

  return (
    <RoundCard
      title={<PhaseHeader data={data} />}
      secondary={<ScheduleDisplay data={data} />}
      transparent={data?.competitors.length === 2}
    >
      {data?.competitors.length > 2 ? (
        <CompetitorTable
          data={data.competitors}
          discipline={discipline}
          officials={data.officials}
        />
      ) : (
        <CompetitorBrackets
          data={data.competitors}
          discipline={discipline}
          officials={data.officials}
          frames={data.frames}
        />
      )}
    </RoundCard>
  );
};
