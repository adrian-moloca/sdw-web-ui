import Grid from '@mui/material/Grid';
import baseConfig from 'baseConfig';
import { EnumTemplate, GenericLoadingPanel, MainCard } from 'components';
import { EnumType } from 'models';
import { ReportControl } from '../ReportControl';

type Props = {
  data: any;
  isLoading: boolean;
  season: 'summer' | 'winter';
};

export const ReportSeason = (props: Props) => {
  if (props.isLoading) {
    return <GenericLoadingPanel loading={props.isLoading} />;
  }

  return (
    <Grid container spacing={baseConfig.gridSpacing}>
      <Grid size={12}>
        <MainCard
          boxShadow={true}
          border={false}
          size="small"
          subtitle="GDS utilizes an <i>intermediate set of tables</i> as data sources. This tool can assist you in triggering a refresh of the table with the latest data available in SDW."
          divider={false}
          content={false}
          secondary={<EnumTemplate type={EnumType.Season} value={props.season} withText={true} />}
        ></MainCard>
      </Grid>
      {props.data.options
        .filter((e: any) => e.key !== 'ESL' && e.key !== 'H2H')
        .map((e: any) => (
          <ReportControl data={e} key={e.key} season={props.season} />
        ))}
    </Grid>
  );
};
