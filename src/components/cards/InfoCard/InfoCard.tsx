import {
  Box,
  Button,
  CardActionArea,
  CardProps,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Fade } from 'react-awesome-reveal';
import { MainCard } from 'components/cards/MainCard';
import { BoxWithImage } from './BoxWithImage';
import { CardVariantData, ButtonConfig } from 'types/cards';
import { layout } from 'themes/layout';

type Props = CardProps & {
  card: CardVariantData;
  data?: any;
  reverse?: boolean;
  vertical?: boolean;
};

export const InfoCard = ({ card, reverse = false, vertical = false }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const variantData = card;
  const Icon = card.icon;

  const handleButtonClick = (button: ButtonConfig) => {
    if (button.route) navigate(button.route);
    if (button.onClick) button.onClick();
  };

  let flexDirection;
  if (vertical) {
    flexDirection = { xs: 'column', md: 'column' };
  } else if (reverse) {
    flexDirection = { xs: 'column', md: 'row-reverse' };
  } else {
    flexDirection = { xs: 'column', md: 'row' };
  }

  return (
    <Grid size={12}>
      <Fade direction={variantData.direction} triggerOnce>
        <MainCard border={false} content={false} sx={{ width: '100%' }}>
          <CardActionArea
            onClick={() =>
              variantData.buttons.length === 1
                ? handleButtonClick(variantData.buttons[0])
                : undefined
            }
            sx={{
              background: variantData.background,
              borderRadius: variantData.borderRadius ?? layout.radius.sm,
              width: '100%',
              py: { xs: 3, md: 5, lg: 0 },
              px: { xs: 2, md: 5, lg: 8 },
              display: 'flex',
              flexDirection,
              alignItems: 'center',
            }}
          >
            <BoxWithImage
              src={variantData.imgSrc}
              alt={variantData.imgAlt}
              sx={{
                height:
                  variantData.imageHeight !== undefined
                    ? {
                        xs: variantData.imageHeight.xs,
                        md: variantData.imageHeight.md,
                        lg: variantData.imageHeight.lg,
                      }
                    : { xs: 330, md: 380, lg: 380 },
                width: 'auto',
                maxWidth: 600,
                flexShrink: 0,
                zIndex: 2,
                filter: variantData.filter,
                marginRight: { md: 2 },
                marginBottom: { xs: 2, md: 0 },
                borderRadius: layout.radius.sm,
              }}
            />
            <Box sx={{ zIndex: 2 }}>
              <Typography variant="h2" gutterBottom>
                {variantData.title}
              </Typography>
              {variantData.subTitle && (
                <Typography
                  gutterBottom
                  variant="h1"
                  dangerouslySetInnerHTML={{ __html: variantData.subTitle }}
                />
              )}
              {variantData.content.map((text, index) => (
                <Typography
                  key={`${text}-${index}`}
                  component={'div'}
                  gutterBottom
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}
              <Stack
                direction={matchDownSM ? 'column' : 'row'}
                spacing={1}
                justifyContent={'flex-start'}
                width="100%"
                sx={{ mt: 4 }}
              >
                {variantData.buttons.map((button, index) => {
                  const { href } = button;

                  return (
                    <Button
                      key={`${button.text}-${index}`}
                      variant={button.variant ?? (href ? 'outlined' : 'contained')}
                      size="large"
                      color={button.color}
                      startIcon={button.startIcon}
                      disableElevation
                      sx={{ px: 3, py: 1.4, minWidth: 160, lineHeight: 1.2, ...button.sx }}
                      component={href ? Link : 'span'}
                      {...(href && {
                        target: '_blank',
                        href: button.href ?? '',
                        rel: 'noopener noreferrer',
                      })}
                      {...(!href && {
                        onClick: () => handleButtonClick(button),
                      })}
                    >
                      {button.text}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
            {Icon && (
              <Box
                sx={{
                  position: 'absolute',
                  right: '-35px',
                  bottom: '-35px',
                  transform: 'rotate(-25deg)',
                  color: theme.palette.divider,
                  zIndex: 0,
                }}
              >
                <Icon sx={{ fontSize: 180 }} />
              </Box>
            )}
          </CardActionArea>
        </MainCard>
      </Fade>
    </Grid>
  );
};
