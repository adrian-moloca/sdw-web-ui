import { containsHtmlCode, isUrl } from '_helpers';
import { useCallback } from 'react';
import { ActionType, MetadataModel, TemplateType, LongFields } from 'models';
import get from 'lodash/get';
import { FieldTemplate } from 'components';
import { METADATA_TYPES } from 'constants/config';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import CallMergeOutlined from '@mui/icons-material/CallMergeOutlined';
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined';
import CompareArrowsOutlined from '@mui/icons-material/CompareArrowsOutlined';
import DoNotDisturbOnOutlined from '@mui/icons-material/DoNotDisturbOnOutlined';
import DownloadForOfflineOutlined from '@mui/icons-material/DownloadForOfflineOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import PreviewOutlined from '@mui/icons-material/PreviewOutlined';
import RunCircleOutlined from '@mui/icons-material/RunCircleOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import type { AppModelProps } from 'types/model';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export const useAppModel = (): AppModelProps => {
  const formatField = (
    field: string,
    value: string | string[] | undefined,
    metadata?: { [key: string]: MetadataModel }
  ): React.ReactElement | string => {
    if (!value) return '-';

    if (!metadata) {
      return value.toString();
    }

    const model = get(metadata, field);
    if (!model) {
      return value.toString();
    }
    if (model.type === METADATA_TYPES.MAP) {
      return <FieldTemplate type={TemplateType.JsonPopUp} value={value} withText={true} />;
    }

    if (LongFields.includes(field)) {
      return (
        <FieldTemplate type={TemplateType.HtmlPopUp} value={value} title={model.displayName} />
      );
    }

    if (model?.options && model?.options.length > 0) {
      if (model.type === METADATA_TYPES.COLLECTION) {
        const valueMaster = (value as string[])
          .map((v: string) => model.options.find((x) => x.value === v)?.displayName)
          .join(', ');

        return <FieldTemplate type={TemplateType.MasterData} value={valueMaster} withText={true} />;
      }
      const valueMaster = model.options.find((x) => x.value === value);

      return (
        <FieldTemplate
          type={TemplateType.MasterData}
          value={valueMaster?.displayName ?? value}
          withText={true}
        />
      );
    }

    if (model.type === METADATA_TYPES.DATE) {
      return <FieldTemplate type={TemplateType.Date} value={value} withText={true} />;
    }

    if (model.type === METADATA_TYPES.COLLECTION) {
      return <FieldTemplate type={TemplateType.Tags} value={value} withText={true} />;
    }

    if (model.type === METADATA_TYPES.BOOLEAN) {
      return <FieldTemplate type={TemplateType.Boolean} value={value} withText={true} />;
    }

    if (containsHtmlCode(value.toString())) {
      return <FieldTemplate type={TemplateType.Html} value={value} withText={true} />;
    }

    if (isUrl(value.toString())) {
      return <FieldTemplate type={TemplateType.Url} value={value} withText={true} />;
    }

    return value.toString();
  };

  const formatEditField = (
    field: string,
    value: string | string[] | undefined,
    metadata?: { [key: string]: MetadataModel }
  ): React.ReactElement | string => {
    if (!value) return '-';

    if (!metadata) {
      return value.toString();
    }

    const model = get(metadata, field);
    if (!model) {
      return value.toString();
    }

    if (model.type === METADATA_TYPES.MAP) {
      return <FieldTemplate type={TemplateType.JsonPopUp} value={value} withText={true} />;
    }

    if (LongFields.includes(field)) {
      return (
        <FieldTemplate type={TemplateType.HtmlPopUp} value={value} title={model.displayName} />
      );
    }

    if (model?.options && model?.options.length > 0) {
      if (model.type === METADATA_TYPES.COLLECTION) {
        const valueMaster = (value as string[])
          .map((v: string) => model.options.find((x) => x.value === v)?.displayName)
          .join(', ');

        return <FieldTemplate type={TemplateType.MasterData} value={valueMaster} withText={true} />;
      }
      const valueMaster = model.options.find((x) => x.value === value);

      return (
        <FieldTemplate
          type={TemplateType.MasterData}
          value={valueMaster?.displayName ?? value}
          withText={true}
        />
      );
    }
    if (model.type === METADATA_TYPES.DATE) {
      return <FieldTemplate type={TemplateType.Date} value={value} withText={true} />;
    }

    if (model.type === METADATA_TYPES.COLLECTION) {
      return <FieldTemplate type={TemplateType.Tags} value={value} withText={true} />;
    }

    if (model.type === METADATA_TYPES.BOOLEAN) {
      return <FieldTemplate type={TemplateType.Boolean} value={value} withText={true} />;
    }

    if (containsHtmlCode(value.toString())) {
      return <FieldTemplate type={TemplateType.HtmlPopUp} value={value} withText={true} />;
    }

    if (isUrl(value.toString())) {
      return <FieldTemplate type={TemplateType.Url} value={value} withText={true} />;
    }

    return value.toString();
  };

  const getIconBase = useCallback((type: ActionType): OverridableComponent<SvgIconTypeMap> => {
    switch (type) {
      case ActionType.Merge:
        return CallMergeOutlined;
      case ActionType.Sync:
        return CompareArrowsOutlined;
      case ActionType.HideFields:
        return VisibilityOffOutlined;
      case ActionType.Edit:
        return EditOutlined;
      case ActionType.Download:
        return DownloadForOfflineOutlined;
      case ActionType.Cancel:
        return DoNotDisturbOnOutlined;
      case ActionType.Preview:
        return PreviewOutlined;
      case ActionType.Validate:
        return ChecklistOutlined;
      case ActionType.Detail:
        return OpenInNewOutlined;
      case ActionType.Execute:
        return RunCircleOutlined;
      case ActionType.Calculate:
        return CalculateOutlined;
      case ActionType.Generate:
        return Inventory2Outlined;
      case ActionType.Save:
        return SaveOutlined;
      default:
        return CallMergeOutlined;
    }
  }, []);

  return {
    getIconBase,
    formatField,
    formatEditField,
  };
};
