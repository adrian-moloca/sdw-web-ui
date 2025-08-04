import get from 'lodash/get';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { MainCard } from 'components';
import { GenericResult } from '../GenericResult';
import { IrmResult } from '../IrmResult';

type Props = {
  data: any;
};

export const ResultDisplay = ({ data }: Props) => {
  if (!data.result) return null;

  const rank = get(data.result, 'rank');
  const value = get(data.result, 'value');
  const valueType = get(data.result, 'valueType');
  const irm = get(data.result, 'irm');
  const played = get(data.result, 'played');
  const won = get(data.result, 'won');
  const lost = get(data.result, 'lost');
  const tied = get(data.result, 'tied');
  const fore = get(data.result, 'for');
  const against = get(data.result, 'against');
  const penalty = get(data.result, 'penalty');
  const diff = get(data.result, 'diff');
  const qualificationMark = get(data.result, 'qualificationMark');

  return (
    <Grid size={12}>
      <MainCard border={true} content={false} sx={{ p: 1 }}>
        {rank && <GenericResult title={t('general.rank')} value={rank} />}
        <IrmResult value={value} valueType={valueType} irm={irm} />
        {qualificationMark && (
          <GenericResult title={t('general.qualificationMark')} value={qualificationMark} />
        )}
        {played && <GenericResult title={t('general.played')} value={played} />}
        {won && <GenericResult title={t('general.won')} value={won} />}
        {lost && <GenericResult title={t('general.lost')} value={lost} />}
        {tied && <GenericResult title={t('general.tied')} value={tied} />}
        {against && <GenericResult title={t('general.against')} value={fore} />}
        {penalty && <GenericResult title={t('general.penalty')} value={penalty} />}
        {diff && <GenericResult title={t('general.diff')} value={diff} />}
      </MainCard>
    </Grid>
  );
};
