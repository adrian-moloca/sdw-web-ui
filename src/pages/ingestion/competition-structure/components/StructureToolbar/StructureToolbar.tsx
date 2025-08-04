import Download from '@mui/icons-material/Download';
import RotateLeftOutlined from '@mui/icons-material/RotateLeftOutlined';
import Upload from '@mui/icons-material/Upload';
import WidgetsOutlined from '@mui/icons-material/WidgetsOutlined';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import {
  Autocomplete,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { DisplayEntry } from 'models';
import { VisuallyHiddenInput } from 'pages/tools/dataIngest/components';
import { type ChangeEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
  data: Array<any>;
  isLoading: boolean;
  discipline: DisplayEntry | null;
  edition: string;
  editions: string[];
  onChangeEdition: (value: string) => void;
  onChangeDiscipline: (value: DisplayEntry | null) => void;
};

export const StructureToolbar = (props: Props) => {
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const currentProfile = useSelector((state: RootState) => state.auth.profile);
  const isAdmin = currentProfile?.groups.includes('SDW_ADMIN') ?? false;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isUploading, setIsUploading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const disciplines: DisplayEntry[] =
    props.data?.map((x: any) => ({ code: x.code, title: x.title })) ?? [];

  const handleDownload = () => {
    const url = `${appConfig.toolsEndPoint}/odf/structure/export?competitionCode=${props.edition}`;
    apiService.downloadFile(url, `${props.edition}.zip`);
  };

  const validFiles = '.zip';
  const handleFileEvent = async (e: ChangeEvent<HTMLInputElement>) => {
    const urlUpload = `${appConfig.toolsEndPoint}/odf/structure/import?competitionCode=${props.edition}`;
    if (e.target.files) {
      setIsUploading(true);
      await apiService.uploadFiles(urlUpload, e.target.files);
      setIsUploading(false);
    }
  };

  const mutationBuild = useMutation({
    mutationFn: async () =>
      apiService.post(
        `${appConfig.toolsEndPoint}/odf/structure/build?competitionCode=${props.edition}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint, props.edition] });
    },
    onError: (error: any) => error,
  });

  const handleForceReload = async () => {
    setReloading(true);
    const url = `${appConfig.toolsEndPoint}/odf/structure?competitionCode=${props.edition}&mode=full`;
    await apiService.fetch(url);
    queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint, props.edition] });
    setReloading(false);
  };
  const handlePublish = async () => {
    setPublishing(true);
    const url = `${appConfig.toolsEndPoint}/odf/structure/publish?competitionCode=${props.edition}`;
    await apiService.post(url);
    queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint, props.edition] });
    setPublishing(false);
  };
  return (
    <Stack spacing={1}>
      <Typography variant="body2">{t('message.select-the-edition-the-discipline')}</Typography>
      <Stack
        spacing={isMobile ? 0 : 1}
        direction={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent="space-between"
      >
        <Autocomplete
          options={props.editions}
          fullWidth
          size="small"
          value={props.edition}
          onChange={(_event: any, newValue: string | null) => {
            props.onChangeEdition(newValue ?? appConfig.edition);
          }}
          renderInput={(params) => (
            <TextField {...params} margin="dense" placeholder={t('messages.select-a-og-edition')} />
          )}
        />
        <Stack direction={'row'} spacing={1}>
          <Button
            title={t('message.force-reload-wipe-rules')}
            aria-label={t('message.force-reload-wipe-rules')}
            color="secondary"
            variant="outlined"
            loading={mutationBuild.isPending}
            onClick={() => mutationBuild.mutateAsync()}
            startIcon={<WidgetsOutlined />}
          >
            {t('actions.build')}
          </Button>
          <Button
            title={t('message.force-reload-wipe-rules')}
            color="secondary"
            variant="outlined"
            loading={reloading}
            aria-label={t('message.force-reload-wipe-rules')}
            onClick={handleForceReload}
            startIcon={<RotateLeftOutlined />}
          >
            {t('actions.reload')}
          </Button>
          {isAdmin && (
            <Button
              title={t('actions.publish')}
              aria-label={t('actions.publish')}
              color="secondary"
              variant="outlined"
              loading={publishing}
              onClick={handlePublish}
              startIcon={<BeenhereOutlinedIcon />}
            >
              {t('actions.publish')}
            </Button>
          )}
        </Stack>
        <Autocomplete
          options={disciplines}
          fullWidth
          loading={props.isLoading}
          value={props.discipline}
          size="small"
          onChange={(_event: any, newValue: DisplayEntry | null) => {
            props.onChangeDiscipline(newValue);
          }}
          getOptionLabel={(option: any) => option?.title ?? ''}
          getOptionKey={(option: any) => option?.code ?? ''}
          renderInput={(params) => (
            <TextField {...params} margin="dense" placeholder={t('actions.select-a-discipline')} />
          )}
        />

        <Stack direction={'row'} spacing={1}>
          <IconButton
            title={t('actions.buttonDownload')}
            color="primary"
            onClick={handleDownload}
            disabled={!props.discipline}
          >
            <Download />
          </IconButton>
          <IconButton
            loading={isUploading}
            title={t('actions.buttonUpload')}
            color="primary"
            component="label"
            role={undefined}
            disabled={!props.discipline}
          >
            <Upload />
            <VisuallyHiddenInput
              type="file"
              multiple={false}
              accept={validFiles}
              onChange={handleFileEvent}
            />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
