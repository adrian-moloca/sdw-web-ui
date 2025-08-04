import type { TableProps } from './types';
import React from 'react';
import { Collapse, TableCell, TableRow, Typography } from '@mui/material';
import { ExpandCell } from '../ExpandCell';
import { DefaultBodyCells } from '../DefaultBodyCells';
import { MedalCell } from '../MedalCell';
import { ScheduledCell } from '../ScheduledCell';
import { MessageCell } from '../MessageCell';
import { RulesBadgeViewer } from '../RulesViewer/RulesBadge';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { UnitTable } from './UnitTable';

export const StructurePhaseRow = (props: TableProps) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(props.expandedItems.includes(props.data.code));
  }, [props.expandedItems, props.data.code]);
  const hasUnits = props.data.units && props.data.units.length > 0;
  return (
    <>
      <TableRow sx={{ border: 'none', '& > *': { borderBottom: 'unset' } }}>
        {hasUnits ? <ExpandCell open={open} setOpen={() => setOpen(!open)} /> : <TableCell />}
        <DefaultBodyCells {...props} />
        <TableCell>
          <Typography variant="body2"> {props.data.round}</Typography>
        </TableCell>
        <MedalCell {...props} />
        <ScheduledCell {...props} />
        <MessageCell {...props} />
        <RulesBadgeViewer type={'phase'} {...props} />
      </TableRow>
      {hasUnits && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ py: 1, marginLeft: 1 }}>
                <Typography variant="subtitle1">{t('general.units')}</Typography>
                <UnitTable {...props} data={props.data.units} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
