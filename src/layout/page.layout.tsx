import * as React from 'react';
import {
  PageContainer,
  PageHeader,
  PageHeaderProps,
  PageHeaderToolbar,
} from '@toolpad/core/PageContainer';
import { useNavigate } from 'react-router-dom';
import { Breakpoint } from '@mui/material';
import { t } from 'i18next';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { StyledIconButton } from 'components';

function PageToolbar() {
  const navigate = useNavigate();
  return (
    <PageHeaderToolbar>
      <StyledIconButton
        title={t('actions.buttonBack')}
        aria-label={t('actions.buttonBack')}
        onClick={() => navigate(-1)}
        size="small"
      >
        <ArrowBack fontSize="small" />
      </StyledIconButton>
    </PageHeaderToolbar>
  );
}
export function BasicPageHeader(props: Readonly<PageHeaderProps>) {
  return <PageHeader slots={{ toolbar: PageToolbar }} {...props} />;
}

interface Props {
  title: string;
  maxWidth?: Breakpoint | false;
  children: React.ReactNode;
}
export default function Layout(props: Readonly<Props>) {
  return (
    <PageContainer
      maxWidth={props.maxWidth}
      title={props.title}
      slots={{ header: BasicPageHeader }}
      slotProps={{ header: { title: props.title } }}
    >
      {props.children}
    </PageContainer>
  );
}
