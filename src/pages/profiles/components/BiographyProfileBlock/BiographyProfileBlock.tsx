import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { TemplateType } from 'models';
import { containsHtmlTags, humanize, isJson, isObject } from '_helpers';
import { FieldTemplate } from 'components';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import {
  autoLinkUrls,
  containsUrl,
  encodeLinks,
  formatHeadingsAndQuotes,
  needsEncoding,
} from '../../utils/markdown';
import remarkGfm from 'remark-gfm';
import { getWithExtended } from 'pages/profiles/utils/getters';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { AnchorHTMLAttributes, ClassAttributes, HTMLAttributes } from 'react';

type Props = {
  data: any;
  field: string;
  title: string;
  markDown?: boolean;
  secondaryField?: string;
  bold?: boolean;
};

type MarkdownAnchorProps = ClassAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: React.ReactNode;
    href?: string;
  };

type MarkdownParagraphProps = ClassAttributes<HTMLParagraphElement> &
  HTMLAttributes<HTMLParagraphElement>;

const MarkdownLink = ({ href, children, ...rest }: MarkdownAnchorProps) => {
  if (href?.startsWith('/person/')) {
    return <Link to={href}>{children}</Link>;
  }
  return (
    <a href={href} rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
};

const MarkdownParagraph = ({ children, ...props }: MarkdownParagraphProps) => (
  <p style={{ margin: '0' }} {...props}>
    {children}
  </p>
);

const ExternalLink = ({ children, ...props }: MarkdownAnchorProps) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: 'blue', textDecoration: 'underline' }}
  >
    {children}
  </a>
);

const calculateGridSize = (isLarge: any, isShort: any) => {
  let lgSize = 6;
  if (isLarge) {
    lgSize = 12;
  } else if (isShort) {
    lgSize = 4;
  }
  const gridSize = { xs: 12, sm: 6, md: isLarge ? 12 : 6, lg: lgSize };
  return gridSize;
};

export const BiographyProfileBlock = (props: Props) => {
  const value = getWithExtended(props.data, props.field);
  if (!value || (typeof value === 'string' && value.trim() === ',')) return null;

  const title = props.title ?? t('general.biography');

  const isHtml = typeof value === 'string' && containsHtmlTags(value);
  const isLarge = value.length > 500;
  const isShort = value.length <= 45;

  const renderMarkdown = (content: string, components: any) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={isHtml ? [rehypeRaw, rehypeSanitize] : []}
      skipHtml={!isHtml}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );

  if (props.markDown === true || needsEncoding(value)) {
    return (
      <Grid key={props.field} size={calculateGridSize(isLarge, isShort)}>
        <Typography color="text.secondary" variant={'body1'}>
          {title}
        </Typography>
        {renderMarkdown(encodeLinks(formatHeadingsAndQuotes(value)), { a: MarkdownLink })}
      </Grid>
    );
  }

  if (containsUrl(value)) {
    return (
      <Grid key={props.field} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
        <Typography color="text.secondary" variant={'body1'}>
          {title}
        </Typography>
        {renderMarkdown(autoLinkUrls(value), { p: MarkdownParagraph, a: ExternalLink })}
      </Grid>
    );
  }

  if (isObject(value)) {
    return (
      <Grid key={props.field} size={calculateGridSize(isLarge, isShort)}>
        <Typography color="text.secondary" variant={'body2'}>
          {title}
        </Typography>
        {Object.entries(value).map(([key, value]) => (
          <Typography key={key}>
            <Typography component="span" sx={{ color: 'text.secondary', marginRight: 1 }}>
              {humanize(key)}:
            </Typography>
            {String(value)}
          </Typography>
        ))}
      </Grid>
    );
  }

  if (isJson(value)) {
    return (
      <Grid key={props.field} size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
        <Typography color="text.secondary" variant={'body2'}>
          {title}
        </Typography>
        <FieldTemplate type={TemplateType.Json} value={value} />
      </Grid>
    );
  }

  return (
    <Grid key={props.field} size={calculateGridSize(isLarge, isShort)}>
      <Typography color="text.secondary" variant="body1">
        {title}
      </Typography>
      {renderMarkdown(formatHeadingsAndQuotes(value), { p: MarkdownParagraph })}
    </Grid>
  );
};
