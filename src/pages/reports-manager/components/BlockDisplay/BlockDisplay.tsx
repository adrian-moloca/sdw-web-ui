import { Chip, IconButton, Typography, useTheme } from '@mui/material';
import get from 'lodash/get';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Stack } from '@mui/system';
import Grid from '@mui/material/Grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useState } from 'react';
import { BlockTypeEnum, EntityType, EnumType, IEnumProps, useEnums, ViewType } from 'models';
import { MainCard } from 'components';
import { DeleteDialog } from '../DeleteDialog';
import { useModelConfig, useSecurity } from 'hooks';
import { t } from 'i18next';

type Props = {
  data: any;
  order: string;
  onDelete: (id: string) => void;
  onEdit: (dataItem: any) => void;
};

export const BlockDisplay = (props: Props) => {
  const theme = useTheme();
  const { getConfig } = useModelConfig();
  const { getEnumValueOf } = useEnums();
  const config = getConfig(EntityType.ReportBlock);
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const type = getEnumValueOf(props.data.type, EnumType.BlockType)!;
  const isSimpleText =
    type.code == BlockTypeEnum.Title ||
    type.code == BlockTypeEnum.Subtitle ||
    type.code == BlockTypeEnum.Text;
  const alignment = props.data.alignment.map((x: string) =>
    getEnumValueOf(x, EnumType.TextAlignment)
  );

  const style = props.data.style.map((x: string) => getEnumValueOf(x, EnumType.TextStyle));

  return (
    <Grid size="auto">
      <MainCard
        id={props.data.id}
        size="tiny"
        divider={false}
        secondary={
          <>
            {canUpdate && (
              <Stack
                direction="row"
                sx={{
                  marginLeft: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '5%',
                }}
              >
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="delete"
                  color="secondary"
                  onClick={() => props.onEdit(props.data)}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="add"
                  color="secondary"
                  onClick={() => setDeleteDialog(true)}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </>
        }
        headerSX={{ py: 1 }}
        content={!isSimpleText}
        border={true}
        contentSX={{ paddingTop: 0, paddingBottom: '10px!important' }}
        title={
          <Stack direction="row" spacing={1} sx={{ fontWeight: 'normal' }} alignItems={'center'}>
            <Chip
              label={`${props.order}.${get(props.data, 'order', '0')}`}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 0 }}
            />
            <Chip
              label={type?.text || 'Unknown'}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ borderRadius: '10%' }}
            />
            {isSimpleText && (
              <Typography variant="body1">
                {get(props.data, 'value', t('messages.no-value-available'))}
              </Typography>
            )}
            {alignment.map((align: IEnumProps, index: number) => (
              <Chip
                key={index}
                label={align.text || 'Unknown'}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
            {style.map((s: IEnumProps, index: number) => (
              <Chip
                key={index}
                label={s.text || 'Unknown'}
                size="small"
                variant="outlined"
                color="success"
              />
            ))}
          </Stack>
        }
      >
        <>
          {!isSimpleText && (
            <Typography
              variant="body2"
              component="div"
              sx={{ maxWidth: 400 }}
              dangerouslySetInnerHTML={{
                __html: get(props.data, 'value', t('messages.no-value-available')),
              }}
            />
          )}
        </>
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
