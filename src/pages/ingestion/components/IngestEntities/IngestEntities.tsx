import { Alert } from '@mui/material';
import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import { TableEntity } from '../TableEntity';
import { MainCard } from 'components';

type Props = {
  id: string;
  data?: Array<any>;
};

export const IngestEntities = (props: Props) => {
  const renderTables = () => {
    if (!props.data) return null;

    const grouped_data = groupBy(props.data, 'layer');

    return (
      <MainCard>
        {Object.keys(grouped_data).map((layer) => (
          <TableEntity key={layer} layer={layer} data={grouped_data[layer]} id={props.id} />
        ))}
      </MainCard>
    );
  };
  if (!props.data || props.data.length === 0)
    return (
      <MainCard>
        <Alert severity="info" sx={{ mt: 1 }}>
          {t('message.no-entities-affected-by-this-ingestion')}
        </Alert>
      </MainCard>
    );
  return renderTables();
};
