import {
  Box,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { DisplayEntry } from 'models';
import { BorderedTable, HeaderTableCell, OlympicHeaderTableCell, SearchControl } from 'components';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import get from 'lodash/get';
import { t } from 'i18next';
import { useState } from 'react';
import { humanize } from '_helpers';
import { extractAdditionalInfo } from '../../utils/structure';
import { HeaderTableRow } from '../HeaderTableRow';

type Props = {
  headers?: any;
  data?: any;
  value: DisplayEntry | null;
};

export const HeadersViewer = (props: Readonly<Props>) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const searchCondition = (e: any) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.extendedInfo?.name?.toLowerCase().includes(search.toLowerCase());

  if (props.value === null || props.value?.code === null || !props.headers) {
    return <></>;
  }

  const dataBase = props.data?.find((x: any) => x.code === props.value?.code);
  const extractedInfo = extractAdditionalInfo(dataBase);
  const getExtendedInfo = (code: string) => extractedInfo.find((e: any) => e.code === code);
  const disciplineCode = props.value?.code?.substring(0, 3) ?? '';
  const data = get(props.headers, disciplineCode);
  const filteredKeys = Object.keys(data).filter((key) => key.startsWith(disciplineCode));

  const uniqueMessages = Array.from(new Set(filteredKeys.flatMap((key: any) => data[key])));
  const rows = filteredKeys.map((key: any, index: number) => ({
    id: index,
    name: key,
    extendedInfo: getExtendedInfo(key),
    ...Object.fromEntries(uniqueMessages.map((message) => [message, data[key].includes(message)])),
  }));
  const filteredRows = search ? rows.filter((row) => searchCondition(row)) : rows;

  return (
    <>
      <Stack direction="row" alignItems="end" justifyContent="end" spacing={1} sx={{ my: 1 }}>
        <SearchControl value={search ?? ''} onChange={(e: any) => setSearch(e.target.value)} />
      </Stack>
      <TableContainer component={Box}>
        <BorderedTable stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <HeaderTableCell sx={{ width: 40 }}>{t('general.order')}</HeaderTableCell>
              <HeaderTableCell sx={{ width: 50 }}>{t('common.level')}</HeaderTableCell>
              <HeaderTableCell sx={{ width: 280 }}>{t('common.code')}</HeaderTableCell>
              <HeaderTableCell sx={{ width: 300 }}>{t('common.name')}</HeaderTableCell>
              <HeaderTableCell sx={{ width: 120 }}>{t('common.type')}</HeaderTableCell>
              {uniqueMessages.map((message) => (
                <OlympicHeaderTableCell
                  sx={{ width: 30, textOrientation: 'mixed', writingMode: 'vertical-lr' }}
                  key={message}
                >
                  {message}
                </OlympicHeaderTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <HeaderTableRow key={row.name}>
                <TableCell>{row.extendedInfo?.order}</TableCell>
                <TableCell>{humanize(row.extendedInfo?.level ?? '')}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.extendedInfo?.name}</TableCell>
                <TableCell>{row.extendedInfo?.type}</TableCell>
                {uniqueMessages.map((message) => (
                  <TableCell key={message}>
                    {row[message] ? (
                      <CheckCircle sx={{ color: theme.palette.primary.main }} fontSize="small" />
                    ) : (
                      <CloseIcon sx={{ color: theme.palette.grey[500] }} fontSize="small" />
                    )}
                  </TableCell>
                ))}
              </HeaderTableRow>
            ))}
          </TableBody>
        </BorderedTable>
      </TableContainer>
    </>
  );
};
