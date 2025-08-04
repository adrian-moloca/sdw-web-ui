import type { TableProps } from './types';
import React from 'react';
import { Collapse, TableCell, TableRow, Typography } from '@mui/material';
import { DefaultBodyCells } from '../DefaultBodyCells';
import { MedalCell } from '../MedalCell';
import { ScheduledCell } from '../ScheduledCell';
import { MessageCell } from '../MessageCell';
import { RulesBadgeViewer } from '../RulesViewer/RulesBadge';
import { ExpandCell } from '../ExpandCell';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { SubUnitTable } from './SubUnitTable';

export const StructureUnitRow = (props: TableProps) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(props.expandedItems.includes(props.data.code));
  }, [props.expandedItems, props.data.code]);
  const hasSubUnits = props.data.subunits && props.data.subunits.length > 0;
  if (!hasSubUnits)
    return (
      <TableRow sx={{ border: 'none' }}>
        <TableCell />
        <DefaultBodyCells {...props} />
        <TableCell>{props.data.type}</TableCell>
        <MedalCell {...props} />
        <ScheduledCell {...props} />
        <MessageCell {...props} />
        <RulesBadgeViewer {...props} type="unit" />
      </TableRow>
    );
  return (
    <>
      <TableRow sx={{ border: 'none', '& > *': { borderBottom: 'unset' } }}>
        <ExpandCell open={open} setOpen={() => setOpen(!open)} />
        <DefaultBodyCells {...props} />
        <TableCell>
          <Typography variant="body2">{props.data.type}</Typography>
        </TableCell>
        <MedalCell {...props} />
        <ScheduledCell {...props} />
        <MessageCell {...props} />
        <RulesBadgeViewer {...props} type="unit" />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1">{t('general.subunits')}</Typography>
              <SubUnitTable {...props} data={props.data.subunits} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
