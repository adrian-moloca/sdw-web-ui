import React, { useState } from 'react';
import {
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  SxProps,
  Theme,
  Typography,
  TypographyVariant,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { defaultHeaderSX, defaultHeaderSmSX } from './constants';
import { Title } from './Title';
import { StyleMainCard } from './StyleMainCard';

type Size = 'large' | 'medium' | 'small' | 'tiny' | 'toolbar';

type Props = {
  id?: string;
  border?: boolean;
  expandable?: boolean;
  expandableOnHeader?: boolean;
  defaultExpanded?: boolean;
  boxShadow?: boolean;
  darkTitle?: boolean;
  divider?: boolean;
  dividerColor?: string;
  fullHeight?: boolean;
  elevation?: number;
  secondary?: React.ReactElement;
  shadow?: string;
  title?: string | React.ReactElement | React.ReactElement[];
  titleElement?: React.ReactElement | React.ReactElement[];
  subHeader?: React.ReactElement;
  superHeader?: React.ReactElement;
  avatar?: React.ReactElement | React.ReactElement[];
  subtitle?: string;
  codeHighlight?: boolean;
  content?: boolean;
  sx?: SxProps<Theme>;
  contentSX?: SxProps<Theme>;
  headerSX?: SxProps<Theme>;
  size?: Size;
  children?: React.ReactElement | React.ReactElement[];
  ref?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
};

const ExpandCollapseIconButton = ({
  showDetail,
  onClick,
}: {
  showDetail: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <IconButton aria-label="expand" size="small" onClick={onClick}>
    {showDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  </IconButton>
);

export const MainCard = ({
  id,
  expandable = false,
  expandableOnHeader = false,
  children,
  content = true,
  contentSX = {},
  darkTitle,
  divider = true,
  dividerColor,
  defaultExpanded = true,
  elevation,
  secondary,
  sx = {},
  headerSX = {},
  title,
  titleElement,
  avatar,
  superHeader,
  subtitle,
  size,
  subHeader,
  ref,
  onClick,
  ...others
}: Props) => {
  const [showDetail, setShowDetail] = useState<boolean>(defaultExpanded === true);

  const titleSizeMap: Record<string, TypographyVariant> = {
    large: 'h5',
    medium: 'h6',
    small: 'subtitle1',
    tiny: 'body1',
  };

  const titleSize: TypographyVariant = size ? (titleSizeMap[size] ?? 'h6') : 'h6';

  const handleExpandClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowDetail(!showDetail);
  };

  const getCursorStyle = () => (expandableOnHeader ? 'pointer' : 'default');

  const getHeaderStyles = (size?: Size) => {
    const commonStyles = {
      cursor: getCursorStyle(),
      ...headerSX,
    };

    if (size === 'toolbar') {
      return {
        paddingBottom: 0,
        ...commonStyles,
      };
    } else if (size === 'small') {
      return {
        ...defaultHeaderSmSX,
        ...commonStyles,
      };
    }

    return {
      ...defaultHeaderSX,
      ...commonStyles,
    };
  };

  const headerAction =
    secondary ||
    (expandable && (
      <ExpandCollapseIconButton showDetail={showDetail} onClick={handleExpandClick} />
    ));

  return (
    <StyleMainCard
      elevation={elevation ?? 0}
      onClick={() => {
        if (onClick) onClick();
      }}
      id={id}
      ref={ref}
      {...others}
      sx={sx}
    >
      {!darkTitle &&
        (title || titleElement || subtitle || subHeader || superHeader || secondary) && (
          <CardHeader
            sx={getHeaderStyles(size)}
            avatar={avatar}
            title={
              <>
                {superHeader}
                <Title title={title} titleSize={titleSize} />
                {titleElement}
                {subtitle && (
                  <Typography
                    variant="body1"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
                )}
                {subHeader}
              </>
            }
            onClick={() => {
              if (expandableOnHeader) {
                setShowDetail(!showDetail);
              }
            }}
            action={headerAction}
          />
        )}
      {darkTitle && title && (
        <CardHeader
          sx={getHeaderStyles(size)}
          avatar={avatar}
          title={
            <>
              {superHeader}
              <Title title={title} titleSize={titleSize} />
              {subtitle && (
                <Typography
                  variant="body1"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              )}
              {subHeader}
            </>
          }
          action={headerAction}
        />
      )}
      {title && divider && <Divider sx={{ bgcolor: dividerColor }} />}
      {content && showDetail && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && showDetail && children}
    </StyleMainCard>
  );
};
