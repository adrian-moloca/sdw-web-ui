import React, { useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { AutocompleteCell } from 'types/datagrid';
import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';

type Props = AutocompleteCell & { params: GridFilterInputValueProps };

export const AutocompleteFilterCell = ({
  params,
  options,
  loading,
  freeSolo,
  multiple,
  keyField,
  textField,
  getValue,
}: Props) => {
  const { item, applyValue } = params;

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    applyValue({ ...item, value: newValue });
  };

  const getInnerValue = useCallback(() => {
    if (getValue) return getValue();

    if (item.value) return item.value;

    if (multiple) return [];

    return null;
  }, [item.value, multiple]);

  const validKeyField = keyField ?? 'id';
  const validTextField = textField ?? 'name';
  return (
    <Autocomplete
      value={getInnerValue()}
      onChange={handleChange}
      loading={loading}
      onInputChange={(event, value) => freeSolo && !multiple && event && handleChange(event, value)}
      fullWidth
      limitTags={1}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      options={options ?? []}
      freeSolo={freeSolo}
      autoHighlight
      getOptionKey={(option) => option[validKeyField] ?? ''}
      isOptionEqualToValue={(option, value) => option[validKeyField] === value[validKeyField]}
      getOptionLabel={(option) => option[validTextField] ?? ''}
      renderInput={(inputParams) => (
        <TextField {...inputParams} label={'Values'} variant="standard" />
      )}
    />
  );
};
