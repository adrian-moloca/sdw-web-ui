import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { PageContainer } from '@toolpad/core';
import bannerOg from 'assets/images/team.jpeg';
import type { Section } from 'types/text-panel';
import { SmallTextPanel } from 'components';
import { DocCard } from './components';

const docs = [
  {
    name: 'SDW Platform',
    category: 'Confluence',
    link: 'https://ocsproduct.atlassian.net/wiki/spaces/STP/pages/571605380/SDW+101?atlOrigin=eyJpIjoiNTI1MzQ1YmY2ZjJiNGEwMmJlMGM5MzczZjY3YTcxYWQiLCJwIjoiYyJ9',
    benefits: [
      'Overview',
      'Product Mission and Vision',
      'Historical Results Catalogue',
      'API Services Catalogue',
    ],
  },
  {
    name: 'SDW Architecture',
    category: 'Confluence',
    link: 'https://ocsproduct.atlassian.net/wiki/spaces/SDWTEC/pages/1016922367/Architecture+Components',
    benefits: [
      'Conceptual Architecture',
      'Components Architecture',
      'Infrastructure Architecture',
      'Security Architecture',
    ],
  },
  {
    name: 'USDM Data Model',
    category: 'Confluence',
    link: 'https://ocsproduct.atlassian.net/wiki/spaces/SDWTEC/pages/1034747905/USDM+Model',
    benefits: [
      'Competitions Hierarchy',
      'Individuals and Teams',
      'Organizations and Venues',
      'USDM Queries and Examples',
    ],
  },
  {
    name: 'SDW Guidelines',
    link: 'https://ocsproduct.atlassian.net/wiki/spaces/SDWTEC/pages/1044971561/Guidelines',
    category: 'Confluence',
    benefits: [
      'Software Development Guidelines',
      'ODF Invalidation: Messages + test Scenarios',
      'Olympic Data Feed (ODF)',
    ],
  },
  {
    name: 'GDS Guidelines',
    link: 'https://ocsproduct.atlassian.net/wiki/spaces/GDS2024/pages/1017184493/Guidelines',
    category: 'Confluence',
    benefits: ['Work with data', 'Work with metadata', 'Dependencies'],
  },
];

const DocPage = () => {
  const data = t('documentation.content', { returnObjects: true }) as Section[];

  return (
    <PageContainer title={t('navigation.Doc')}>
      <Grid size={12}>
        <Typography gutterBottom>{t('documentation.intro')}</Typography>
      </Grid>
      <Grid size={12}>
        <img
          src={bannerOg}
          alt={t('main.project.name')}
          style={{ height: 'auto', width: '100%', maxHeight: 300, objectFit: 'cover' }}
        />
      </Grid>
      <Grid size={12}>
        <SmallTextPanel data={data} />
      </Grid>
      <Grid container spacing={2}>
        {docs.map((plan, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <DocCard dataItem={plan} />
          </Grid>
        ))}
      </Grid>
      <Grid size={12}>
        <SmallTextPanel
          data={t('documentation.footerContent', { returnObjects: true }) as Section[]}
        />
      </Grid>
    </PageContainer>
  );
};

export default DocPage;
