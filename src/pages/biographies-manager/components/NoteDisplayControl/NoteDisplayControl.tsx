import { Grid, IconButton, Typography, useColorScheme, useTheme } from '@mui/material';
import { EntityType, EnumType, useEnums } from 'models';
import { useModelConfig } from 'hooks';
import dayjs from 'dayjs';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import appConfig from 'config/app.config';
import { MainCard } from 'components';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

type Props = { type: EntityType; data: any };

export const NoteDisplayControl = (props: Props): React.ReactElement | null => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { getEnumValueOf } = useEnums();
  const { getConfig } = useModelConfig();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];
  const config = getConfig(props.type);

  const date = dayjs(props.data.date).format('dddd, Do MMMM YYYY, h:mm:ss A');
  const type = getEnumValueOf(props.data.type, EnumType.NoteType);

  const Icon = type?.icon;
  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}/${props.data.id}/notes`;

  const mutation = useMutation({
    mutationFn: async () => apiService.deleteAny(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
    },
    onError: (error: any) => {
      return error;
    },
  });

  return (
    <Grid size={12}>
      <MainCard
        size="tiny"
        border={true}
        boxShadow={false}
        avatar={Icon && <Icon sx={{ color: type?.color }} />}
        title={
          <Typography variant="body1">{`${type?.text} by ${props.data.updatedBy}`}</Typography>
        }
        subHeader={<Typography variant="body2"></Typography>}
        divider={true}
        headerSX={{ py: 0, backgroundColor: color }}
        contentSX={{ py: 0.5, paddingBottom: '5px!important' }}
        secondary={
          <IconButton onClick={() => mutation.mutate()}>
            <DeleteOutline fontSize="small" />
          </IconButton>
        }
      >
        <Typography
          variant="body2"
          component="div"
          dangerouslySetInnerHTML={{ __html: props.data.note }}
          sx={{
            textAlign: 'justify',
            lineHeight: 1,
            '& > p': {
              marginBottom: '3px!important',
              marginTop: '3px!important',
            },
          }}
        />
        <Typography variant="caption">
          Logged at <i>{date}</i> by <i>{props.data.updatedBy}</i>
        </Typography>
      </MainCard>
    </Grid>
  );
};
