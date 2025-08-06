import { AvatarGroup, Box, Stack, Typography, useTheme } from '@mui/material';
import get from 'lodash/get';
import { useNavigate } from 'react-router-dom';
import { AwardCardMedal } from '../AwardCardMedal';
import { AthleteAvatar, CountryChip, MainCard } from 'components';
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
      <MainCard
        sx={{
          height: '100%',
          borderColor: `${theme.palette.divider}!important`,
          border: '1px solid',
          p: 0,
        }}
        content={false}
        elevation={0}
        onClick={() => navigate(getDetailRoute(EntityType.Person, data.id))}
      >
        <AwardCardMedal data={data} />
        <Box padding={4} gap={4} textAlign={'center'}>
          <Box display="flex" justifyContent="center" my={8}>
            {data.person ? (
              <AthleteAvatar
                src={data.person.profileImages}
                alt={data.participationName}
                size="12rem"
                bordered={true}
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
          <Typography
            variant="headline2"
            textAlign={'center'}
            fontFamily={theme.typography.h1.fontFamily}
            sx={{ mt: 4 }}
          >
            {data.participationName}
          </Typography>
          <Stack
            spacing={1}
            direction="row"
            alignContent="center"
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ mt: 4 }}
          >
            <CountryChip code={country} hideTitle={true} size={'small'} />
            <Typography variant="body1"> {fullName} </Typography>
          </Stack>
        </Box>
      </MainCard>
    );

  if (data.type === 'TEAM' && numberOfAthletes > 3) {
    return (
      <MainCard
        sx={{
          height: '100%',
          borderColor: `${theme.palette.divider}!important`,
          border: '1px solid',
          p: 0,
        }}
        content={false}
        elevation={0}
        onClick={() => navigate(getDetailRoute(EntityType.Team, data.id))}
      >
        <AwardCardMedal data={data} />
        <Box padding={4} gap={4} textAlign={'center'}>
          <Box display="flex" justifyContent="center" my={8}>
            <CountryChip
              code={country}
              title={data.participationName}
              size="xlarge"
              hideTitle={true}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Typography
              variant="headline2"
              textAlign={'center'}
              fontFamily={theme.typography.h1.fontFamily}
              sx={{ mt: 4 }}
            >
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
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard
      sx={{
        height: '100%',
        borderColor: `${theme.palette.divider}!important`,
        border: '1px solid',
        p: 0,
      }}
      content={false}
      onClick={() => navigate(getDetailRoute(EntityType.Team, data.id))}
      elevation={0}
    >
      <AwardCardMedal data={data} />
      <Box padding={4} gap={4} textAlign={'center'}>
        <Box display="flex" justifyContent="center" my={8}>
          {hasParticipants ? (
            <AvatarGroup max={3}>
              {data.participants.map((p: any) => (
                <AthleteAvatar
                  key={p.id}
                  src={p.profileImages}
                  alt={p.name}
                  size="9rem"
                  bordered={true}
                />
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
          <Typography
            variant="headline2"
            textAlign={'center'}
            fontFamily={theme.typography.h1.fontFamily}
            sx={{ mt: 4 }}
          >
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
        <Stack
          spacing={1}
          direction="row"
          alignContent="center"
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ mt: 4 }}
        >
          <CountryChip code={country} hideTitle={true} size={'small'} />
          <Typography variant="body1"> {fullName} </Typography>
        </Stack>
      </Box>
    </MainCard>
  );
};
