import { Grid, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { camelCaseToWords, formatCompactValue, transformOdfExtensions } from '_helpers';
import {
  BorderedTable,
  DisplayValue,
  OdfExtensionRow,
  OdfTitle,
  StyledSmallCell,
  StyledTableCell,
} from 'components';
import { t } from 'i18next';
import chunk from 'lodash/chunk';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';

export const BuildOdfTablePosition = (param: { data: Array<any>; discipline: string }) => {
  if (!param.data || param.data.length == 0) return null;
  const groupedByPosition = groupBy(param.data, 'pos');
  const uniquePositions = Object.keys(groupedByPosition);
  if (uniquePositions.length > 10) return <OdfTablePositionPlain {...param} />;
  const dataRows = uniqBy(param.data, 'code').map((item: any) => {
    const cells = uniquePositions.map((pos) => {
      const matchingItems = param.data.find((x: any) => x.code == item.code && x.pos == pos);
      const extension = transformOdfExtensions(matchingItems, 'ext');
      return (
        <TableCell key={pos}>
          <Typography variant="body2" component={'span'} sx={{ marginRight: 0.5 }}>
            {formatCompactValue(matchingItems)}
          </Typography>
          {extension?.map((y: any, i: number) => (
            <Typography
              key={y.code ?? `${y.value}-${i}`}
              variant="body2"
              component="span"
              sx={{ marginRight: 0.5 }}
            >
              {OdfTitle(y)} {DisplayValue('', y.value)}
            </Typography>
          ))}
        </TableCell>
      );
    });

    return (
      <TableRow key={item.code}>
        <TableCell>{OdfTitle(item)}</TableCell>
        {cells}
      </TableRow>
    );
  });
  return (
    <Grid size={12}>
      <BorderedTable stickyHeader size={'small'}>
        <TableHead>
          <TableRow>
            <StyledSmallCell />
            {uniquePositions.map((pos) => (
              <StyledSmallCell key={pos}>{pos}</StyledSmallCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{dataRows}</TableBody>
      </BorderedTable>
    </Grid>
  );
};
export const OdfTablePositionPlain = (param: { data: Array<any>; discipline: string }) => {
  if (!param.data || param.data.length == 0) return null;
  const hasAttempt = (source: Array<any>) => source.filter((x: any) => x.attempt).length > 0;
  const hasAvg = (source: Array<any>) => source.filter((x: any) => x.avg).length > 0;
  const hasExt = (source: Array<any>) => source.filter((x: any) => x.ext).length > 0;
  const hasPos = (source: Array<any>) => source.filter((x: any) => x.pos).length > 0;
  const hasField = (source: Array<any>, field: string) =>
    source.filter((x: any) => get(x, field)).length > 0;
  const getOdfTitle = (row: any) => {
    const code = get(row, 'code');
    const title = camelCaseToWords(code);
    return title ?? code;
  };
  return (
    <Grid size={12}>
      <BorderedTable stickyHeader size={'small'}>
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            {hasPos(param.data) && <StyledTableCell>{t('common.position')}</StyledTableCell>}
            <StyledTableCell>{t('general.value')}</StyledTableCell>
            {hasField(param.data, 'percent') && (
              <StyledTableCell>{t('general.percentage')}</StyledTableCell>
            )}
            {hasAvg(param.data) && <StyledTableCell>{t('general.average')}</StyledTableCell>}
            {hasAttempt(param.data) && <StyledTableCell>{t('general.attempt')}</StyledTableCell>}
            {hasExt(param.data) && <StyledTableCell>{t('general.extended')}</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {param.data.map((x: any) => (
            <TableRow key={x.code ?? `${x.value}-${x.pos}`}>
              <TableCell>{getOdfTitle(x)}</TableCell>
              {hasPos(param.data) && <TableCell>{get(x, 'pos')}</TableCell>}
              <TableCell>{get(x, 'value') ?? '-'}</TableCell>
              {hasField(param.data, 'percent') && (
                <TableCell>{get(x, 'percent') ? `${get(x, 'percent')}%` : undefined}</TableCell>
              )}
              {hasAvg(param.data) && <TableCell>{get(x, 'avg')}</TableCell>}
              {hasAttempt(param.data) && <TableCell>{get(x, 'attempt')}</TableCell>}
              {hasExt(param.data) && (
                <TableCell>
                  {transformOdfExtensions(x, 'ext')?.map((y: any) => (
                    <Typography key={y.code} component={'span'} sx={{ marginRight: 1 }}>
                      <span>{getOdfTitle(y)}</span> {DisplayValue('', y.value)}
                    </Typography>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </BorderedTable>
    </Grid>
  );
};

export const OdfTableEmptyPosition = (param: { data: Array<any>; discipline: string }) => {
  if (!param.data || param.data.length == 0) return null;
  if (param.data.length > 8)
    return (
      <>
        {chunk(param.data, 8).map((chunk: any, i: number) => (
          <Grid key={chunk.map((r: any) => r.code).join('-') ?? `chunk-${i}`} size={12}>
            <BorderedTable stickyHeader size={'small'}>
              <TableBody>
                {chunk.map((row: any) => (
                  <OdfExtensionRow
                    key={row.code ?? JSON.stringify(row).slice(0, 30)}
                    row={row}
                    discipline={param.discipline}
                  />
                ))}
              </TableBody>
            </BorderedTable>
          </Grid>
        ))}
      </>
    );
  return (
    <Grid size={12}>
      <BorderedTable stickyHeader size={'small'}>
        <TableBody>
          {param.data.map((row: any) => (
            <OdfExtensionRow
              key={row.code ?? JSON.stringify(row).slice(0, 30)}
              row={row}
              discipline={param.discipline}
            />
          ))}
        </TableBody>
      </BorderedTable>
    </Grid>
  );
};
