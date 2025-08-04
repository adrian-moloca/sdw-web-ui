import {
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  useTheme,
  Box,
  TextField,
  Toolbar,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
} from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Stack } from '@mui/system';
import Circle from '@mui/icons-material/Circle';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import get from 'lodash/get';
import sortedUniq from 'lodash/sortedUniq';
import { Link as RouteLink } from 'react-router-dom';
import { areAllElementsEqual, areAllElementsEqualTo, isAtLeastOneElementEqualTo } from '_helpers';
import { EntityType, ExcludedFields, IConfigProps } from 'models';
import { BorderedTable, StyledTableCell } from 'components';
import { useAppModel, useStoreCache } from 'hooks';

type Props = {
  config: IConfigProps;
  data: Array<any>;
  weights: any;
  hiddenFields: any;
  onChangeWeight: (id: string, weight: number) => void;
  onAddHidden: (id: string, field: string) => void;
  onRemoveHidden: (id: string, field: string) => void;
};
export const MergeRequestComparison = ({
  config,
  data,
  weights,
  hiddenFields,
  onChangeWeight,
  onAddHidden,
  onRemoveHidden,
}: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const theme = useTheme();

  const { formatEditField } = useAppModel();
  const { handleMetadata, getMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  const metaData = getMetadata(config.type);

  const ValidateConflictStatus = (field: string) => {
    const fieldValues = data.map((e: any) => get(e, field) ?? '-');

    if (areAllElementsEqualTo(fieldValues, '-'))
      return <Circle sx={{ color: theme.palette.info.main, fontSize: '12px' }} />;

    if (areAllElementsEqual(fieldValues))
      return <Circle sx={{ color: theme.palette.success.main, fontSize: '12px' }} />;

    if (isAtLeastOneElementEqualTo(fieldValues, '-'))
      return <Circle sx={{ color: theme.palette.success.main, fontSize: '12px' }} />;

    return <Circle sx={{ color: theme.palette.warning.main, fontSize: '12px' }} />;
  };

  const hasNonEmptyRecords = (field: string) => {
    return data.some((record: any) => get(record, field));
  };

  const isHiddenField = (id: string, field: string) => {
    if (hiddenFields[id]) {
      return hiddenFields[id].includes(field);
    }

    return false;
  };

  let sortedOtherFields = sortedUniq(Object.keys(metaData ?? data).filter((e) => e !== 'id'));
  if (config.type === EntityType.Person && metaData)
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'PERSON'
    );

  if (config.type === EntityType.Horse && metaData)
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'HORSE'
    );

  if (!showAll) sortedOtherFields = sortedOtherFields.filter((e) => hasNonEmptyRecords(e));

  return (
    <>
      <TableContainer component={Box}>
        <BorderedTable size="small" sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            <TableRow sx={{ borderBottom: 'unset' }}>
              <TableCell sx={{ width: 20, borderBottom: 'unset' }}></TableCell>
              <TableCell
                scope="row"
                sx={{
                  fontFamily: 'Olympic Headline',
                  fontSize: '1.5rem',
                  width: 160,
                  borderBottom: 'unset',
                }}
              >
                {t('general.weight')}
              </TableCell>
              {data.map((record: any, i: number) => (
                <TableCell key={`${i}_wid`} sx={{ borderBottom: 'unset', width: 200 }}>
                  <TextField
                    type="number"
                    margin="dense"
                    size="small"
                    value={get(weights, record.id)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeWeight(
                        record.id,
                        !event.target.value ? 0 : parseInt(event.target.value)
                      );
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </BorderedTable>
      </TableContainer>
      <TableContainer component={Box}>
        <BorderedTable stickyHeader sx={{ minWidth: 300, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 20 }}></StyledTableCell>
              <StyledTableCell sx={{ width: 160 }}>{t('common.field')}</StyledTableCell>
              {data.map((e: any) => (
                <StyledTableCell sx={{ width: 200 }} key={`${e.id}_header`}>
                  {e.sources.join(', ')}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell scope="row">{t('general.internalId')}</TableCell>
              {data.map((record: any, i: number) => (
                <TableCell key={`${i}_id`}>
                  <RouteLink
                    to={`/${config.path}/${get(record, 'id')}`}
                    target="noopener noreferrer"
                  >
                    {get(record, 'id') ?? '-'}
                  </RouteLink>
                </TableCell>
              ))}
            </TableRow>
            {sortedOtherFields.map((field: any) => (
              <TableRow key={field}>
                <TableCell align="center">{ValidateConflictStatus(field)}</TableCell>
                <TableCell scope="row">{get(metaData, field)?.displayName ?? field}</TableCell>
                {data.map((record: any, i: number) => {
                  const isHidden = isHiddenField(get(record, 'id'), field);
                  const isReadOnly = ExcludedFields.includes(field);
                  return (
                    <TableCell key={`${i}_other`}>
                      <Stack direction={'row'} sx={{ alignItems: 'center' }}>
                        <IconButton
                          color={isHidden ? 'warning' : 'secondary'}
                          size="small"
                          sx={{ marginRight: '3px', p: 0 }}
                          disabled={isReadOnly}
                          onClick={() =>
                            isHidden
                              ? onRemoveHidden(get(record, 'id'), field)
                              : onAddHidden(get(record, 'id'), field)
                          }
                        >
                          {isReadOnly ? (
                            <LockOutlinedIcon fontSize="small" />
                          ) : isHidden ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                        {formatEditField(field, get(record, field), metaData)}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </BorderedTable>
        <Toolbar sx={{ p: 0 }}>
          <Box sx={{ flexGrow: 1 }} />
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={showAll} onChange={() => setShowAll(!showAll)} />}
              label={
                showAll ? t('message.show-just-non-empty-fields') : t('message.show-all-fields')
              }
            />
          </FormGroup>
        </Toolbar>
      </TableContainer>
    </>
  );
};
