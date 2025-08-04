import { TableRow, TableCell, Collapse, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { t } from 'i18next';
import React from 'react';
import { BooleanCell } from '../BooleanCell';
import { DefaultBodyCells } from '../DefaultBodyCells';
import { ExpandCell } from '../ExpandCell';
import { GenderCell } from '../GenderCell';
import { MessageCell } from '../MessageCell';
import { TeamCell } from '../TeamCell';
import { StageTable } from './StageTable';
import { PhaseTable } from './PhaseTable';
import type { TableProps } from './types';

export function StructureEventRow(props: Readonly<TableProps>) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(props.expandedItems.includes(props.data.code));
  }, [props.expandedItems, props.data.code]);

  const hasStages = props.data.stages && props.data.stages.length > 0;
  const hasPhases = props.data.phases && props.data.phases.length > 0;
  return (
    <>
      <TableRow sx={{ border: 'none', borderBottom: 'unset', '& > *': { borderBottom: 'unset' } }}>
        <ExpandCell open={open} setOpen={() => setOpen(!open)} />
        <DefaultBodyCells {...props} />
        <GenderCell {...props} />
        <TeamCell {...props} />
        <MessageCell {...props} />
        <BooleanCell value={props.data.seq} />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 1, marginLeft: 1 }}>
              {hasStages && (
                <>
                  <Typography variant="subtitle1">{t('general.stages')}</Typography>
                  <StageTable {...props} data={props.data.stages} />
                </>
              )}
              {hasPhases && (
                <>
                  <Typography variant="subtitle1">{t('general.phases')}</Typography>
                  <PhaseTable {...props} data={props.data.phases} />
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
