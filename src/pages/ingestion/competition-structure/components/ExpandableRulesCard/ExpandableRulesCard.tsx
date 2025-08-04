import { useState } from 'react';
import { filterRuleWithCondition } from '../../utils/structure';
import Grid from '@mui/material/Grid';
import {
  Box,
  Button,
  Stack,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import { t } from 'i18next';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { BorderedTable, HeaderTableCell, SearchControl } from 'components';
import { RuleRow } from '../RuleRow';
import { CreateRuleDialog } from '../CreateRuleDialog';
import { DisableRuleDialog } from '../DisableRuleDialog';

type Props = {
  type: string;
  rows: any[];
  data: any;
  disciplineCode: string;
  edition: string;
};

export const ExpandableRulesCard = ({ type, rows, data, disciplineCode, edition }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [search, setSearch] = useState('');

  const searchCondition = (e: any) => e.code.toLowerCase().includes(search.toLowerCase());

  const getFilterCondition = () => {
    if (search) {
      return searchCondition; // Only errors
    }
    return null; // No filtering
  };

  const filterCondition = getFilterCondition();
  const filteredRows = filterCondition ? filterRuleWithCondition(rows, filterCondition) : rows;
  const isRedirect = type.toLowerCase().includes('redirect');
  const isHide = type.toLowerCase().includes('hide');
  const hasExpand = !isRedirect && !isHide;

  return (
    <>
      <Grid container spacing={1} sx={{ mt: 1, px: 1 }}>
        <Grid size={12}>
          <Stack direction="row" alignItems="end" justifyContent="end" spacing={1}>
            <Typography variant="subtitle1">{type}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddCircleOutlineTwoToneIcon />}
            >
              {t('actions.create-rule')}
            </Button>
            {hasExpand && (
              <Button
                variant="outlined"
                color="secondary"
                disabled={rows.length === 0}
                onClick={() => setExpanded(!expanded)}
                startIcon={expanded ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />}
              >
                {expanded ? t('actions.collapse-all') : t('actions.expand-all')}
              </Button>
            )}

            <SearchControl value={search ?? ''} onChange={(e: any) => setSearch(e.target.value)} />
          </Stack>
        </Grid>
        <Grid size={12}>
          <TableContainer component={Box} sx={{ mt: 1 }}>
            <BorderedTable stickyHeader size="small" sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <HeaderTableCell sx={{ width: '1%' }} />
                  <HeaderTableCell>{t('common.code')}</HeaderTableCell>
                  <HeaderTableCell>{t('common.name')}</HeaderTableCell>
                  {isRedirect && <HeaderTableCell>{t('actions.propagate-codes')}</HeaderTableCell>}
                  <HeaderTableCell>{t('common.type')}</HeaderTableCell>
                  <HeaderTableCell>{t('common.level')}</HeaderTableCell>
                  <HeaderTableCell sx={{ width: 80 }}>{t('common.kind')}</HeaderTableCell>
                  <HeaderTableCell sx={{ width: '1%' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((x: any) => (
                  <RuleRow
                    key={x.code}
                    data={x}
                    expanded={expanded}
                    onClick={(e: any) => {
                      setSelectedRule(e);
                      setOpenDisableDialog(true);
                    }}
                  />
                ))}
              </TableBody>
            </BorderedTable>
          </TableContainer>
        </Grid>
      </Grid>
      <CreateRuleDialog
        rows={rows}
        data={data}
        disciplineCode={disciplineCode}
        onClickOk={() => setOpenDialog(!openDialog)}
        onClickCancel={() => setOpenDialog(!openDialog)}
        visible={openDialog}
      />
      <DisableRuleDialog
        data={selectedRule}
        disciplineCode={disciplineCode}
        onClickOk={() => setOpenDisableDialog(!openDisableDialog)}
        onClickCancel={() => setOpenDisableDialog(!openDisableDialog)}
        visible={openDisableDialog && selectedRule != null}
        edition={edition}
      />
    </>
  );
};
