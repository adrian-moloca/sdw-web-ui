import { EntityType, EnumType, useEnums, ViewType } from 'models';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useColorScheme,
  useTheme,
} from '@mui/material';
import { Stack } from '@mui/system';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useModelConfig, useSecurity } from 'hooks';
import { t } from 'i18next';
import sortBy from 'lodash/sortBy';
import { MainCard } from 'components/cards/MainCard';
import { DeleteDialog } from '../DeleteDialog';
import { FieldDisplayRow } from '../FieldDisplayRow';

type Props = {
  data: any;
  onDelete: (id: string) => void;
  onEdit: (dataItem: any) => void;
};

export const FieldDisplay = (props: Props) => {
  const theme = useTheme();
  const { getEnumValueOf } = useEnums();
  const { mode } = useColorScheme();

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];

  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.ReportField);
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);
  const type = getEnumValueOf(props.data.type, EnumType.ContentType);

  const [deleteDialog, setDeleteDialog] = useState(false);

  if (!props.data.fields || props.data.fields.length === 0) return null;

  return (
    <Grid size={12}>
      <MainCard
        size="tiny"
        divider={false}
        title={
          <Stack direction="row" spacing={1} sx={{ fontWeight: 'normal' }} alignItems={'center'}>
            <Chip
              label={`${props.data.order}.2`}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 0 }}
            />
            <Chip
              label={type!.text}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ borderRadius: '10%' }}
            />
          </Stack>
        }
        headerSX={{ py: 1 }}
        border={false}
        contentSX={{ paddingTop: 0, paddingBottom: '10px!important' }}
      >
        <TableContainer sx={{ border: '1px solid lightgray', borderRadius: '10px' }}>
          <Table stickyHeader size="small" aria-label="fields">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '1%', backgroundColor: color }}></TableCell>
                <TableCell sx={{ backgroundColor: color }}>{t('common.name')}</TableCell>
                <TableCell align="center" colSpan={2} sx={{ backgroundColor: color }}>
                  {t('general.columnInfo')}
                </TableCell>
                <TableCell align="center" colSpan={3} sx={{ backgroundColor: color }}>
                  {t('general.field')}
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ backgroundColor: color }}>
                  {t('general.header')}
                </TableCell>
                {canUpdate && <TableCell sx={{ width: '1%', backgroundColor: color }}></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortBy(props.data.fields, 'order').map((row: any) => (
                <FieldDisplayRow
                  key={row.id}
                  row={row}
                  onDelete={props.onDelete}
                  onEdit={props.onEdit}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
      <DeleteDialog
        onClose={() => {
          setDeleteDialog(false);
          props.onDelete(props.data.id);
        }}
        data={props.data}
        type={config.type}
        open={deleteDialog}
      />
    </Grid>
  );
};
