import { DisplayBox } from '../../DisplayBox';
import { t } from 'i18next';
import { TemplateType } from 'models';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';

export const IngestInfo = (props: { element: any }) => {
  if (!props.element?.sources) return null;
  const sourceValue = Array.isArray(props.element.sources)
    ? props.element.sources.join(', ')
    : props.element.sources;
  return (
    <>
      <DisplayBox field="" title={t('common.code')} value={props.element.code} />
      <DisplayBox
        field=""
        title={t('common.externalIds')}
        template={TemplateType.TextListPopup}
        value={props.element.externalIds}
        icon={ContactsOutlinedIcon}
      />
      <DisplayBox
        field=""
        title={t('common.sources')}
        template={TemplateType.TextWithIcon}
        value={sourceValue}
        icon={ShuffleOutlinedIcon}
      />
      <DisplayBox
        field=""
        title={t('common.extendedInfo')}
        template={TemplateType.JsonPopUp}
        value={props.element.extendedInfo}
      />
    </>
  );
};
