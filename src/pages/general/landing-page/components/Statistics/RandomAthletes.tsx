import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AvatarHeader, CountryChip, MainCard, StyledIconButton } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { EntityType } from 'models';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import baseConfig from 'baseConfig';
import { StatsCard } from './StatsCard';
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
  //const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const config = getConfig(EntityType.Person);
  const randomLetters = getRandomLetters();
  //user this if more athletes are needed
  //const url = `${config.apiNode}/search?start=0&rows=${isMobile ? 3 : 6}&search=${randomLetters.vowel}${randomLetters.nonVowel}`;
  const url = `${config.apiNode}/search?start=0&rows=3&search=${randomLetters.vowel}${randomLetters.nonVowel}`;
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

  const dataContent = isLoading ? [] : (data?.content ?? []);
  return (
    <StatsCard
      title={t('general.random-olympians')}
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
      <Stack direction={'row'} spacing={2} justifyContent="space-between" alignItems="center">
        {dataContent.map((athlete: any) => (
          <MainCard
            key={athlete.id}
            sx={{ width: '100%', cursor: 'pointer' }}
            onClick={() => navigate(`/explorer/persons/${athlete.id}`)}
          >
            <Stack alignItems={'center'} spacing={3} sx={{ pt: 6, height: 315 }}>
              <AvatarHeader element={athlete} config={config} size="13rem" />
              <Typography variant="body1" fontWeight={'bold'} sx={{ mt: 4 }}>
                {formatAthleteName(athlete)}
              </Typography>
              <CountryChip
                code={athlete.country ?? athlete.nationality}
                hideTitle={false}
                size="tiny"
              />
            </Stack>
          </MainCard>
        ))}
      </Stack>
    </StatsCard>
  );
};
