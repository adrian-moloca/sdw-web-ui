import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-pro';
import { Autocomplete, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import type { AutocompleteCell } from 'types/datagrid';

type Props = AutocompleteCell & { params: GridRenderEditCellParams };

export const AutocompleteEditInputCell = ({
  params,
  options,
  loading,
  freeSolo,
  multiple,
  keyField,
  textField,
  onChange,
  getValue,
}: Props) => {
  const apiRef = useGridApiContext();

  const handleChange = useCallback(
    (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
      event.stopPropagation();

      apiRef.current.setEditCellValue({
        id: params.id,
        field: params.field,
        value: newValue,
      });
      onChange?.(newValue);
    },
    [params.id, params.field]
  );

  const getInnerValue = useCallback(() => {
    if (getValue) return getValue();

    if (params.value) return params.value;

    if (multiple) return [];

    return null;
  }, [params.value, params.getValue, multiple]);

  const validKeyField = keyField ?? 'id';
  const validTextField = textField ?? 'name';

  return (
    <Autocomplete
      value={getInnerValue()}
      onChange={handleChange}
      loading={loading}
      onInputChange={(event, value) => freeSolo && !multiple && event && handleChange(event, value)}
      fullWidth
      multiple={multiple}
      disableCloseOnSelect={multiple}
      options={options ?? []}
      freeSolo={freeSolo}
      autoHighlight
      isOptionEqualToValue={(option, value) => option[validKeyField] === value[validKeyField]}
      getOptionLabel={(option) => option[validTextField] ?? ''}
      renderInput={(inputParams) => <TextField {...inputParams} error={params.error} />}
    />
  );
};
