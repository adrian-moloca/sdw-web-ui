import React from 'react';
import { Link } from 'react-router-dom';
import { MainCard } from 'components/cards/MainCard';
import { Button, CardActions, CardContent, Typography, Link as LinkHref } from '@mui/material';
import { t } from 'i18next';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import useAppRoutes from 'hooks/useAppRoutes';

export interface IErrorViewProps {
  supportEmail: string;
  errorMessage: string;
}

export const ErrorComponent = (props: IErrorViewProps): React.ReactElement => {
  const { baseRoutes } = useAppRoutes();
  const mailTo = `mailTo:${props.supportEmail}`;
  return (
    <MainCard
      border={false}
      boxShadow={true}
      divider={false}
      contentSX={{ pt: 0 }}
      title={t('common.errorTitle')}
    >
      <CardContent>
        <Typography variant="h5">
          {props.errorMessage ??
            'We can’t find the page you are looking for. Please try to refresh your browser, contact us, or return to the home page.'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size={'large'}
          disableElevation
          variant="contained"
          component={Link}
          to={baseRoutes.Home}
          startIcon={<HomeOutlinedIcon href={mailTo} />}
        >
          Home
        </Button>
        <Button
          size={'large'}
          disableElevation
          variant="contained"
          component={LinkHref}
          startIcon={<EmailOutlinedIcon href={mailTo} />}
        >
          {t('common.contactMe')}
        </Button>
      </CardActions>
    </MainCard>
  );
};
