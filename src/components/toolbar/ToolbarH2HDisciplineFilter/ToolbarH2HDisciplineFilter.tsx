import { MasterData } from 'models';
import { Props } from '../types';
import { ToolbarMasterFilter } from '../ToolbarMasterFilter';

export function ToolbarH2HDisciplineFilter(props: Readonly<Props>) {
  return (
    <ToolbarMasterFilter
      category={MasterData.Discipline}
      {...props}
      //filters={['SDIS$TKW', 'SDIS$BDM', 'SDIS$BKB', 'SDIS$TEN', 'SDIS$TTE', 'SDIS$VBV', 'SDIS$WRE']}
      added={{ key: 'SDIS$ARC', value: 'Archery' }}
    />
  );
}
