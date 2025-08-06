import { Grid } from '@mui/material';
import { MatchResults } from './components/MatchResults';
import { competitionUnitIdAtom, isH2HUnitsSet } from './utils';
import { useAtom } from 'jotai';
import orderBy from 'lodash/orderBy';
import { isNullOrEmpty } from '_helpers';
import { UnitCard } from '../UnitCard';
import { MatchHeader } from './components/MatchHeader';

type Props = {
  data: any;
  discipline: string;
  phaseType?: string;
};

/**
 * Renders the navigation and display for competition units within a match.
 *
 * Depending on the structure of the provided data, this component either:
 * - Shows a head-to-head (H2H) match view with a list of match results and a single unit card for the current unit.
 * - Or, displays a list of unit cards for each unit in the ordered data.
 *
 * @param props - The component props.
 * @param props.data - The array of unit data objects to display.
 * @param props.discipline - The discipline associated with the units.
 * @param props.phaseType - The phase type of the competition.
 *
 * @returns The rendered navigation and unit cards for the match.
 */
export const UnitMatchNavigation = ({ data, discipline, phaseType }: Props) => {
  const [unitId] = useAtom(competitionUnitIdAtom);
  const orderedData = orderBy(
    data.filter((x: any) => !isNullOrEmpty(x.competitors)),
    'order'
  );
  if (isH2HUnitsSet(data)) {
    const currentUnit = orderedData?.find((x: any) => x.id === unitId) ?? orderedData[0];
    return (
      <Grid container spacing={2}>
        <MatchHeader match={currentUnit} discipline={discipline} />
        <MatchResults data={orderedData} />
        <Grid size={12}>
          <UnitCard data={currentUnit} discipline={discipline} phaseType={phaseType} />
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={2}>
      {orderedData.map((unit: any, index: number) => (
        <Grid size={12} key={`${unit?.id}${index}`}>
          <UnitCard data={unit} discipline={discipline} phaseType={phaseType} />
        </Grid>
      ))}
    </Grid>
  );
};
