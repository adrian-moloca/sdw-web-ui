import { Badge } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import RunCircleTwoToneIcon from '@mui/icons-material/RunCircleTwoTone';
import { MainCard } from 'components';
import { ReportExecutionTable } from '../ReportExecutionTable';

type Props = {
  data: any;
};

export const ReportExecutionControl = (props: Props) => {
  return (
    <Grid size={12}>
      <MainCard
        size="small"
        border={false}
        title={t('general.execution-tracking')}
        avatar={
          <Badge color="primary" badgeContent={props.data.executions?.length ?? 0} showZero>
            <RunCircleTwoToneIcon />
          </Badge>
        }
        content={props.data.executions?.length > 0}
        expandable={true}
      >
        <ReportExecutionTable data={props.data} />
      </MainCard>
    </Grid>
  );
};
