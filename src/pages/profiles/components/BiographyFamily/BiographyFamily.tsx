import get from 'lodash/get';
import { Grid, Typography } from '@mui/material';
import { encodeLinks } from 'pages/profiles/utils/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { t } from 'i18next';

type Props = {
  data: any;
};

export const BiographyFamily = ({ data }: Props) => {
  const familyRelations =
    get(data, 'extendedInfo.familyRelations') ?? get(data, 'extendedInfo.familyRelations_2');
  if (!familyRelations) return null;

  const markdownList = familyRelations
    .map((relation: any) => {
      const person = encodeLinks(get(relation, 'person', ''));
      const kin = get(relation, 'kin', '');
      return `- ${person}  ${kin}`;
    })
    .join('\n');
  if (Array.isArray(familyRelations)) {
    return (
      <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
        <Typography color="text.secondary" variant={'body1'}>
          {t('general.relation')}
        </Typography>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ul: ({ node, ...props }) => (
              <ul style={{ margin: '0', padding: 0, listStyleType: 'none' }} {...props} />
            ),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            li: ({ node, ...props }) => <li style={{ margin: '0', lineHeight: 1.3 }} {...props} />,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            a: ({ node, ...props }) => (
              <a {...props} rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                {props.children}
              </a>
            ),
          }}
        >
          {markdownList}
        </ReactMarkdown>
      </Grid>
    );
  }
  return null;
};
