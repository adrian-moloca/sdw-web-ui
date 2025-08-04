import { Button, ButtonGroup, CardActions } from '@mui/material';
import { t } from 'i18next';
import { ActionType } from 'models';
import { useAppModel } from 'hooks';

type Props = {
  hasMerge: boolean;
  canMerge: boolean;
  canEdit: boolean;
  handleOnClickValidate?: () => void;
  handleOnClickMerge?: () => void;
  handleOnClickEdit: () => void;
  handleOnClickHide?: () => void;
};

export const ProfileButtons = (props: Props) => {
  const { getIconBase } = useAppModel();
  const IconEdit = getIconBase(ActionType.Edit);
  const IconValidate = getIconBase(ActionType.Validate);
  const IconMerge = getIconBase(ActionType.Merge);
  const IconHide = getIconBase(ActionType.HideFields);
  return (
    <CardActions sx={{ width: '100%' }}>
      <ButtonGroup sx={{ width: '100%' }} variant="outlined" color="secondary">
        {props.hasMerge && props.handleOnClickValidate && (
          <Button
            startIcon={<IconValidate />}
            onClick={props.handleOnClickValidate}
            sx={{ width: '100%' }}
          >
            {t('actions.buttonValidate')}
          </Button>
        )}
        {props.canMerge && props.handleOnClickMerge && (
          <Button
            startIcon={<IconMerge />}
            onClick={props.handleOnClickMerge}
            sx={{ width: '100%' }}
          >
            {t('actions.buttonMerge')}
          </Button>
        )}
        {props.canEdit && props.handleOnClickHide && (
          <Button startIcon={<IconHide />} onClick={props.handleOnClickHide} sx={{ width: '100%' }}>
            {t('actions.buttonHideShowEntity')}
          </Button>
        )}
        {props.canEdit && (
          <Button startIcon={<IconEdit />} onClick={props.handleOnClickEdit} sx={{ width: '100%' }}>
            {t('actions.buttonEdit')}
          </Button>
        )}
      </ButtonGroup>
    </CardActions>
  );
};
