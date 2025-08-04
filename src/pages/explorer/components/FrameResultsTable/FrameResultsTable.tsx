import Grid from '@mui/material/Grid';
import { ExtendedCard } from 'components';
import { t } from 'i18next';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import { FrameResultsTableDisplay } from './FrameResultsTableDisplay';
import uniq from 'lodash/uniq';
import { useState, SetStateAction } from 'react';
import { Select, MenuItem } from '@mui/material';
import { humanize } from '_helpers';
import { FrameResultsCharts } from './FrameResultCharts';
type Props = {
  discipline: string;
  frameTable: any;
  title?: string;
};
export const FrameResultsTable = ({ discipline, frameTable, title }: Props) => {
  if (!frameTable) return null;
  if (!frameTable.pivotTable) return null;

  const uniqueTypes: string[] = uniq(
    frameTable.pivotTable.headers.map((header: any) => String(header.type))
  );
  const [filterType, setFilterType] = useState('ALL');
  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setFilterType(event.target.value);
  };

  return (
    <Grid size={12}>
      <ExtendedCard
        titleText={title ? `${t('general.frame-results')}: ${title}` : t('general.frame-results')}
        icon={WatchOutlinedIcon}
        secondary={
          <>
            {uniqueTypes.length > 1 && (
              <Grid size={12} display={'flex'} justifyContent="end">
                <Select
                  aria-label="Filter by type"
                  id="typeFilter"
                  size="small"
                  value={filterType}
                  onChange={handleChange}
                  sx={{
                    boxShadow: 'none',
                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                  }}
                >
                  <MenuItem value="ALL">{t('general.all')}</MenuItem>
                  {uniqueTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {humanize(type)}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </>
        }
      >
        <Grid container spacing={2}>
          <FrameResultsTableDisplay
            discipline={discipline}
            frameTable={frameTable}
            filterType={filterType}
          />
          <FrameResultsCharts
            frameTable={frameTable}
            filterType={filterType}
            discipline={discipline}
          />
        </Grid>
      </ExtendedCard>
    </Grid>
  );
};
