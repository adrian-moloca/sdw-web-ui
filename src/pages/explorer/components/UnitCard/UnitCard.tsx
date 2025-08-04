import { RoundCard } from 'components';
import { useResults } from 'hooks/useResults';
import uniqBy from 'lodash/uniqBy';
import {
  CompetitorBrackets,
  CompetitorTable,
  getScheduleDate,
  ScheduleStatusChip,
  UnitHeader,
  UnitSubUnits,
} from 'pages/explorer/components';

type Props = {
  data: any;
  discipline: string;
  phaseType?: string;
};

export const UnitCard = ({ data, discipline, phaseType }: Props) => {
  const { supportsBrackets } = useResults();
  const hasSubunits = data?.subunits && data.subunits.length > 0;
  const hasCompetitors = data?.competitors && data.competitors.length > 0;
  const formatCompetitors = uniqBy(data?.competitors ? data.competitors : [], 'id');
  const noCompetitors = formatCompetitors?.length;
  if (!hasCompetitors && !hasSubunits) return null;
  if (hasSubunits && !hasCompetitors) {
    return <UnitSubUnits data={data.subunits} discipline={discipline} />;
  }
  if (noCompetitors > 2 || !supportsBrackets(discipline)) {
    return (
      <RoundCard
        title={<UnitHeader data={data} phaseType={phaseType} />}
        secondary={<ScheduleStatusChip data={data} />}
      >
        <CompetitorTable
          discipline={discipline}
          data={formatCompetitors}
          officials={data.officials}
        />
        {hasSubunits && <UnitSubUnits data={data.subunits} discipline={discipline} />}
      </RoundCard>
    );
  }

  return (
    <RoundCard title={getScheduleDate(data)} secondary={<ScheduleStatusChip data={data} />}>
      <CompetitorBrackets
        roundData={data}
        discipline={discipline}
        data={formatCompetitors}
        frames={data.frames}
        officials={data.officials}
      />
      {hasSubunits && <UnitSubUnits data={data.subunits} discipline={discipline} />}
    </RoundCard>
  );
};
