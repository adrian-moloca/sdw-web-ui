import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch } from 'react-redux';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import { Logger, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import { IConfigProps, MetadataModel } from 'models';
import { DialogProps } from 'types/dialog';
import { AppDispatch, notificationActions } from 'store';
import { intersection, not } from './utils';
import type { KeyValue } from './types';

interface Props extends DialogProps {
  dataItem: any;
  config: IConfigProps;
  metadata: { [key: string]: MetadataModel };
  width?: string;
}

export const HideFieldsDialog = (props: Props) => {
  const theme = useTheme();
  const apiService = useApiService();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();

  const dispatch = useDispatch<AppDispatch>();
  const [checked, setChecked] = useState<readonly KeyValue[]>([]);
  const [left, setLeft] = useState<readonly KeyValue[]>(
    Object.keys(props.metadata).map((e) => ({
      key: e,
      value: props.metadata[e].displayName,
    }))
  );
  const [right, setRight] = useState<readonly KeyValue[]>([]);

  const title = props.dataItem ? props.dataItem[props.config.displayAccessor] : '';

  const url = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}/hidden-fields/${props.dataItem?.id}`;
  const mutation = useMutation({
    mutationFn: async (updateData: string[]) => apiService.put(url, updateData),
    onSuccess: () => {
      dispatch(
        notificationActions.addAlert({
          title: `Hide/Show Fields for ${title} completed with success`,
          type: 1,
        })
      );
      queryClient.invalidateQueries({ queryKey: [`${props.config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.dataItem?.id}_hiddenFields`] });
      props.onClickOk();
    },
    onError: (error: any) => {
      dispatch(
        notificationActions.addAlert({
          title: `Hide/Show Fields for ${title} completed with errors: ${error?.response?.data}`,
          type: 3,
        })
      );
      props.onClickOk();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [`${props.dataItem?.id}_hiddenFields`],
    queryFn: () => apiService.fetch(url),
    enabled: Boolean(props.dataItem),
  });

  useEffect(() => {
    const values = data?.fields?.filter((e: any) => e != null) ?? [];
    const fields = values.map((e: string) => ({
      key: e,
      value: props.metadata[e].displayName,
    }));

    setRight(fields);
    setLeft(not(left, fields));
  }, [data]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: KeyValue) => () => {
    const currentIndex = checked.findIndex((item) => item.key === value.key);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const fieldList = (items: readonly KeyValue[], title: string) => (
    <>
      <Typography variant="h4" component="div">
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          width: 300,
          height: 320,
          p: 1,
          border: '1px solid silver',
          borderRadius: '8px',
        }}
      >
        <PerfectScrollbar style={{ maxHeight: 320, overflowX: 'hidden' }}>
          <List dense component="div" tabIndex={0}>
            {items.map((value: KeyValue) => {
              const labelId = `transfer-list-item-${value.key}-label`;
              return (
                <ListItem key={value?.key} disablePadding onClick={handleToggle(value)}>
                  <ListItemIcon sx={{ minWidth: '30px', height: '16px' }}>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value?.value} />
                </ListItem>
              );
            })}
          </List>
        </PerfectScrollbar>
      </Paper>
    </>
  );

  const executeMutation = async () => {
    try {
      await mutation.mutateAsync(right.map((e) => e.key));
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="fields-hide-title"
    >
      <DialogTitle aria-labelledby="fields-hide-title">{` ${title}: Setup Fields`}</DialogTitle>
      <DialogContent sx={{ width: 'fit-content' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid>{fieldList(left, 'Visible Fields')}</Grid>
          <Grid>
            <Grid container direction="column" alignItems="center">
              <IconButton
                onClick={handleAllRight}
                disabled={left.length === 0}
                aria-label="move all right"
              >
                <ChevronRightOutlinedIcon />
              </IconButton>
              <IconButton
                sx={{ my: 0.5 }}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <ChevronRightOutlinedIcon />
              </IconButton>
              <IconButton
                sx={{ my: 0.5 }}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <ChevronLeftOutlinedIcon />
              </IconButton>
              <IconButton
                sx={{ my: 0.5 }}
                onClick={handleAllLeft}
                disabled={right.length === 0}
                aria-label="move all left"
              >
                <ChevronLeftOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid>{fieldList(right, 'Hidden Fields')}</Grid>
        </Grid>
        <GenericLoadingPanel loading={mutation.isPending} />
        <GenericLoadingPanel loading={isLoading} />
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 2, px: 2 }}>
        <Button onClick={props.onClickCancel} disabled={isLoading || mutation.isPending}>
          {t('actions.buttonCancel')}
        </Button>
        <Button
          disableElevation
          variant="contained"
          onClick={executeMutation}
          disabled={isLoading || mutation.isPending}
        >
          {t('actions.buttonSave')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
