import { MainCard } from 'components/cards';
import { JSX } from 'react';
import { DisciplineAvatar } from './DisciplineAvatar';

export const DisciplineCard = (param: { data: any; children?: JSX.Element | JSX.Element[] }) => {
  return (
    <MainCard
      size="small"
      border={false}
      divider={false}
      //contentSX={{ paddingTop: '0.5!important', paddingBottom: '0!important' }}
      content={false}
      avatar={<DisciplineAvatar code={param.data.code} title={param.data.title} size={26} />}
      title={param.data.title}
    >
      {param.children}
    </MainCard>
  );
};
