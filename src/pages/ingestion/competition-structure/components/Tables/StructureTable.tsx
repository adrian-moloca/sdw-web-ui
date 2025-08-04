import {
  TableHead,
  TableRow,
  TableBody,
  Box,
  FormControlLabel,
  Stack,
  TableContainer,
  Checkbox,
} from '@mui/material';
import { BorderedTable, HeaderTableCell, SearchControl } from 'components';
import { t } from 'i18next';
import { StructureEventRow } from './StructureEventRow';
import { useState } from 'react';
import { filterEventsWithCondition } from '../../utils/structure';
type Props = {
  data: any;
  rules: Array<any>;
};

export const StructureTable = ({ data, rules }: Props) => {
  const [withWarnings, setWithWarnings] = useState<boolean>(false);
  const [withErrors, setWithErrors] = useState<boolean>(false);
  const [expandedItems] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const warningCondition = (e: any) => e.warning === true;
  const errorCondition = (e: any) => e.error === true;
  const searchCondition = (e: any) =>
    e.code?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase());
  const getFilterCondition = () => {
    if (withWarnings && withErrors) {
      return (e: any) => warningCondition(e) || errorCondition(e); // Both conditions
    }
    if (withWarnings) {
      return warningCondition; // Only warnings
    }
    if (withErrors) {
      return errorCondition; // Only errors
    }
    if (search) {
      return searchCondition; // Only errors
    }
    return null; // No filtering
  };
  const filterCondition = getFilterCondition();
  const filteredRows = filterCondition ? filterEventsWithCondition(data, filterCondition) : data;

  return (
    <TableContainer component={Box}>
      <Stack direction={'row'} spacing={1} sx={{ mb: 1 }}>
        <Box sx={{ flexGrow: 1 }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={withWarnings}
              color="warning"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setWithWarnings(event.target.checked);
              }}
            />
          }
          label="Warnings"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={withErrors}
              color="error"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setWithErrors(event.target.checked);
              }}
            />
          }
          label="Errors"
        />
        <SearchControl value={search ?? ''} onChange={(e: any) => setSearch(e.target.value)} />
      </Stack>
      <BorderedTable stickyHeader size="small" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <HeaderTableCell sx={{ width: '1%' }} />
            <HeaderTableCell sx={{ width: 60 }}>{t('general.order')}</HeaderTableCell>
            <HeaderTableCell>{t('common.code')}</HeaderTableCell>
            <HeaderTableCell>{t('common.name')}</HeaderTableCell>
            <HeaderTableCell>{t('common.gender')}</HeaderTableCell>
            <HeaderTableCell>{t('general.team')}</HeaderTableCell>
            <HeaderTableCell>{t('common.messages')}</HeaderTableCell>
            <HeaderTableCell>{'Seq'}</HeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((x: any) => (
            <StructureEventRow key={x.code} data={x} expandedItems={expandedItems} rules={rules} />
          ))}
        </TableBody>
      </BorderedTable>
    </TableContainer>
  );
};
