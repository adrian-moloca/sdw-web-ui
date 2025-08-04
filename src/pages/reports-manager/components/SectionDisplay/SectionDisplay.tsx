import {
  IconButton,
  useTheme,
  Typography,
  Stack,
  Chip,
  Divider,
  useColorScheme,
} from '@mui/material';
import { EnumType, EditionMode, EntityType, ViewType, ContentTypeEnum } from 'models';
import TextSnippetTwoTone from '@mui/icons-material/TextSnippetTwoTone';
import Grid from '@mui/material/Grid';
import DeleteOutlined from '@mui/icons-material/DeleteOutline';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import sortBy from 'lodash/sortBy';
import { useState } from 'react';
import get from 'lodash/get';
import { useQueryClient } from '@tanstack/react-query';
import { useModelConfig, useSecurity } from 'hooks';
import { BlockDisplay, FieldDisplay, DeleteDialog } from 'pages/reports-manager/components';
import { BlockForm, FieldForm } from 'pages/reports-manager/forms';
import { EnumTemplate, MainCard } from 'components';
import { Transitions } from 'components/Transitions';
import { SectionDefaultFilterDisplay } from './utils';

type Props = {
  data: any;
  id: string;
  onEdit: (dataItem: any) => void;
};

export const SectionDisplay = (props: Props) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const color = mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100];
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.ReportSection);
  const { canUpdate, canCreate } = useSecurity(config.type, ViewType.View, false);

  const data = { ...props.data };
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [blockStatus, setBlockStatus] = useState<{ data?: any; editionMode: EditionMode }>({
    editionMode: EditionMode.Detail,
  });
  const [fieldStatus, setFieldStatus] = useState<{ data?: any; editionMode: EditionMode }>({
    editionMode: EditionMode.Detail,
  });

  const showBlockForm =
    blockStatus.editionMode == EditionMode.Create || blockStatus.editionMode == EditionMode.Update;
  const showFieldForm =
    fieldStatus.editionMode == EditionMode.Create || fieldStatus.editionMode == EditionMode.Update;
  const dataSource = data.dataSource;

  const renderTitle = () => {
    if (data.dataSource?.displayName) {
      return (
        <Stack direction={'row'} alignItems={'center'}>
          <EnumTemplate value={data.type} type={EnumType.ContentType} withText={true} />
          <Typography variant="body1" fontWeight="bold">
            {data.dataSource?.displayName}
          </Typography>
        </Stack>
      );
    }

    return <EnumTemplate value={data.type} type={EnumType.ContentType} withText={true} />;
  };

  return (
    <Grid size={12}>
      <MainCard
        id={data.id}
        title={renderTitle()}
        headerSX={{ py: 1, backgroundColor: color }}
        contentSX={{ p: 1, paddingBottom: '10px!important' }}
        size="tiny"
        divider={false}
        content={props.data.blocks.length > 0 || props.data.fields.length > 0}
        avatar={
          <Chip
            label={get(data, 'order', '0')}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 0 }}
          />
        }
        secondary={
          <>
            {canCreate && canUpdate && (
              <Stack
                direction="row"
                spacing={1}
                alignContent="center"
                sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '5%' }}
              >
                <IconButton
                  size="small"
                  aria-label="delete"
                  color="secondary"
                  onClick={() => props.onEdit(data)}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="delete"
                  color="secondary"
                  onClick={() => setDeleteDialog(true)}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => setBlockStatus({ editionMode: EditionMode.Create })}
                >
                  <TextSnippetTwoTone fontSize="small" />
                </IconButton>
                {dataSource && (
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => setFieldStatus({ editionMode: EditionMode.Create })}
                  >
                    <TableRowsTwoToneIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            )}
          </>
        }
      >
        <Grid container spacing={2}>
          {(props.data.type.toLowerCase() === ContentTypeEnum.Table.toLowerCase() ||
            props.data.type.toLowerCase() === ContentTypeEnum.LoopTable.toLowerCase()) && (
            <SectionDefaultFilterDisplay {...props} />
          )}
          {sortBy(props.data.blocks, 'order').map((e: any) => (
            <BlockDisplay
              key={e.id}
              data={e}
              order={get(data, 'order', '0')}
              onDelete={(id: string) => {
                queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
                data.blocks = data.blocks.filter((x: any) => x.id !== id);
              }}
              onEdit={(dataItem: any) => {
                setBlockStatus({ ...blockStatus, editionMode: EditionMode.Update, data: dataItem });
              }}
            />
          ))}
          <FieldDisplay
            data={data}
            onDelete={() => queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] })}
            onEdit={(dataItem: any) =>
              setFieldStatus({ editionMode: EditionMode.Update, data: dataItem })
            }
          />
          {showBlockForm && (
            <Grid size={12}>
              <Transitions type="slide" position="top-right" in={showBlockForm} direction="left">
                <BlockForm
                  data={blockStatus.data}
                  section={data}
                  editionMode={blockStatus.editionMode}
                  onClose={() => {
                    queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
                    setBlockStatus({ ...blockStatus, editionMode: EditionMode.Detail });
                  }}
                />
              </Transitions>
            </Grid>
          )}
          {showFieldForm && (
            <Grid size={12}>
              <Transitions type="slide" position="top-right" in={showFieldForm} direction="left">
                <FieldForm
                  data={fieldStatus.data}
                  section={data}
                  editionMode={fieldStatus.editionMode}
                  onClose={() => {
                    queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
                    setFieldStatus({ ...fieldStatus, editionMode: EditionMode.Detail });
                  }}
                />
              </Transitions>
            </Grid>
          )}
        </Grid>
      </MainCard>
      <DeleteDialog
        onClose={() => {
          setDeleteDialog(false);
          queryClient.invalidateQueries({ queryKey: [`${props.id}_view`] });
        }}
        data={data}
        type={config.type}
        open={deleteDialog}
      />
    </Grid>
  );
};
