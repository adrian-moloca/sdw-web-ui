import { Dialog, DialogTitle, DialogContent, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';
import { IUpdateDialogProps } from 'types/views';
import { useModelConfig, useSecurity } from 'hooks';
import { EntityType, ViewType } from 'models';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import baseConfig from 'baseConfig';

export const EntryDialog = (props: IUpdateDialogProps) => {
  const { getConfig } = useModelConfig();
  const configTranslation = getConfig(EntityType.Translation);
  const configMapping = getConfig(EntityType.Mapping);
  const configEntry = getConfig(EntityType.Entry);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const childrenNo = get(props.dataItem, 'childItems')
    ? parseInt(get(props.dataItem, 'childItems'))
    : 0;
  const flags = useSecurity(configEntry.type, ViewType.Index, false).flags;

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="update-dialog-title"
    >
      <DialogTitle aria-labelledby="update-dialog-title">{`${props.dataItem?.value} | ${props.dataItem?.key}`}</DialogTitle>
      <DialogContent sx={{ width: 'fit-content' }}>
        <Grid container spacing={baseConfig.gridSpacing}>
          {childrenNo > 0 && (
            <Grid size={12}>
              <DataGridPanel
                config={configEntry}
                showHeader={false}
                flags={flags}
                toolbarType="none"
                dataSource={{
                  url: `${appConfig.masterDataEndPoint}/v1/entries/byParentKey/${props.dataItem?.key}`,
                  apiVersion: 'master',
                  queryKey: `subentries${props.dataItem?.id}`,
                }}
              />
            </Grid>
          )}
          <Grid size={12}>
            <DataGridPanel
              config={configTranslation}
              showHeader={false}
              flags={flags}
              toolbarType="none"
              dataSource={{
                url: `${appConfig.masterDataEndPoint}${configTranslation.apiNode}/${props.dataItem?.id}`,
                apiVersion: 'master',
                queryKey: `translation${props.dataItem?.id}`,
              }}
            />
          </Grid>
          <Grid size={12}>
            <DataGridPanel
              config={configMapping}
              showHeader={false}
              flags={flags}
              toolbarType="none"
              dataSource={{
                url: `${appConfig.masterDataEndPoint}${configMapping.apiNode}/${props.dataItem?.id}`,
                apiVersion: 'master',
                queryKey: `mapping${props.dataItem?.id}`,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
