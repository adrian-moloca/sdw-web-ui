import Grid from '@mui/material/Grid';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import { Badge } from '@mui/material';
import { t } from 'i18next';
import { MainCard } from 'components';

type Props = {
  data: any;
};

export const ReportViewerControl = (props: Readonly<Props>) => {
  return (
    <Grid size={12}>
      <MainCard
        size="small"
        title={t('common.viewer')}
        expandable={true}
        border={false}
        avatar={
          <Badge color="primary" badgeContent={props.data.deliverables?.length ?? 0} showZero>
            <AssessmentTwoToneIcon />
          </Badge>
        }
        content={props.data.deliverables?.length > 0}
      >
        <Grid container spacing={1}></Grid>
      </MainCard>
    </Grid>
  );
};
