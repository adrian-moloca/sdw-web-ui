import { Autocomplete, Chip, CircularProgress, TextField } from '@mui/material';
import get from 'lodash/get';
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { DataType, ISelectFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';

export const SelectData = ({
  type,
  hint,
  field,
  label,
  dataSource,
  variables,
  filters,
  placeholder,
  required,
  disabled,
  formik,
  keyField,
  textField,
  orderByField,
  groupBy,
  size,
  findByKey,
  mode,
  disablePortal,
  onChange,
  sticky,
}: ISelectFieldProps) => {
  const validKeyField = keyField ?? 'id';
  const validTextField = textField ?? 'title';

  const currentFilter = useMemo(() => {
    let parameters: any = {};

    if (variables) {
      parameters = variables;
    }

    parameters.filters = filters;

    if (orderByField && orderByField.length > 0) {
      parameters.sort = orderByField.map((e: string) => ({ column: e, operator: 'ASC' }));
    } else {
      parameters.sort = [{ column: validTextField, operator: 'ASC' }];
    }

    return parameters;
  }, [field, variables, filters, orderByField]);

  const apiService = useApiService();

  const { data, isLoading } = useQuery({
    queryKey: [dataSource.url, dataSource.queryKey, currentFilter],
    queryFn: () => apiService.fetchPayload(dataSource.url, currentFilter),
  });

  const { values, errors, touched, handleBlur } = formik;
  const { error: formikError, helperText } = getFieldState(field, touched, errors, hint);
  const defaultValue = type === DataType.MultiSelect ? [] : null;

  const currentValue = useMemo(() => {
    if (findByKey) {
      const foundValue = isLoading
        ? defaultValue
        : data.find((x: any) => get(x, validKeyField) == get(values, field));

      return foundValue ?? defaultValue; // Ensure non-undefined value
    }

    return get(values, field, defaultValue);
  }, [isLoading, findByKey, values, data, validKeyField]);

  if (mode === 'simple') {
    return (
      <Autocomplete
        id={field}
        fullWidth
        loading={isLoading}
        disablePortal={disablePortal}
        disabled={disabled}
        multiple={type === DataType.MultiSelect}
        disableCloseOnSelect={type === DataType.MultiSelect}
        onChange={(_event, value) => {
          _event.preventDefault();
          formik.setFieldValue(field, value);
          onChange?.(value);
        }}
        size={size ?? 'medium'}
        onBlur={handleBlur}
        options={isLoading ? [] : (data ?? [])}
        value={get(values, field, defaultValue)}
        includeInputInList
        groupBy={groupBy}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={label}
            margin="dense"
            name={field}
            placeholder={placeholder ?? `Select a ${label}`}
            required={required}
            helperText={helperText}
            error={formikError}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
      />
    );
  }

  if (sticky)
    return (
      <TextField
        fullWidth
        required={required === true}
        disabled={true}
        margin="dense"
        size={size ?? 'medium'}
        id={field}
        name={field}
        label={label}
        value={get(formik.values[field], validTextField, '')}
      />
    );

  return (
    <Autocomplete
      id={field}
      fullWidth
      loading={isLoading}
      disabled={disabled}
      multiple={type === DataType.MultiSelect}
      disablePortal={disablePortal}
      disableCloseOnSelect={type === DataType.MultiSelect}
      onChange={(_event, value) => {
        _event.preventDefault();
        formik.setFieldValue(field, value);
        onChange?.(value);
      }}
      size={size ?? 'medium'}
      onBlur={handleBlur}
      options={isLoading ? [] : (data ?? [])}
      value={currentValue}
      includeInputInList
      groupBy={groupBy}
      isOptionEqualToValue={(option: any, value: any) => {
        if (!option || !value) return false;
        return option[validKeyField] === value[validKeyField];
      }}
      getOptionLabel={(option) => get(option, validTextField) ?? ''}
      getOptionKey={(option) => get(option, validKeyField) ?? ''}
      renderTags={
        type == DataType.MultiSelect
          ? (value: readonly any[], getTagProps) =>
              value.map((option: any, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    sx={{ fontSize: '1rem' }}
                    label={get(option, validTextField) ?? ''}
                    key={key}
                    {...tagProps}
                  />
                );
              })
          : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          margin="dense"
          name={field}
          placeholder={placeholder ?? `Select a ${label}`}
          required={required}
          //@ts-expect-error TODO: investigate type & value for helperText
          helperText={touched[field] && errors[field] ? touched[field] && errors[field] : hint}
          error={touched[field] && Boolean(errors[field])}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};
