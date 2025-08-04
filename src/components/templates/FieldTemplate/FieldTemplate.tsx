import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Rating,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import dayjs from 'dayjs';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import slice from 'lodash/slice';
import split from 'lodash/split';
import uniqBy from 'lodash/uniqBy';
import ContentCopy from '@mui/icons-material/ContentCopy';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Grid } from '@mui/system';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';
import NewReleasesTwoToneIcon from '@mui/icons-material/NewReleasesTwoTone';
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import { ITemplateProps } from './types';
import { extractCode, TemplateIcon } from './utils';
import { AthleteAvatar, CountryChip, DisciplineChip, TypographyLink } from 'components';
import {
  formatElapsedTime,
  formatFileSize,
  formatMasterCode,
  formatSocialMediaLink,
  getDisciplineCode,
  getJson,
  humanize,
  isNullOrEmpty,
} from '_helpers';
import { EntityType, TemplateType } from 'models';
import { useStoreCache } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';
import baseConfig from 'baseConfig';

const FieldTemplateBase = (props: Readonly<ITemplateProps>): React.ReactElement => {
  const theme = useTheme();
  const { getDisciplineEntry, dataInfo } = useStoreCache();
  const { getDetailRoute } = useAppRoutes();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const [, setCopied] = useState<string | null>(null); // Track copied item
  // Copy text to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text); // Show copied feedback for the specific item
    setTimeout(() => setCopied(null), 1500); // Reset feedback after 1.5 seconds
  };
  const id = open ? 'simple-popover' : undefined;
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const typoSize = props.size == 'xs' ? 'body2' : 'body1';
  const fontSize =
    props.size == 'xs' ? theme.typography.body2.fontSize : theme.typography.body1.fontSize;

  const renderTemplate = () => {
    switch (props.type) {
      case TemplateType.IsoCode:
        return (
          <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
            <CountryChip code={props.value} size="small" hideTitle={false} />
          </Stack>
        );
      case TemplateType.Chip:
      case TemplateType.ChipOutlined:
        return (
          <Chip
            label={props.value}
            size="small"
            variant={props.type === TemplateType.ChipOutlined ? 'outlined' : 'filled'}
            sx={{ my: 0.25 }}
          />
        );
      case TemplateType.Image: {
        const title = props.title?.toLocaleString().toUpperCase() ?? t('common.unknown');
        return (
          <AthleteAvatar
            size={props.size == 'sm' ? '24px' : '40px'}
            alt={title}
            src={props.value}
          />
        );
      }
      case TemplateType.Number:
        return (
          <Typography variant={typoSize}>
            {props.icon && (
              <props.icon
                title={props.value}
                xs={{ marginRight: 1, color: props.color ?? undefined }}
              />
            )}
            {props.value.toLocaleString()}
          </Typography>
        );
      case TemplateType.Date:
        return (
          <TypographyLink
            value={
              props.value ? dayjs(props.value).format(baseConfig.dayDateFormat).toUpperCase() : '-'
            }
            typoSize={typoSize}
          />
        );
      case TemplateType.MasterData:
        if (props.value) {
          const displayValue =
            props.value.indexOf('$') > -1 ? props.value.split('$')[1] : props.value;
          return <Typography variant={typoSize}>{displayValue}</Typography>;
        }
        return '';
      case TemplateType.DateTime:
        return (
          <TypographyLink
            value={
              props.value
                ? dayjs(props.value).format(baseConfig.dateTimeDateFormat).toUpperCase()
                : '-'
            }
            typoSize={typoSize}
          />
        );
      case TemplateType.ElapsedTime:
        return (
          <TypographyLink
            value={props.value ? formatElapsedTime(props.value) : '-'}
            typoSize={typoSize}
          />
        );
      case TemplateType.FileSize:
        return (
          <TypographyLink
            value={props.value ? formatFileSize(props.value) : '-'}
            typoSize={typoSize}
          />
        );
      case TemplateType.Url:
        return <TypographyLink value={props.value} route={props.value} typoSize={typoSize} />;
      case TemplateType.SocialMedia: {
        if (!props.value) return null;
        return (
          <TypographyLink
            value={formatSocialMediaLink(props.value)}
            route={props.value}
            typoSize={typoSize}
          />
        );
      }
      case TemplateType.CompetitionCategory: {
        if (!props.value) return null;
        if (props.value instanceof Array && props.value.length > 0) {
          return (
            <Stack>
              {props.value
                .filter((e) => !isNullOrEmpty(e))
                .map((e: string) => {
                  const value = dataInfo.categories.find((y: any) => y.key === e);
                  if (value)
                    return (
                      <Typography key={e} variant={typoSize}>
                        {value?.title}
                      </Typography>
                    );
                  return (
                    <Typography key={e} variant={typoSize}>
                      {humanize(formatMasterCode(e))}
                    </Typography>
                  );
                })}
            </Stack>
          );
        }
        return null;
      }
      case TemplateType.Discipline: {
        if (props.value) {
          if (props.value instanceof Array) {
            if (props.value.length > 0) {
              return (
                <Stack>
                  {props.value
                    .filter((e) => !isNullOrEmpty(e))
                    .map((e: string) => {
                      const external = e.split('|');
                      const value = e.indexOf('|') > -1 ? external[external.length - 1] : e;
                      const display = getDisciplineEntry(value);
                      if (display)
                        return (
                          <Typography
                            key={e}
                            variant={typoSize}
                          >{`${display.key.replace('SDIS$', '')} - ${display.value}`}</Typography>
                        );
                      return (
                        <Typography key={e} variant={typoSize}>
                          ANY
                        </Typography>
                      );
                    })}
                </Stack>
              );
            }
            return <Typography variant={typoSize}>NONE</Typography>;
          }
          const display = getDisciplineEntry(props.value);
          if (display)
            return (
              <Typography
                variant={typoSize}
              >{`${display.key.replace('SDIS$', '')} - ${display.value}`}</Typography>
            );
          return <Typography variant={typoSize}>ANY</Typography>;
        }
        return <Typography variant={typoSize}>ANY</Typography>;
      }
      case TemplateType.Route:
        return <TypographyLink value={props.value} route={props.route} typoSize={typoSize} />;
      case TemplateType.RouteDirect:
        return (
          <TypographyLink
            value={props.value}
            route={props.route}
            typoSize={typoSize}
            direct={true}
          />
        );
      case TemplateType.Html:
        return (
          <Typography
            variant={typoSize}
            component={'div'}
            dangerouslySetInnerHTML={{ __html: props.value }}
          />
        );

      case TemplateType.HtmlPopUp: {
        return (
          <>
            <Button
              aria-describedby={id}
              variant="text"
              sx={{ p: 0, fontWeight: 400 }}
              startIcon={<MoreVertOutlinedIcon />}
              onClick={handleClick}
            >
              {t('actions.moreInfo')}
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Box sx={{ p: 2, minWidth: '150px' }}>
                {props.title && (
                  <Typography variant={props.size == 'xs' ? 'h5' : 'h4'}>{props.title}</Typography>
                )}
                <Typography
                  variant={typoSize}
                  component={'div'}
                  dangerouslySetInnerHTML={{ __html: props.value }}
                />
              </Box>
            </Popover>
          </>
        );
      }
      case TemplateType.Rating:
        return <Rating name="read-only" value={props.value} readOnly size="small" />;
      case TemplateType.TextLong:
        return (
          <TypographyLink
            value={props.value ? props.value.substring(0, 400) : '-'}
            route={props.route}
            typoSize={typoSize}
          />
        );
      case TemplateType.Timestamp:
        return (
          <TypographyLink
            value={props.value ? dayjs.unix(props.value / 1000).format('LLL') : '-'}
            route={props.route}
            typoSize={typoSize}
          />
        );
      case TemplateType.CompetitionInfo:
        if (props.value) {
          const values = Array.isArray(props.value) ? props.value : split(props.value, ',');
          if (!Array.isArray(values)) return null;
          return values.map((competition: any) => (
            <div key={competition.id}>
              <TypographyLink
                value={competition.title}
                route={getDetailRoute(EntityType.Competition, competition.id)}
                typoSize={typoSize}
              />
            </div>
          ));
        }
        return null;

      case TemplateType.ExternalIds:
        if (props.value) {
          const values = Array.isArray(props.value) ? props.value : split(props.value, ',');
          if (!Array.isArray(values)) return null;
          return (
            <List sx={{ p: 0 }} tabIndex={0}>
              {values
                .filter((e) => !isNullOrEmpty(e))
                .map((e: string) => {
                  if (e.startsWith('NF$')) {
                    return (
                      <ListItem sx={{ py: 0 }} key={e}>
                        <ListItemText
                          primary={'NF'}
                          sx={{ textAlign: 'left', margin: 0, fontSize: theme.typography.body2 }}
                        />
                        <ListItemText
                          primary={e.replace('NF$', '')}
                          sx={{
                            textAlign: 'right',
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            fontSize: theme.typography.body2,
                          }}
                        />
                      </ListItem>
                    );
                  }
                  const eValues = e.split('|');
                  const code = eValues.slice(2).join('|');
                  const isLong = code.length > 18;
                  const shortCode = extractCode(code) ?? code.substring(0, 14);
                  return (
                    <ListItem sx={{ py: 0 }} key={e}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            {eValues[0]}
                          </Typography>
                        }
                        sx={{ textAlign: 'left', margin: 0 }}
                      />
                      <Tooltip title={code}>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                              spacing={1}
                            >
                              <Typography variant="body2">
                                {isLong ? `${shortCode}...` : code}
                              </Typography>
                              <IconButton
                                aria-label="Copy to clipboard"
                                size="small"
                                sx={{ p: 0 }}
                                onClick={(event) => {
                                  event.stopPropagation(); // Prevent tooltip from closing on click
                                  handleCopy(code);
                                }}
                              >
                                <ContentCopy
                                  fontSize="small"
                                  sx={{ fontSize: '0.9rem' }}
                                  aria-label="Copy to clipboard"
                                />
                              </IconButton>
                            </Stack>
                          }
                          sx={{ textAlign: 'right', margin: 0, fontSize: theme.typography.body2 }}
                        />
                      </Tooltip>
                    </ListItem>
                  );
                })}
            </List>
          );
        }
        return null;
      case TemplateType.TextList:
        if (props.value) {
          const values = Array.isArray(props.value) ? props.value : split(props.value, ',');
          if (!Array.isArray(values)) return null;
          return (
            <>
              {values
                .filter((e) => !isNullOrEmpty(e))
                .map((e: string, i: number) => (
                  <TemplateIcon
                    key={i}
                    icon={props.icon ?? BookmarkBorderOutlinedIcon}
                    size={props.size}
                    display={e?.trim()}
                  />
                ))}
            </>
          );
        }
        return null;
      case TemplateType.TextListPopup: {
        if (props.value && Array.isArray(props.value))
          return (
            <>
              <Button
                aria-describedby={id}
                variant="text"
                sx={{ p: 0, color: 'text.primary', fontWeight: 400 }}
                startIcon={<MoreVertOutlinedIcon />}
                onClick={handleClick}
              >
                {t('actions.moreInfo')}
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <Stack sx={{ p: 2, minWidth: '150px', alignItems: 'flex-start' }}>
                  {props.value
                    .filter((e: any) => !isNullOrEmpty(e))
                    .map((e: string, i: number) => (
                      <TemplateIcon
                        key={i}
                        icon={props.icon ?? BookmarkBorderOutlinedIcon}
                        size={props.size}
                        display={e?.trim()}
                      />
                    ))}
                </Stack>
              </Popover>
            </>
          );
        return null;
      }
      case TemplateType.Events:
        return (
          <Stack>
            {props.value
              .filter((e: any) => !isNullOrEmpty(e))
              .map((e: any) => (
                <TypographyLink
                  key={e.id}
                  value={e.title}
                  route={`/events/${e.id}`}
                  typoSize={typoSize}
                />
              ))}
          </Stack>
        );
      case TemplateType.Country:
        if (!props.value) return null;
        return (
          <CountryChip
            code={props.value}
            title={props.title}
            hideTitle={props.withText === false}
            size={props.size === 'sm' ? 'small' : props.size === '1x' ? 'medium' : 'standard'}
          />
        );
      case TemplateType.ListCountry:
        if (!props.value || props.value.length == 0) return null;
        return (
          <Stack direction={'row'} spacing={0.2}>
            {props.value
              .filter((e: any) => !isNullOrEmpty(e))
              .map((e: any) => (
                <Stack key={e.code} direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                  <CountryChip
                    code={e.code}
                    title={e.title}
                    prefix={props.title}
                    size={
                      props.size === 'sm' ? 'small' : props.size === '1x' ? 'medium' : 'standard'
                    }
                    hideTitle={matchesXs || props.value.length > 1 || props.withText === false}
                  />
                </Stack>
              ))}
          </Stack>
        );
      case TemplateType.ListDiscipline: {
        if (!props.value || props.value.length == 0) return null;
        const disciplines = slice(props.value, 0, 10)
          .filter((e: any) => !isNullOrEmpty(e))
          .map((e: any) => {
            if (typeof e === 'string') {
              const display = getDisciplineEntry(e.toString());
              return display
                ? { code: getDisciplineCode(display.key), title: display.value }
                : { code: getDisciplineCode(e), title: e.toString() };
            }
            return { code: getDisciplineCode(e.code), title: e.title?.toString() };
          });

        return (
          <Stack direction={'row'} spacing={0.4}>
            {uniqBy(disciplines, 'code').map((e: any, i: number) => {
              return (
                <Stack
                  key={`${e.code}${i}`}
                  direction={'row'}
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <DisciplineChip
                    code={e.code}
                    title={e.title}
                    prefix={props.title}
                    size={
                      props.size === 'sm' ? 'small' : props.size === '1x' ? 'medium' : 'standard'
                    }
                    hideTitle={matchesXs || props.value.length > 1 || props.withText === false}
                  />
                </Stack>
              );
            })}
          </Stack>
        );
      }
      case TemplateType.BlockDiscipline:
        if (!props.value || props.value.length == 0) return null;
        return (
          <Grid
            container
            spacing={0.4}
            alignContent={'center'}
            justifyContent={'center'}
            sx={{ p: 1 }}
          >
            {props.value
              .filter((e: any) => !isNullOrEmpty(e))
              .map((e: any, i: number) => (
                <Grid key={`${e.code}${i}`} size="auto">
                  <DisciplineChip
                    code={e.code}
                    title={e.title}
                    prefix={props.title}
                    size={
                      props.size === 'sm' ? 'small' : props.size === '1x' ? 'medium' : 'standard'
                    }
                    hideTitle={matchesXs || props.value.length > 1 || props.withText === false}
                  />
                </Grid>
              ))}
          </Grid>
        );
      case TemplateType.Team:
        if (!props.value) return null;
        return (
          <TypographyLink
            key={props.value.id}
            value={props.value.participationName}
            route={`/participants/${props.value.id}`}
            typoSize={typoSize}
          />
        );

      case TemplateType.Organization:
        if (props.value)
          return (
            <TypographyLink
              key={props.value.id}
              value={props.value.name}
              route={`/organizations/${props.value.id}`}
              typoSize={typoSize}
            />
          );
        return null;
      case TemplateType.Tags:
        if (props.value) {
          const tagValues = Array.isArray(props.value)
            ? props.value
                ?.filter((e: any) => !isNullOrEmpty(e))
                .map((e: any) => e)
                .join(', ')
            : props.value;
          return <Typography variant={typoSize}>{tagValues}</Typography>;
        }
        return '';
      case TemplateType.ExpandableTags:
        if (props.value) {
          const tagValues = Array.isArray(props.value)
            ? props.value?.filter((e: any) => !isNullOrEmpty(e))
            : [props.value];
          const toolTips = tagValues.map((e: any) => e).join('<br/>');
          const numValues = tagValues.length;
          return (
            <Tooltip
              arrow
              title={
                <Typography
                  variant="body2"
                  sx={{ color: 'white' }}
                  component={'div'}
                  dangerouslySetInnerHTML={{ __html: toolTips }}
                />
              }
            >
              <Chip
                variant="outlined"
                size="small"
                icon={
                  <LocalOfferOutlinedIcon
                    color={numValues > 0 ? 'primary' : 'secondary'}
                    fontSize="small"
                  />
                }
                label={numValues}
              />
            </Tooltip>
          );
        }
        return '';
      case TemplateType.Email:
        if (props.value)
          return (
            <Typography variant={typoSize}>
              <TemplateIcon icon={EmailOutlinedIcon} size={props.size} display={props.value} />
            </Typography>
          );
        return null;
      case TemplateType.TextWithIcon:
        return (
          <Chip
            size="small"
            variant="outlined"
            sx={{ fontSize }}
            icon={
              props.icon ? <props.icon fontSize="small" /> : <PublicOutlinedIcon fontSize="small" />
            }
            label={props.value}
          />
        );
      case TemplateType.TextFormatted:
        return (
          <Typography variant={typoSize} component={'pre'} sx={{ marginBottom: 2 }}>
            {props.value.replace(/\t/g, '')}
          </Typography>
        );
      case TemplateType.QueryStatus:
        return (
          <Chip
            size="small"
            variant="outlined"
            sx={{ border: 'none!important' }}
            icon={
              props.value == 'False' ? (
                <CheckOutlinedIcon color="success" fontSize="small" />
              ) : (
                <CloseOutlinedIcon color="error" fontSize="small" />
              )
            }
            label={
              <Typography>
                {props.value == 'False' ? t('general.processed') : t('common.failed')}
              </Typography>
            }
          />
        );
      case TemplateType.Status:
        if (!props.value) return '';
        return (
          <Chip
            size="small"
            variant="outlined"
            sx={{ border: 'none!important' }}
            icon={
              props.value.toUpperCase() == 'OK' || props.value.toUpperCase() == 'ACTIVE' ? (
                <CheckCircleOutlineOutlinedIcon color="success" fontSize="small" />
              ) : props.value.toUpperCase() == 'WARNING' ||
                props.value.toUpperCase() == 'SKIPPED' ? (
                <CheckCircleOutlineOutlinedIcon color="warning" fontSize="small" />
              ) : (
                <CancelOutlinedIcon color="error" fontSize="small" />
              )
            }
            label={<Typography>{humanize(props.value)}</Typography>}
          />
        );
      case TemplateType.Json:
        if (props.value) {
          try {
            const jsonObject = getJson(props.value);
            if (!jsonObject) return null;
            return (
              <JsonView data={jsonObject} shouldExpandNode={allExpanded} style={defaultStyles} />
            );
            // eslint-disable-next-line
          } catch (error) {
            return null;
          }
        } else return null;

      case TemplateType.JsonPopUp: {
        if (props.value) {
          try {
            const jsonObject = getJson(props.value);
            if (!jsonObject || !Object.keys(jsonObject).length) return null;
            return (
              <>
                <Button
                  aria-describedby={id}
                  variant={'text'}
                  size={props.size === 'sm' ? 'small' : undefined}
                  sx={{ p: 0, color: 'text.primary', fontWeight: 400 }}
                  startIcon={<MoreVertOutlinedIcon />}
                  onClick={handleClick}
                >
                  {t('actions.moreInfo')}
                </Button>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <JsonView
                      data={jsonObject}
                      shouldExpandNode={allExpanded}
                      style={defaultStyles}
                    />
                  </Box>
                </Popover>
              </>
            );
            // eslint-disable-next-line
          } catch (error) {
            return null;
          }
        } else return null;
      }
      case TemplateType.NoMappings:
        return (
          <Chip
            size="small"
            variant="outlined"
            sx={{ fontSize }}
            icon={
              props.value > 0 ? (
                <CheckCircleOutlineOutlinedIcon color="success" fontSize="small" />
              ) : (
                <CancelOutlinedIcon color="error" fontSize="small" />
              )
            }
            label={props.value}
          />
        );
      case TemplateType.SensitiveInfo:
        return (
          <Chip
            size="small"
            variant="outlined"
            sx={{ fontSize, borderWidth: 0, my: 0, px: 0, mx: 0 }}
            icon={
              props.value === true ? (
                <NewReleasesTwoToneIcon color="warning" fontSize="small" />
              ) : (
                <VerifiedTwoToneIcon color="primary" fontSize="small" />
              )
            }
            label={props.value === true ? t('common.invalid') : t('common.verified')}
          />
        );
      default:
        return (
          <Chip
            size="small"
            variant="outlined"
            icon={
              props.value === true || props.value === 'True' ? (
                <CheckBoxOutlinedIcon fontSize="small" />
              ) : (
                <CheckBoxOutlineBlankOutlinedIcon fontSize="small" />
              )
            }
            sx={{ fontSize, borderWidth: 0, my: 0, px: 0, mx: 0 }}
            label={
              props.value === true || props.value === 'True' ? t('common.yes') : t('common.no')
            }
          />
        );
    }
  };
  return <>{renderTemplate()}</>;
};

const FieldTemplatePropsAreEqual = (prev: ITemplateProps, next: ITemplateProps) => {
  return (
    prev.type === next.type &&
    prev.value === next.value &&
    prev.color === next.color &&
    prev.size === next.size &&
    prev.icon === next.icon &&
    prev.route === next.route
  );
};

export const FieldTemplate = React.memo(FieldTemplateBase, FieldTemplatePropsAreEqual);
