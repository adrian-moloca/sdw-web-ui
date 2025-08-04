import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { Badge } from '@mui/material';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { MainCard } from 'components';
import { EntityType } from 'models';
import { DeliveryReportsTable } from '../DeliveryReportsTable';
import { ReportDeliveriesTable } from '../ReportDeliveriesTable';

type Props = {
  data: any;
  type: EntityType;
};

export const ReportDeliveryControl = (props: Props) => {
  const hasDeliverables = props.data.deliverables && props.data.deliverables?.length > 0;

  return (
    <Grid size={12}>
      <MainCard
        size="small"
        border={false}
        title={t('general.delivery-tracking')}
        avatar={
          <Badge color="primary" badgeContent={props.data.deliverables?.length ?? 0} showZero>
            <CalendarMonthTwoToneIcon />
          </Badge>
        }
        expandable={true}
        content={hasDeliverables}
      >
        {hasDeliverables && (
          <Grid container spacing={1}>
            {props.type === EntityType.DeliveryPlan && <DeliveryReportsTable data={props.data} />}
            {props.type === EntityType.Report && <ReportDeliveriesTable data={props.data} />}
          </Grid>
        )}
      </MainCard>
    </Grid>
  );
};
