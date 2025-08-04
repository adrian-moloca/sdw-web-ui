import { useQuery } from '@tanstack/react-query';
import { CompetitionAvatar, CountryChip, MainCard, StyledIconButton } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { EntityType } from 'models';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';
import { Stack, Typography, useMediaQuery } from '@mui/material';

export const RecentGamesTable: React.FC = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Competition);
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));
  const randomCount = isMobile ? 3 : isTablet ? 5 : 6;
  const url = `${config.apiNode}/search?start=0&rows=8`;
  const filter = {
    query: {
      operator: 'AND',
      where: [
        { column: 'sources', value: 'HORD' },
        {
          column: 'start_date',
          operator: 'GTE',
          value: dayjs().subtract(100, 'year').format(baseConfig.generalDateFormat).toUpperCase(),
        },
      ],
    },
    sort: [{ column: 'start_date', operator: 'DESC' }],
  };
  const { data, isLoading } = useQuery({
    queryKey: ['competition', config.apiNode, filter],
    queryFn: () => apiService.post(url, filter),
  });

  const dataContent = isLoading ? [] : (data?.content?.slice(0, randomCount) ?? []);
  return (
    <MainCard
      size="xlarge"
      divider={false}
      sx={{ background: 'transparent', width: '100%' }}
      title={t('general.recent-games')}
      secondary={
        <StyledIconButton
          title={t('actions.see-more')}
          aria-label={t('actions.see-more')}
          size="small"
          onClick={() => navigate('/explorer/competitions')}
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </StyledIconButton>
      }
    >
      <Stack direction={'row'} spacing={3} justifyContent="space-between" alignItems="center">
        {dataContent.map((competition: any) => (
          <MainCard
            key={competition.id}
            sx={{ width: '100%', cursor: 'pointer' }}
            onClick={() => navigate(`/explorer/competitions/${competition.id}`)}
          >
            <Stack alignItems={'center'} spacing={1} sx={{ pt: 4, height: 365 }}>
              <CompetitionAvatar src={competition.logo} size="14rem" title={competition.title} />
              <Typography
                variant="subtitle1"
                textAlign={'center'}
                fontWeight={'bold'}
                sx={{ pt: 4 }}
              >
                {competition.title}
              </Typography>
              <CountryChip code={competition.country} hideTitle={false} size="small" />
              <Typography variant="body2" sx={{ mt: 5 }}>
                {dayjs(competition.startDate).format(baseConfig.generalDateFormat).toUpperCase()}
                {' - '}
                {dayjs(competition.finishDate).format(baseConfig.generalDateFormat).toUpperCase()}
              </Typography>
            </Stack>
          </MainCard>
        ))}
      </Stack>
    </MainCard>
  );
};
