import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import get from 'lodash/get';
import { Stack } from '@mui/system';
import NewReleasesTwoToneIcon from '@mui/icons-material/NewReleasesTwoTone';
import Grid from '@mui/material/Grid';
import { Gauge } from '@mui/x-charts-pro';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { EntityType } from 'models';
import { RootState } from 'store';
import { useModelConfig } from 'hooks';
import { EditionChip } from '../EditionChip';

export const BiographyCompletion = (props: { data: any; type: EntityType }) => {
  const managerSetup = useSelector((x: RootState) => x.manager);

  const theme = useTheme();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);

  if (
    ![
      EntityType.PersonBiography,
      EntityType.HorseBiography,
      EntityType.TeamBiography,
      EntityType.NocBiography,
    ].includes(props.type)
  ) {
    return null;
  }

  const renderSensitiveInfo = () => {
    const sensitiveInfo = get(props.data, 'sensitiveData');

    if (!sensitiveInfo || sensitiveInfo.length === 0) return null;

    return (
      <>
        {get(props.data, 'sensitiveData')?.map((x: string, i: number) => (
          <Stack direction="row" key={i} spacing={1}>
            <NewReleasesTwoToneIcon fontSize="small" color="warning" />
            <Typography variant="body2"> {x} </Typography>
          </Stack>
        ))}
      </>
    );
  };

  return (
    <Grid size={12}>
      <Box
        sx={{
          position: 'relative',
          background: '#f0f9ff',
          borderRadius: '12px',
          padding: 0,
          overflow: 'hidden',
          height: 'auto',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            background: `url("data:image/svg+xml,%3Csvg width='1440' height='320' viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23cce7ff' fill-opacity='1' d='M0,96L30,112C60,128,120,160,180,170.7C240,181,300,171,360,176C420,181,480,203,540,202.7C600,203,660,181,720,176C780,171,840,181,900,170.7C960,160,1020,128,1080,128C1140,128,1200,160,1260,181.3C1320,203,1380,213,1410,218.7L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center`,
            backgroundSize: 'cover',
            opacity: 0.3,
          }}
        />
        <Card
          sx={{
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ paddingTop: 0, paddingBottom: '0!important' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ lg: 2, md: 3, sm: 4, xs: 4 }}>
                <Gauge
                  width={120}
                  height={120}
                  value={props.data.completionRate ?? 0}
                  text={({ value }) => `${value}%`}
                />
              </Grid>
              <Grid size={{ lg: 7, md: 6, sm: 6, xs: 6 }}>
                <Typography variant="h6" color={theme.palette.common.black}>
                  {`${props.data[config.displayAccessor]} Profile`}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {t('message.latest-modification-at')}
                  <Typography component="span" variant="body2" style={{ color: '#1976d2' }}>
                    {dayjs(get(props.data, 'ts')).format('dddd, Do MMMM YYYY, h:mm:ss A')}
                  </Typography>
                  {` by `}
                  <Typography component="span" variant="body2" style={{ color: '#1976d2' }}>
                    {get(props.data, 'updatedBy')}
                  </Typography>
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {`Please complete the ${config.display.toLocaleLowerCase()} to continue with the workflow.`}
                </Typography>
                {renderSensitiveInfo()}
              </Grid>
              <Grid size={{ lg: 3, md: 3, sm: 2, xs: 2 }} display="flex" justifyContent="flex-end">
                <EditionChip data={managerSetup?.currentEdition} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};
