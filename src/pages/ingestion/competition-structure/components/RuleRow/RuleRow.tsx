import { Collapse, Stack, TableCell, Typography } from '@mui/material';
import { EnumTemplate } from 'components';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { EnumType } from 'models';
import { humanize } from '_helpers';
import type { RuleProps } from 'types/ingestion';
import {
  MovePhasesTable,
  MoveSubunitTable,
  MessageRedirectTable,
  ExpandCell,
  DisableRuleCell,
  HeaderTableRow,
} from 'pages/ingestion/competition-structure/components';

export const RuleRow = (props: RuleProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.expanded);
  }, [props.expanded]);

  const hasMovePhases = props.data.movePhases && props.data.movePhases.length > 0;
  const hasMoveSubunits = props.data.moveSubunits && props.data.moveSubunits.length > 0;
  const hasMessageRedirects = props.data.messageRedirects && props.data.messageRedirects.length > 0;
  const hasChildren = hasMovePhases || hasMoveSubunits || hasMessageRedirects;
  const isRedirect = props.data.displayName.includes('redirect');

  return (
    <>
      <HeaderTableRow
        sx={
          hasChildren
            ? { border: 'none', borderBottom: 'unset', '& > *': { borderBottom: 'unset' } }
            : undefined
        }
      >
        {hasChildren ? <ExpandCell open={open} setOpen={() => setOpen(!open)} /> : <TableCell />}
        <TableCell component="th" scope="row">
          {props.data.code}
        </TableCell>

        <TableCell>{props.data.extendedInfo?.name}</TableCell>
        {isRedirect && (
          <TableCell>
            {props.data.propagateToCodes?.map((code: string) => (
              <Typography key={code}>{code}</Typography>
            ))}
          </TableCell>
        )}
        <TableCell>{humanize(props.data.type)}</TableCell>
        <TableCell>{humanize(props.data.level)}</TableCell>
        <TableCell>
          <EnumTemplate type={EnumType.RuleMode} value={props.data.kind} withText={true} />
        </TableCell>
        <DisableRuleCell rule={props.data} onClick={props.onClick} />
      </HeaderTableRow>
      {hasChildren && (
        <HeaderTableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Grid container spacing={2} sx={{ py: 1, marginLeft: 2 }}>
                {hasMovePhases && (
                  <Grid size={12}>
                    <Stack>
                      <Typography variant="subtitle1">
                        {props.data.movePhases[0].displayName}
                      </Typography>
                      <MovePhasesTable {...props} data={props.data.movePhases} />
                    </Stack>
                  </Grid>
                )}
                {hasMoveSubunits && (
                  <Grid size={12}>
                    <Stack>
                      <Typography>{props.data.moveSubunits[0].displayName}</Typography>
                      <MoveSubunitTable {...props} data={props.data.moveSubunits} />
                    </Stack>
                  </Grid>
                )}
                {hasMessageRedirects && (
                  <Grid size={12}>
                    <Stack>
                      <Typography variant="subtitle1">
                        {props.data.messageRedirects[0].displayName}
                      </Typography>
                      <MessageRedirectTable {...props} data={props.data.messageRedirects} />
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Collapse>
          </TableCell>
        </HeaderTableRow>
      )}
    </>
  );
};
