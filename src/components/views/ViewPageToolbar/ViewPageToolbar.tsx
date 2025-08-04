import { useNavigate } from 'react-router-dom';
import { useAppModel } from 'hooks';
import { ActionType, EntityType } from 'models';
import { PageHeaderToolbar } from '@toolpad/core';
import { t } from 'i18next';
import ArrowBack from '@mui/icons-material/ArrowBack';
import EditOutlined from '@mui/icons-material/EditOutlined';
import type { ViewHeaderProps } from 'types/views';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, drawerActions, RootState } from 'store';
import { StyledIconButton } from 'components/tables';

export const ViewPageToolbar = (props: ViewHeaderProps) => {
  const navigate = useNavigate();
  const { getIconBase } = useAppModel();
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[props.config.type]?.open);

  if (
    props.config.type === EntityType.Competition ||
    props.config.type === EntityType.Person ||
    props.config.type === EntityType.Team ||
    props.config.type === EntityType.Horse ||
    props.config.type === EntityType.Organization ||
    props.config.type === EntityType.Noc
  )
    return (
      <PageHeaderToolbar>
        <StyledIconButton
          aria-label={isOpen ? t('actions.collapse') : t('actions.expand')}
          onClick={() =>
            dispatch(drawerActions.toggleProfileOpen({ profileType: props.config.type }))
          }
          sx={{ alignItems: 'center' }}
          title={isOpen ? t('actions.collapse') : t('actions.expand')}
        >
          {isOpen ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </StyledIconButton>
        <StyledIconButton
          title={t('actions.buttonBack')}
          aria-label={t('actions.buttonBack')}
          color="secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowBack fontSize="small" />
        </StyledIconButton>
      </PageHeaderToolbar>
    );

  return (
    <PageHeaderToolbar>
      {props.toolbar
        ?.filter((e) => !e.condition || e.condition(props.element))
        .map((tool: any) => {
          const Icon = getIconBase(tool.type);
          return (
            <StyledIconButton
              key={tool.type}
              onClick={() => tool.handleClick(props.element ?? {})}
              aria-label={ActionType[tool.type]}
            >
              {Icon ? <Icon fontSize="small" /> : null}
            </StyledIconButton>
          );
        })}
      {props.canEdit && (
        <StyledIconButton
          aria-label={t('actions.buttonEditFields')}
          onClick={props.handleOnClickEdit}
        >
          <EditOutlined fontSize="small" />
        </StyledIconButton>
      )}
      <StyledIconButton
        title={t('actions.buttonBack')}
        aria-label={t('actions.buttonBack')}
        onClick={() => navigate(-1)}
      >
        <ArrowBack fontSize="small" />
      </StyledIconButton>
    </PageHeaderToolbar>
  );
};
