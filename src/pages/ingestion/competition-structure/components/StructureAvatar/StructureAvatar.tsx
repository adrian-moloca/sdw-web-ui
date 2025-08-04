import { DisciplineAvatar } from 'components';
import { DisciplineBadge } from '../DisciplineBadge';

type Props = {
  discipline: string;
  value?: number;
};

export const StructureAvatar = (props: Props) => {
  return (
    <DisciplineBadge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      max={999}
      badgeContent={props.value ?? 0}
      color="primary"
      showZero
    >
      <DisciplineAvatar code={props.discipline} size={40} title={''} />
    </DisciplineBadge>
  );
};
