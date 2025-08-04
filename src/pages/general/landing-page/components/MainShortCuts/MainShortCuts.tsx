import { styled } from '@mui/material';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppRoutes from 'hooks/useAppRoutes';
import { t } from 'i18next';
import { EntityType, MenuFlagEnum } from 'models';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useDataGridHelper from 'hooks/useDataGridHelper';
import { renderShortcuts } from './utils';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
export const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.3),
}));

export const MainShortCuts = memo(() => {
  const { getIndexRoute, baseRoutes } = useAppRoutes();
  const { getIcon } = useDataGridHelper();
  const currentProfile = useSelector((state: RootState) => state.auth.profile);
  const navigate = useNavigate();

  const links = [
    {
      title: t('general.competitions'),
      icon: getIcon(EntityType.Competition),
      onClick: () => navigate(getIndexRoute(EntityType.Competition)),
    },
    {
      title: t('general.persons'),
      icon: getIcon(EntityType.Person),
      onClick: () => navigate(getIndexRoute(EntityType.Person)),
    },
    {
      title: t('general.horses'),
      icon: getIcon(EntityType.Horse),
      onClick: () => navigate(getIndexRoute(EntityType.Horse)),
    },
    {
      title: t('general.teams'),
      icon: getIcon(EntityType.Team),
      onClick: () => navigate(getIndexRoute(EntityType.Team)),
    },
    {
      title: t('general.organisations'),
      icon: getIcon(EntityType.Organization),
      onClick: () => navigate(getIndexRoute(EntityType.Organization)),
    },
    {
      title: t('general.nocs'),
      icon: getIcon(EntityType.Noc),
      onClick: () => navigate(getIndexRoute(EntityType.Noc)),
    },
    {
      title: t('general.venues'),
      icon: getIcon(EntityType.Venue),
      onClick: () => navigate(getIndexRoute(EntityType.Venue)),
    },
    {
      title: t('general.statistics'),
      icon: QueryStatsOutlinedIcon,
      onClick: () => navigate(baseRoutes.Statistics),
    },
  ];

  if ((currentProfile.flags & MenuFlagEnum.Explorer) !== 0)
    return renderShortcuts({ links, title: t('navigation.Explorer') });
  return null;
});
