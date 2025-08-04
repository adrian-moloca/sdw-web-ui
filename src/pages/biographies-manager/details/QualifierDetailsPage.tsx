import { useEffect } from 'react';
import { t } from 'i18next';
import { Stack, Table, TableCell, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AvatarBox, FieldTemplate, LinkRouter } from 'components';
import type { IPanelTabProps } from 'types/views';
import { MainCard } from 'components/cards/MainCard';
import { useStoreCache } from 'hooks';
import { EntityType, TemplateType } from 'models';

export const QualifierDetailsPage: React.FC<IPanelTabProps> = ({
  data,
}: IPanelTabProps): React.ReactElement => {
  const { getMetadata, handleMetadata } = useStoreCache();
  useEffect(() => {
    handleMetadata(EntityType.Person);
  }, []);
  const metadata = getMetadata(EntityType.Person);

  return (
    <Grid container spacing={2}>
      {data.sdwAthlete && (
        <Grid size={6}>
          <MainCard
            superHeader={<>SDW Athlete</>}
            avatar={<AvatarBox text={data.sdwAthlete?.displayName} />}
            title={
              <Typography variant="h3" component={LinkRouter} to={`/persons/${data.sdwAthlete.id}`}>
                {data.sdwAthlete?.displayName}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                {data.sdwAthlete.nationality && (
                  <FieldTemplate
                    type={TemplateType.Country}
                    value={data.sdwAthlete.nationality}
                    withText={false}
                    size="1x"
                  />
                )}
                {data.sdwAthlete.countryOfBirth && (
                  <FieldTemplate
                    type={TemplateType.Country}
                    value={data.sdwAthlete.countryOfBirth}
                    withText={false}
                    size="1x"
                  />
                )}
              </Stack>
            }
            border={false}
            size="small"
          >
            <Table>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{metadata?.dateOfBirth?.displayName}</Typography>
                </TableCell>
                <TableCell>
                  <FieldTemplate type={TemplateType.Date} value={data.sdwAthlete?.dateOfBirth} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{metadata?.nationality?.displayName}</Typography>
                </TableCell>
                <TableCell>
                  <FieldTemplate
                    type={TemplateType.MasterData}
                    value={data.sdwAthlete?.nationality}
                  />
                </TableCell>
              </TableRow>
            </Table>
          </MainCard>
        </Grid>
      )}
      {data.gdsAthlete && (
        <Grid size={6}>
          <MainCard
            superHeader={<>GDS Athlete</>}
            avatar={<AvatarBox text={data.gdsAthlete?.displayName} />}
            title={
              <Typography
                variant="h3"
                component={LinkRouter}
                to={`/mapping/persons/${data.gdsAthlete.id}`}
              >
                {data.gdsAthlete?.displayName}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                <FieldTemplate
                  type={TemplateType.Country}
                  value={data.gdsAthlete.countryOfBirth}
                  withText={false}
                  size="1x"
                />
              </Stack>
            }
            border={false}
            size="small"
          >
            <Table>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{metadata?.dateOfBirth?.displayName}</Typography>
                </TableCell>
                <TableCell>
                  <FieldTemplate type={TemplateType.Date} value={data.gdsAthlete?.dateOfBirth} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{t('common.code')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{data.gdsAthlete?.id}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{data?.nationality?.displayName}</Typography>
                </TableCell>
                <TableCell>
                  <FieldTemplate
                    type={TemplateType.MasterData}
                    value={data.gdsAthlete?.countryOfBirth}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%' }} variant="head">
                  <Typography>{t('common.status')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{data.gdsAthlete?.state}</Typography>
                </TableCell>
              </TableRow>
            </Table>
          </MainCard>
        </Grid>
      )}

      {data.sdwHorse && (
        <Grid size={6}>
          <MainCard
            superHeader={<>SDW Horse</>}
            avatar={<AvatarBox text={data.sdwHorse?.name} />}
            title={
              <Typography variant="h3" component={LinkRouter} to={`/horses/${data.sdwHorse.id}`}>
                {data.sdwHorse?.name}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                {data.sdwHorse.nationality && (
                  <FieldTemplate
                    type={TemplateType.Country}
                    value={data.sdwHorse.nationality}
                    withText={false}
                    size="1x"
                  />
                )}
              </Stack>
            }
            border={false}
            size="small"
          />
        </Grid>
      )}
      {data.gdsHorse && (
        <Grid size={6}>
          <MainCard
            superHeader={<>GDS Horse</>}
            avatar={<AvatarBox text={data.gdsHorse?.name} />}
            title={
              <Typography
                variant="h3"
                component={LinkRouter}
                to={`/mapping/horses/${data.gdsHorse.id}`}
              >
                {data.gdsHorse?.name}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                <FieldTemplate
                  type={TemplateType.Country}
                  value={data.gdsHorse.nationality}
                  withText={false}
                  size="1x"
                />
              </Stack>
            }
            border={false}
            size="small"
          />
        </Grid>
      )}
      {data.sdwTeam && (
        <Grid size={6}>
          <MainCard
            superHeader={<>SDW Team</>}
            avatar={<AvatarBox text={data.sdwTeam?.name} />}
            title={
              <Typography variant="h3" component={LinkRouter} to={`/teams/${data.sdwTeam.id}`}>
                {data.sdwTeam?.name}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                {data.sdwTeam.nationality && (
                  <FieldTemplate
                    type={TemplateType.Country}
                    value={data.sdwTeam.nationality}
                    withText={false}
                    size="1x"
                  />
                )}
              </Stack>
            }
            border={false}
            size="small"
          />
        </Grid>
      )}
      {data.gdsTeam && (
        <Grid size={6}>
          <MainCard
            superHeader={<>GDS Team</>}
            avatar={<AvatarBox text={data.gdsTeam?.name} />}
            title={
              <Typography
                variant="h3"
                component={LinkRouter}
                to={`/mapping/teams/${data.gdsTeam.id}`}
              >
                {data.gdsTeam?.name}
              </Typography>
            }
            subHeader={
              <Stack direction="row" spacing={1} sx={{ marginTop: 0.35 }}>
                <FieldTemplate
                  type={TemplateType.Country}
                  value={data.gdsTeam.nationality}
                  withText={false}
                  size="1x"
                />
              </Stack>
            }
            border={false}
            size="small"
          />
        </Grid>
      )}
    </Grid>
  );
};
