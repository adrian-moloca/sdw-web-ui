import { IconButton, Typography, useColorScheme, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import appConfig from 'config/app.config';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { EntityType, EnumType, useEnums } from 'models';
import dayjs from 'dayjs';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
};

export const NoteDisplayControl = (props: Props) => {
  const { getConfig } = useModelConfig();
  const { getEnumValueOf } = useEnums();
  const config = getConfig(EntityType.Report);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { mode } = useColorScheme();

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];

  const date = dayjs(props.data.date).format(baseConfig.dateTimeDateFormat).toUpperCase();
  const type = getEnumValueOf(props.data.type, EnumType.NoteType);
  const Icon = type!.icon!;

  const url = `${appConfig.reportManagerEndPoint}${config.apiNode}/${props.data.id}/notes`;
  const mutation = useMutation({
    mutationFn: async () => apiService.deleteAny(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
    },
    onError: (error: any) => error,
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
