import { useState } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
  PaperProps,
} from '@mui/material';

interface CustomPaperProps extends PaperProps {
  checkboxId: string;
  selectAll: boolean;
  onSelectAllToggle: () => void;
  children: React.ReactNode;
}

const CustomPaper = ({
  checkboxId,
  selectAll,
  onSelectAllToggle,
  children,
  ...paperProps
}: CustomPaperProps) => (
  <Paper {...paperProps}>
    <Box
      onMouseDown={(e) => e.preventDefault()} // prevent blur
      pl={1.5}
      py={0.5}
    >
      <FormControlLabel
        label="Select all"
        onClick={(e) => {
          e.preventDefault(); // prevent blur
          onSelectAllToggle();
        }}
        control={<Checkbox id={checkboxId} checked={selectAll} />}
      />
    </Box>
    <Divider />
    {children}
  </Paper>
);

interface AutocompleteWithSelectAllProps<T> extends AutocompleteProps<T, true, any, false, any> {
  setValue: (value: T[]) => void;
  checkboxId?: string;
}

export function AutocompleteWithSelectAll<T>({
  props,
}: Readonly<{ props: AutocompleteWithSelectAllProps<T> }>) {
  const { setValue, onChange, ...autocompleteProps } = props;
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSelectAll = () => {
    setSelectAll((prev) => {
      if (!prev) setValue([...props.options]);
      else setValue([]);
      return !prev;
    });
  };

  return (
    <Autocomplete
      {...autocompleteProps}
      onChange={(_e, value, reason, details) => {
        if (reason === 'clear' || reason === 'removeOption') setSelectAll(false);
        if (reason === 'selectOption' && value.length === props.options.length) setSelectAll(true);
        setValue(value);

        if (onChange !== undefined) onChange(_e, value, reason, details);
      }}
      slots={{ paper: CustomPaper as React.JSXElementConstructor<any> }}
      slotProps={{
        paper: {
          checkboxId: props.checkboxId ?? `select-all-checkbox-for-autocomplete-${props.id}`,
          selectAll,
          onSelectAllToggle: handleSelectAll,
        } as any,
      }}
    />
  );
}
