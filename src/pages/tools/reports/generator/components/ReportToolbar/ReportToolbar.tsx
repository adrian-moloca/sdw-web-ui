import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  IconButton,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import type { BreadcrumbItem } from 'types/tools';
import { LinkRouter } from '../LinkRouter';
import { BreadCrumbItem } from '../BreadCrumbItem';

type Props = {
  data: Array<BreadcrumbItem>;
  sx?: SxProps;
};

const linkSX = {
  display: 'flex',
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center',
};

export const ReportToolbar = ({ data, sx }: Props) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const iconStyle = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main,
  };

  return (
    <Card
      sx={{
        marginBottom: 0,
        border: '1px solid',
        borderColor: theme.palette.divider,
        background: theme.palette.background.default,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ p: 1, pl: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid>
            <Breadcrumbs
              aria-label="page breadCrumb"
              sx={{ ...sx }}
              maxItems={matchDownSM ? 3 : 6}
              separator={
                <ArrowForwardIosOutlinedIcon
                  sx={{ stroke: 1.5, fontSize: '1rem', color: theme.palette.secondary.main }}
                />
              }
            >
              {matchDownSM ? (
                <Typography
                  component={LinkRouter}
                  to="/"
                  color="inherit"
                  variant="body1"
                  underline="hover"
                  sx={linkSX}
                >
                  <HomeOutlinedIcon sx={iconStyle} />
                </Typography>
              ) : (
                <Typography
                  component={LinkRouter}
                  to="/"
                  color="inherit"
                  variant="body1"
                  underline="hover"
                  sx={linkSX}
                >
                  <HomeOutlinedIcon sx={iconStyle} />
                  {t('general.home')}
                </Typography>
              )}
              {data.map((e: any) => (
                <BreadCrumbItem key={e.title} data={e} />
              ))}
            </Breadcrumbs>
          </Grid>
          <Grid>
            {!matchDownSM ? (
              <Button
                aria-label="back"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIosOutlinedIcon />}
              >
                {t('actions.buttonBack')}
              </Button>
            ) : (
              <IconButton
                color="primary"
                aria-label="back"
                size="small"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIosOutlinedIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};
