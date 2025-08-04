import { Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import SupportAgentTwoTone from '@mui/icons-material/SupportAgentTwoTone';
import SecurityTwoTone from '@mui/icons-material/SecurityTwoTone';
import MenuBookTwoTone from '@mui/icons-material/MenuBookTwoTone';
import LocalPoliceTwoTone from '@mui/icons-material/LocalPoliceTwoTone';
import WorkspacePremiumTwoTone from '@mui/icons-material/WorkspacePremiumTwoTone';
import { memo } from 'react';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { MenuButton } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';

export const MainLinks = memo(() => {
  const { baseRoutes } = useAppRoutes();
  const navigate = useNavigate();
  const links = [
    {
      title: t('main.links.support_title'),
      subtitle: t('main.links.support_subtitle'),
      icon: SupportAgentTwoTone,
      onClick: () => navigate(baseRoutes.Support),
    },
    {
      title: t('main.links.security_title'),
      subtitle: t('main.links.security_subtitle'),
      icon: SecurityTwoTone,
      onClick: () => navigate(baseRoutes.SecurityInfo),
    },
    {
      title: t('main.links.documentation_title'),
      subtitle: t('main.links.documentation_subtitle'),
      icon: MenuBookTwoTone,
      onClick: () => navigate(baseRoutes.Docs),
    },
  ];
  const linksLegal = [
    {
      title: t('terms-of-use.shortcuts'),
      subtitle: t('terms-of-use.title'),
      icon: LocalPoliceTwoTone,
      onClick: () => navigate(baseRoutes.Terms),
    },
    {
      title: t('license.shortcuts'),
      subtitle: t('license.title'),
      icon: WorkspacePremiumTwoTone,
      onClick: () => navigate(baseRoutes.License),
    },
  ];
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Divider sx={{ mt: 2 }}>
          <Typography variant="h5" component="span">
            {t('landing.starting')}
          </Typography>
        </Divider>
      </Grid>
      {links.map((e: any) => (
        <Grid size={{ lg: 4, md: 6, sm: 12, xs: 12 }} key={e.title}>
          <MenuButton {...e} />
        </Grid>
      ))}
      {linksLegal.map((e: any) => (
        <Grid size={{ md: 6, xs: 12 }} key={e.title}>
          <MenuButton {...e} />
        </Grid>
      ))}
    </Grid>
  );
});
