import { Grid, Typography, useMediaQuery } from '@mui/material';
import { MainCard, CountryChip } from 'components';
import { t } from 'i18next';
import { ExtendedPointsBreakdown } from '../ExtendedPointsBreakdown';
import { ExtendedJudgeScoring } from '../ExtendedJudgeScoring';
import { ExtendedSingleMetrics } from '../ExtendedSingleMetrics';
import { useResults } from 'hooks';

type Props = {
  data: any;
  countryCode: string;
  title?: string;
  expandable: boolean;
};

export const CompetitorExtendedResult = ({ title, data, countryCode, expandable }: Props) => {
  const { hasExtendedResults } = useResults();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const hasExtendedInformation = hasExtendedResults(data, isMobile);
  if (!data || !hasExtendedInformation.hasExtended) return null;
  return (
    <Grid size={hasExtendedInformation.justFewMetrics ? { xs: 12, md: 6 } : 12}>
      <MainCard
        title={
          <Typography variant="body1">
            {title ? `${title}: ${t('general.extendedInfo')}` : t('general.extendedInfo')}
          </Typography>
        }
        fullHeight
        avatar={<CountryChip code={countryCode} size={'small'} hideTitle={true} />}
        divider={true}
        content={true}
        border={true}
        expandable={expandable}
        expandableOnHeader={expandable}
        defaultExpanded={!expandable}
        sx={{ px: 2 }}
        contentSX={{ px: 0 }}
        headerSX={{ px: 0, py: expandable ? 0.5 : 2, textAlign: 'left' }}
      >
        <ExtendedPointsBreakdown data={data} />
        <ExtendedJudgeScoring data={data} />
        <ExtendedSingleMetrics data={data} />
      </MainCard>
    </Grid>
  );
};
