import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { colors, olympicsDesignColors } from 'themes/colors';

type Breadcrumb = {
  title: string;
  path?: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
  separator?: string | ReactNode;
};

export const Breadcrumbs: React.FC<Props> = ({ breadcrumbs, separator }: Props) => {
  return (
    <MUIBreadcrumbs separator={separator} aria-label="breadcrumbs">
      {breadcrumbs.map((breadcrumb, index, array) => {
        const isLastItem = index === array.length - 1;
        const titleWeight = isLastItem ? '700' : '400';

        const title = (
          <Typography
            fontWeight={titleWeight}
            sx={[
              () => ({
                color: isLastItem ? olympicsDesignColors.base.neutral.black : colors.neutral['600'],
              }),
              (theme) =>
                theme.applyStyles('dark', {
                  color: isLastItem
                    ? olympicsDesignColors.base.neutral.white
                    : colors.neutral['300'],
                }),
            ]}
          >
            {breadcrumb.title}
          </Typography>
        );

        if (breadcrumb.path) {
          return (
            <Link to={breadcrumb.path} key={breadcrumb.title} style={{ textDecoration: 'none' }}>
              {title}
            </Link>
          );
        }

        return title;
      })}
    </MUIBreadcrumbs>
  );
};
