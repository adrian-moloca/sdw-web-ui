import { Box, Typography } from '@mui/material';
import { formatText } from 'utils/text-panel';
import { Section } from 'types/text-panel';

type Props = {
  data: Section[];
};

export const LongTextPanel = ({ data }: Props) => {
  return (
    <Box sx={{ marginTop: 1 }}>
      {data.map((section, index) => (
        <Box key={`${section.title}-${index}`} marginBottom={4}>
          <Typography variant="h5" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
            {section.title}
          </Typography>
          {Array.isArray(section.content) ? (
            <Typography variant="body1" gutterBottom component={'div'}>
              <ul>
                {section.content.map((paragraph, i) => (
                  <li key={`${paragraph}-${i}`} style={{ marginBottom: 10 }}>
                    <Typography
                      variant="body1"
                      component={'span'}
                      gutterBottom
                      dangerouslySetInnerHTML={{ __html: formatText(paragraph) }}
                    />
                  </li>
                ))}
              </ul>
            </Typography>
          ) : (
            <Typography
              variant="body1"
              gutterBottom
              component={'div'}
              dangerouslySetInnerHTML={{ __html: formatText(section.content) }}
            />
          )}
          {section.list && Array.isArray(section.list) && (
            <Typography variant="body1" gutterBottom component={'div'} sx={{ ml: 2 }}>
              <ol>
                {section.list.map((paragraph, i) => (
                  <li key={`${paragraph}-${i}`}>
                    <span dangerouslySetInnerHTML={{ __html: formatText(paragraph) }} />
                  </li>
                ))}
              </ol>
            </Typography>
          )}
          {section.footer && Array.isArray(section.footer) ? (
            section.footer.map((paragraph, i) => (
              <Typography
                key={`${paragraph}-${i}`}
                variant="body1"
                gutterBottom
                component={'div'}
                dangerouslySetInnerHTML={{ __html: formatText(paragraph) }}
              />
            ))
          ) : (
            <Typography
              variant="body1"
              gutterBottom
              component={'div'}
              dangerouslySetInnerHTML={{ __html: formatText(section.footer as string) }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
