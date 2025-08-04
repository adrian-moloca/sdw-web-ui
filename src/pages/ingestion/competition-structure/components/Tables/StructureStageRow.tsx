import { TableRow, TableCell, Collapse, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { DefaultBodyCells } from '../DefaultBodyCells';
import { ExpandCell } from '../ExpandCell';
import { PhaseTable } from './PhaseTable';
import type { TableProps } from './types';

import { RulesBadgeViewer } from '../RulesViewer/RulesBadge';

export const StructureStageRow = (props: TableProps) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(props.expandedItems.includes(`stage_${props.data.code}`));
  }, [props.expandedItems, props.data.code]);

  const hasPhases = props.data.phases && props.data.phases.length > 0;
  return (
    <>
      <TableRow sx={{ borderBottom: 'unset', '& > *': { borderBottom: 'unset' } }}>
        {hasPhases ? <ExpandCell open={open} setOpen={() => setOpen(!open)} /> : <TableCell />}
        <DefaultBodyCells {...props} />
        <TableCell>
          <Typography variant="body2">{props.data.type}</Typography>
        </TableCell>
        <RulesBadgeViewer {...props} type="stage" />
      </TableRow>
      {hasPhases && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ py: 1, marginLeft: 1 }}>
                {hasPhases && (
                  <>
                    <Typography variant="subtitle1">{t('general.phases')}</Typography>{' '}
                    <PhaseTable {...props} data={props.data.phases} />
                  </>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
