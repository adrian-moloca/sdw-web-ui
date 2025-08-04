import RemoveCircleOutlineOutlined from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { t } from 'i18next';
import { MasterData } from 'models';
import { GenericResult } from '../GenericResult';
import { useStoreCache } from 'hooks';

type Props = {
  value: string;
  valueType: string;
  irm: string;
};

export const IrmResult = ({ value, valueType, irm }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  if (irm) {
    return (
      <GenericResult
        title={t('general.irm')}
        value={getMasterDataValue(irm, MasterData.Irm)?.value}
        icon={<RemoveCircleOutlineOutlined fontSize="small" style={{ color: '#DF0024' }} />}
      />
    );
  }

  if (valueType === 'IRM' || value?.indexOf('SC_IRM$') > -1) {
    return (
      <GenericResult
        title={t('general.irm')}
        value={getMasterDataValue(value, MasterData.Irm)?.value}
        icon={<RemoveCircleOutlineOutlined fontSize="small" style={{ color: '#DF0024' }} />}
      />
    );
  }

  return <GenericResult title={t('general.result')} value={value} />;
};
