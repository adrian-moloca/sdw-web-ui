import { Typography, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AthleteAvatar, CountryChip, MainCard, StyledIconButton } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { EntityType } from 'models';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';
import { Stack } from '@mui/system';
import { formatAthleteName } from '_helpers';

function getRandomLetters() {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    vowel: getRandomItem(vowels),
    nonVowel: getRandomItem(consonants),
  };
}

export const RandomAthletes: React.FC = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));
  const config = getConfig(EntityType.Person);
  const randomLetters = getRandomLetters();
  const randomCount = isMobile ? 3 : isTablet ? 5 : 6;
  const url = `${config.apiNode}/search?start=0&rows=8&search=${randomLetters.vowel}${randomLetters.nonVowel}`;
  const filter = {
    query: {
      operator: 'AND',
      where: [
        { column: 'sources', value: 'HORD' },
        {
          column: 'date_of_birth',
          operator: 'GTE',
          value: dayjs().subtract(90, 'year').format(baseConfig.generalDateFormat).toUpperCase(),
        },
      ],
    },
    sort: [{ column: 'date_of_birth', operator: 'DESC' }],
  };
  const { data, isLoading } = useQuery({
    queryKey: ['person', config.apiNode, filter],
    queryFn: () => apiService.post(url, filter),
  });

  const dataContent = isLoading ? [] : (data?.content?.slice(0, randomCount) ?? []);
  return (
    <MainCard
      size="xlarge"
      divider={false}
      title={t('general.random-olympians')}
      sx={{ background: 'transparent', width: '100%' }}
      secondary={
        <StyledIconButton
          title={t('actions.see-more')}
          aria-label={t('actions.see-more')}
          size="small"
          onClick={() => navigate('/explorer/persons')}
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </StyledIconButton>
      }
    >
      <Stack direction={'row'} spacing={3} justifyContent="space-between" alignItems="center">
        {dataContent.map((athlete: any) => (
          <MainCard
            key={athlete.id}
            sx={{ width: '100%', cursor: 'pointer' }}
            onClick={() => navigate(`/explorer/persons/${athlete.id}`)}
          >
            <Stack alignItems={'center'} spacing={2} sx={{ pt: 8, height: 380 }}>
              <AthleteAvatar
                src={athlete.profileImages}
                size="13rem"
                title={formatAthleteName(athlete)}
              />
              <Typography
                variant="subtitle1"
                textAlign={'center'}
                fontWeight={'bold'}
                sx={{ pt: 4 }}
              >
                {formatAthleteName(athlete)}
              </Typography>
              <CountryChip
                code={athlete.country ?? athlete.nationality}
                hideTitle={false}
                size="small"
              />
              <Typography variant="body2" sx={{ mt: 5 }}>
                {dayjs(athlete.dateOfBirth)
                  .subtract(100, 'year')
                  .format(baseConfig.generalDateFormat)
                  .toUpperCase()}
              </Typography>
            </Stack>
          </MainCard>
        ))}
      </Stack>
    </MainCard>
  );
};
