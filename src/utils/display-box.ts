import { DataType, MetadataModel, TemplateType } from '../models';
import dayjs from 'dayjs';

export const formatValue = (value: any, format?: string, type?: DataType) => {
  if (!value) return '-';
  switch (type) {
    case DataType.Date:
    case DataType.DateTime:
      return format ? dayjs(value).format(format) : dayjs(value).format('LLL');
    case DataType.Integer:
      return parseInt(value).toLocaleString();
    case DataType.Decimal:
      return parseFloat(value).toLocaleString();
    case DataType.Currency:
      return parseFloat(value).toLocaleString();
    default:
      return value ? value : '-';
  }
};

export const formatTemplate = (value: any, metadata?: MetadataModel, template?: TemplateType) => {
  if (!value) return '-';
  if (template == TemplateType.MasterData) {
    if (metadata) {
      const metadataValue = metadata.options.find((x) => x.value === value);
      return metadataValue?.displayName ?? value;
    }
  }
  return value;
};

export const hasValue = (value: any, type?: DataType, template?: TemplateType) => {
  if (type === DataType.List || template === TemplateType.List || template === TemplateType.Tags) {
    return value && value.length > 0;
  }

  return (value && value !== '-') || type === DataType.Switch || type === DataType.CheckBox;
};
