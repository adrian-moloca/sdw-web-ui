import React, { type ReactElement, useMemo, memo, isValidElement, Fragment } from 'react';
import { Typography, TypographyVariant } from '@mui/material';

type Props = {
  title?: string | ReactElement | ReactElement[];
  titleSize?: TypographyVariant; // Customize your title sizes as needed
};

const TitleComponent = ({ title, titleSize }: Props) => {
  const titleContent = useMemo(() => {
    if (typeof title === 'string') {
      return (
        <Typography variant={titleSize} sx={{ lineHeight: 1.3 }}>
          {title}
        </Typography>
      );
    }

    if (isValidElement(title)) {
      return title;
    }

    if (Array.isArray(title)) {
      return (
        <>
          {title.map((t, index) =>
            React.isValidElement(t) ? <Fragment key={`${t}-${index}`}>{t}</Fragment> : null
          )}
        </>
      );
    }

    return null;
  }, [title, titleSize]);

  if (!title) return null;

  return titleContent;
};

export const Title = memo(TitleComponent);
