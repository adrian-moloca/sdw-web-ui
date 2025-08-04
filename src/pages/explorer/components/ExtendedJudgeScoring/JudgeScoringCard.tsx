import { Grid } from '@mui/material';
import { t } from 'i18next';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import { ExtendedCard } from 'components';
import { JudgeScoringTable } from './JudgeScoringTable';

type Props = {
  data: any;
  title?: string;
};
export const JudgeScoringCard = ({ data, title }: Props) => {
  const hasCategories = data.categories && data.categories.length > 0;
  return (
    <>
      <Grid size={12}>
        <ExtendedCard
          titleText={title ? `${t('general.judge-scoring')}: ${title}` : t('general.judge-scoring')}
          icon={GavelOutlinedIcon}
        >
          {hasCategories ? (
            data.categories?.map((category: any) => (
              <JudgeScoringTable key={category.code} data={data} category={category} />
            ))
          ) : (
            <JudgeScoringTable data={data} />
          )}
        </ExtendedCard>
      </Grid>
      {/* <PointsScoringCharts data={flattenedData} discipline={discipline} allKeys={allKeys} /> */}
    </>
  );
};
