import {
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import get from 'lodash/get';
import { useNavigate } from 'react-router-dom';
import { AwardCardMedal } from '../AwardCardMedal';
import { AthleteAvatar, CountryChip } from 'components';
import { EntityType, MasterData } from 'models';
import { useStoreCache } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';
import { formatMasterCode } from '_helpers';

type Props = {
  data: any;
};

export const AwardCard = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const { getDetailRoute } = useAppRoutes();
  const theme = useTheme();
  const country = get(data.organisation, 'country');
  const name = get(data.organisation, 'name');
  const orgType = get(data.organisation, 'type');

  const type = getMasterDataValue(orgType, MasterData.OrganisationType)?.value;
  const fullName = type ? `${name} (${formatMasterCode(orgType)})` : name;
  const navigate = useNavigate();
  const numberOfAthletes = data.participants?.length ?? 0;
  const hasParticipants = data.participants && data.participants?.length > 0;

  if (data.type === 'INDIVIDUAL')
    return (
      <Card
        sx={{
          height: '100%',
          borderColor: `${theme.palette.divider}!important`,
          border: '1px solid',
        }}
        elevation={0}
      >
        <CardActionArea
          onClick={() => navigate(getDetailRoute(EntityType.Person, data.id))}
          sx={{ p: 1 }}
        >
          <CardContent>
            <AwardCardMedal data={data} />
            <Box display="flex" justifyContent="center" my={2}>
              {data.person ? (
                <AthleteAvatar
                  src={data.person.profileImages}
                  alt={data.participationName}
                  size="12rem"
                />
              ) : (
                <CountryChip
                  code={country}
                  title={data.participationName}
                  size="xlarge"
                  hideTitle={true}
                />
              )}
            </Box>
            <Typography variant="h6" component="div"></Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {data.participationName}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack
              spacing={1}
              direction="row"
              alignContent="center"
              sx={{ alignItems: 'center' }}
              component="span"
            >
              <CountryChip code={country} hideTitle={true} size={'small'} />
              <Typography variant="body1"> {fullName} </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );

  if (data.type === 'TEAM' && numberOfAthletes > 3) {
    return (
      <Card
        sx={{
          height: '100%',
          borderColor: `${theme.palette.divider}!important`,
          border: '1px solid',
        }}
        elevation={0}
      >
        <CardActionArea
          onClick={() => navigate(getDetailRoute(EntityType.Team, data.id))}
          sx={{ p: 1 }}
        >
          <CardContent>
            <AwardCardMedal data={data} />
            <Box display="flex" justifyContent="center" my={1}>
              <CountryChip
                code={country}
                title={data.participationName}
                size="xlarge"
                hideTitle={true}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {data.participationName}
              </Typography>
            </Box>
            {hasParticipants && (
              <Box display="flex" justifyContent="center" textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  {data.participants?.map((athlete: any) => athlete.name).join(' • ')}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Stack
              spacing={1}
              direction="row"
              alignContent="center"
              sx={{ alignItems: 'center' }}
              component="span"
            >
              <CountryChip code={country} hideTitle={true} size={'small'} />
              <Typography variant="body1"> {fullName} </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        borderColor: `${theme.palette.divider}!important`,
        border: '1px solid',
      }}
      elevation={0}
    >
      <CardActionArea
        onClick={() => navigate(getDetailRoute(EntityType.Team, data.id))}
        sx={{ p: 1 }}
      >
        <CardContent>
          <AwardCardMedal data={data} />
          <Box display="flex" justifyContent="center" my={1}>
            {hasParticipants ? (
              <AvatarGroup max={3}>
                {data.participants.map((p: any) => (
                  <AthleteAvatar key={p.id} src={p.profileImages} alt={p.name} size="9rem" />
                ))}
              </AvatarGroup>
            ) : (
              <CountryChip
                code={country}
                title={data.participationName}
                size="xlarge"
                hideTitle={true}
              />
            )}
          </Box>
          <Box display="flex" justifyContent="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {data.participationName}
            </Typography>
          </Box>
          {hasParticipants && (
            <Box display="flex" justifyContent="center" textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {data.participants?.map((athlete: any) => athlete.name).join(' • ')}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 1 }} />
          <Stack
            spacing={1}
            direction="row"
            alignContent="center"
            sx={{ alignItems: 'center' }}
            component="span"
          >
            <CountryChip code={country} hideTitle={true} size={'small'} />
            <Typography variant="body1"> {fullName} </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
