import {
  EntityType,
  ExcludedFields,
  IConfigProps,
  IMetaType,
  LongFields,
  MenuFlagEnum,
  MetadataOption,
  ValidEditEntityTypes,
  ValidMergeEntityTypes,
} from 'models';
import appConfig from 'config/app.config';
import { useSecurityProfile } from './useSecurity';
import get from 'lodash/get';
import sortedUniq from 'lodash/sortedUniq';
import { useCallback } from 'react';
import { t } from 'i18next';
import { METADATA_TYPES } from 'constants/config';
import dayjs from 'dayjs';
export interface EditFieldData {
  field: string;
  hidden: boolean;
  data?: any;
}
export interface ModelProps {
  id: string;
  sort?: string;
  field: string;
  state: 'readonly' | 'hidden' | 'overwrite' | 'updated' | 'none';
  internal: any;
  consolidation: any;
  production: any;
}
const useConsolidation = () => {
  const { hasPermission } = useSecurityProfile();
  const hasMerge = (type: EntityType): boolean => {
    return hasPermission(MenuFlagEnum.Consolidation) && ValidMergeEntityTypes.includes(type);
  };
  const hasEdit = (type: EntityType): boolean => {
    return hasPermission(MenuFlagEnum.Consolidation) && ValidEditEntityTypes.includes(type);
  };
  const couldMerge = (type: EntityType): boolean => {
    return ValidMergeEntityTypes.includes(type);
  };
  const couldEdit = (type: EntityType): boolean => {
    return ValidEditEntityTypes.includes(type);
  };
  const editUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_EDIT_FIELDS}`;
  const editSaveUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_EDIT_FIELDS}`;
  const mergeUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS}`;
  const upStreamURL = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_UPSTREAMS}`;

  const getFieldState = (field: string, fieldSetup: any) => {
    if (ExcludedFields.includes(field)) return 'readonly';
    if (fieldSetup?.hidden?.includes(field)) return 'hidden';
    if (get(fieldSetup?.consolidationRecord, field)) return 'overwrite';
    return 'none';
  };
  const filterFields = (type: EntityType, data: any, metadata?: IMetaType): string[] => {
    let fields = sortedUniq(Object.keys(metadata ?? data).filter((e) => e != 'id'));
    if (type == EntityType.Person && metadata)
      fields = fields.filter(
        (e) => !get(get(metadata, e), 'entity') || get(get(metadata, e), 'entity') === 'PERSON'
      );
    if (type == EntityType.Horse && metadata)
      fields = fields.filter(
        (e) => !get(get(metadata, e), 'entity') || get(metadata, e)?.entity === 'HORSE'
      );
    return fields;
  };
  const getInfoMessage = useCallback((fieldState: any, fieldSetup: any, config: IConfigProps) => {
    const noHidden = fieldState?.hidden ? fieldState.hidden.length : 0;
    const noOverwrites = fieldState?.fields ? Object.keys(fieldState.fields).length : 0;
    if (fieldSetup?.state == 'needReview')
      return t('consolidation.message_review').replace('{0}', config.display.toLowerCase());
    if (noOverwrites == 0 && noHidden == 0)
      return t('consolidation.message_noTransformations').replace(
        '{0}',
        config.display.toLowerCase()
      );
    if (noOverwrites > 0 && noHidden > 0)
      return t('consolidation.message_HiddenTransformations')
        .replace('{0}', config.display.toLowerCase())
        .replace('{1}', noHidden.toLocaleString())
        .replace('{2}', noOverwrites.toLocaleString());
    if (noOverwrites > 0)
      return t('consolidation.message_Transformations')
        .replace('{0}', config.display.toLowerCase())
        .replace('{1}', noOverwrites.toLocaleString());
    if (noHidden > 0)
      return t('consolidation.message_Hidden')
        .replace('{0}', config.display.toLowerCase())
        .replace('{1}', noHidden.toLocaleString());
  }, []);

  const getFlatFields = useCallback(
    (fieldSetup: any, type: EntityType, data: any, metadata?: IMetaType): ModelProps[] => {
      const fields = filterFields(type, data, metadata);
      const idValue: ModelProps = {
        id: 'Id',
        sort: '000',
        field: 'id',
        state: 'readonly',
        internal: get(fieldSetup?.internalRecord, 'id'),
        consolidation: get(fieldSetup?.consolidationRecord, 'id'),
        production: get(fieldSetup?.productionRecord, 'id'),
      };
      const result = fields.map((field) => {
        const value: ModelProps = {
          id: get(metadata, field)?.displayName ?? field,
          sort: get(metadata, field)?.displayName ?? field,
          field,
          state: getFieldState(field, fieldSetup),
          internal: get(fieldSetup?.internalRecord, field),
          consolidation: get(fieldSetup?.consolidationRecord, field),
          production: get(fieldSetup?.productionRecord, field),
        };
        return value;
      });
      return [idValue, ...result];
    },
    []
  );

  const getInitialValues = useCallback(
    (dataItem: ModelProps, hidden: Array<string>, metadata?: IMetaType): EditFieldData => {
      const model = get(metadata, dataItem?.field);
      let data = dataItem?.consolidation ?? dataItem?.internal ?? '';
      if (LongFields.includes(dataItem?.field)) {
        data ??= dataItem?.internal ?? '';
      } else if (model?.type === METADATA_TYPES.COLLECTION) {
        data ??= dataItem?.internal ?? [];
        if (model?.options && model?.options.length > 0) {
          const collectionData: MetadataOption[] = [];
          data?.forEach((element: string) => {
            const e = model.options.find(
              (item: MetadataOption) => item.value === element || item.displayName === element
            );
            if (e) collectionData.push(e);
          });
          data = collectionData;
        }
      } else if (model?.type === METADATA_TYPES.NUMBER) {
        data ??= dataItem?.internal ?? 0;
      } else if (model?.type === METADATA_TYPES.MAP) {
        try {
          data ??= dataItem?.internal ? JSON.stringify(JSON.parse(dataItem.internal), null, 2) : '';
          data = data ? JSON.stringify(JSON.parse(data), null, 2) : '';
        } catch {
          data = '';
        }
      } else if (model?.options && model?.options.length > 0) {
        if (!data) {
          if (dataItem?.internal) {
            const valueMaster = model.options.find((x) => x.value === dataItem?.internal);
            data = valueMaster ?? null;
          } else data = null;
        } else {
          const valueMaster = model.options.find((x) => x.value === data);
          data = valueMaster ?? null;
        }
      } else if (model?.type === METADATA_TYPES.DATE) {
        try {
          if (!data) data = dataItem.internal ? dayjs(dataItem.internal) : null;
          else data = dayjs(data);
        } catch {
          data = dayjs();
        }
      }
      const initialValues: EditFieldData = {
        field: dataItem?.field,
        hidden: hidden.includes(dataItem?.id),
        data,
      };
      return initialValues;
    },
    []
  );
  return {
    hasMerge,
    hasEdit,
    couldMerge,
    getFieldState,
    filterFields,
    getInfoMessage,
    couldEdit,
    getInitialValues,
    getFlatFields,
    editUrl,
    mergeUrl,
    editSaveUrl,
    upStreamURL,
  };
};
export default useConsolidation;
