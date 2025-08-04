import { GridActionType, ManagerDataCategory, MasterDataCategory, GridActionProps } from 'models';
import { Button, Checkbox, FormControlLabel, FormGroup, ToggleButton } from '@mui/material';
import { ToolbarManagerFilter, ToolbarMasterFilter, ToolbarBaseIcon } from 'components/toolbar';

export const DataGridToolbar = (props: GridActionProps) => {
  const { loading, color, disabled, icon, type, value, label, category, values, action, onChange } =
    props;

  switch (type) {
    case GridActionType.SwitchButton:
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={() => {
                if (onChange) onChange(!value);
              }}
            />
          }
          label={label ?? ''}
        />
      );
    case GridActionType.MasterData:
      if (onChange)
        return (
          <ToolbarMasterFilter
            {...props}
            category={category as MasterDataCategory}
            value={values}
            onChange={onChange}
          />
        );

      return null;
    case GridActionType.ManagerData:
      if (onChange)
        return (
          <ToolbarManagerFilter
            {...props}
            category={category as ManagerDataCategory}
            value={values}
            onChange={onChange}
          />
        );

      return null;
    case GridActionType.MappingFilter:
      return (
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.mapped}
                onChange={() => {
                  onChange?.({ mapped: !value.mapped, unmapped: value.unmapped });
                }}
              />
            }
            label="Mapped"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={value.unmapped}
                onChange={() => {
                  onChange?.({ mapped: value.mapped, unmapped: !value.unmapped });
                }}
              />
            }
            label="Unmapped"
          />
        </FormGroup>
      );
    case GridActionType.ToggleButton:
      return (
        <ToggleButton value="check" selected={value} onChange={action} title={label ?? ''}>
          {icon}
        </ToggleButton>
      );
    case GridActionType.Button:
      return (
        <Button
          //variant="outlined"
          color="secondary"
          onClick={action}
          startIcon={icon}
          disabled={Boolean(disabled)}
          aria-label={label ?? 'Action button'}
        >
          {label ?? ''}
        </Button>
      );
    case GridActionType.LoadingButton:
      return (
        <Button
          loadingPosition="start"
          color={color}
          onClick={action}
          startIcon={icon}
          loading={Boolean(loading)}
          disabled={Boolean(disabled)}
          aria-label={label ?? 'Loading button'}
        >
          {label ?? ''}
        </Button>
      );
    default:
      if (action) return <ToolbarBaseIcon icon={icon} onClick={action} title={label ?? ''} />;

      return null;
  }
};
