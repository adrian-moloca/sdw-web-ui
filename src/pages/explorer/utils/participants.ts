import type { IPanelTabProps } from 'types/views';
import { EntityType, SearchQuery } from 'models';
import { getFilterPart } from '_helpers';

export const buildFilter = (props: Readonly<IPanelTabProps>): SearchQuery => {
  if (props.parameter.type === EntityType.Competition) {
    return {
      where: [],
      join: [
        {
          table: { name: 'discipline', column: 'id', alias: 'dsp' },
          reference: { name: 'participant', column: 'discipline_id', alias: 'ptc' },
          where: [{ column: 'competition_id', value: props.parameter.id }],
        },
      ],
      operator: 'AND',
    };
  }
  return {
    where: [{ column: getFilterPart(props.parameter.id), value: props.parameter.id }],
    operator: 'AND',
  };
};
