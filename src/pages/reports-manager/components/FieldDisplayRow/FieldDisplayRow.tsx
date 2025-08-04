import { ButtonGroup, IconButton, TableCell, TableRow } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useState } from 'react';
import { EntityType, EnumType, IEnumProps, useEnums, ViewType } from 'models';
import { DeleteDialog } from '../DeleteDialog';
import { useModelConfig, useSecurity } from 'hooks';

type Props = {
  row: any;
  onDelete: (id: string) => void;
  onEdit: (dataItem: any) => void;
};

export const FieldDisplayRow = (props: Props) => {
  const { getConfig } = useModelConfig();
  const { getEnumValueOf } = useEnums();
  const config = getConfig(EntityType.ReportField);
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);
  const row = props.row;
  const alignment = row.alignment.map((x: string) => getEnumValueOf(x, EnumType.TextAlignment));
  const headerAlignment = row.headerAlignment.map((x: string) =>
    getEnumValueOf(x, EnumType.TextAlignment)
  );
  const style = getEnumValueOf(row.style, EnumType.TextStyle);
  const format = getEnumValueOf(row.format, EnumType.DisplayFormat);
  const headerStyle = getEnumValueOf(row.headerStyle, EnumType.TextStyle);

  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <>
      <TableRow key={row.id}>
        <TableCell align="right" component="th" scope="row">
          {row.order}
        </TableCell>
        <TableCell align="left">{row.displayName}</TableCell>
        <TableCell align="left">{row.columnName}</TableCell>
        <TableCell align="left" sx={{ fontStyle: 'italic' }}>
          {row.columnType}
        </TableCell>
        <TableCell align="left">{format?.text}</TableCell>
        <TableCell align="left">{style?.text}</TableCell>
        <TableCell align="left">{alignment.map((x: IEnumProps) => x.text).join(', ')}</TableCell>
        <TableCell align="left">{headerStyle?.text}</TableCell>
        <TableCell align="left">
          {headerAlignment.map((x: IEnumProps) => x.text).join(', ')}
        </TableCell>
        {canUpdate && (
          <TableCell align="left">
            <ButtonGroup>
              <IconButton
                edge="end"
                size="small"
                aria-label="delete"
                color="secondary"
                onClick={() => props.onEdit(row)}
                sx={{ p: 0, mr: 1 }}
              >
                <EditTwoToneIcon fontSize="small" />
              </IconButton>
              <IconButton
                edge="end"
                size="small"
                aria-label="add"
                color="secondary"
                onClick={() => setDeleteDialog(true)}
                sx={{ p: 0 }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </ButtonGroup>
          </TableCell>
        )}
      </TableRow>
      <DeleteDialog
        onClose={() => {
          setDeleteDialog(false);
          props.onDelete(row.id);
        }}
        data={row}
        type={config.type}
        open={deleteDialog}
      />
    </>
  );
};
