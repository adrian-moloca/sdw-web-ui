export const FIELD_SUBMIT_ENTER: string = 'Enter';
export const FIELD_VALIDATION_DEFAULT_MESSAGE: string = '';
export const FIELD_EMPTY_VALUE: string = '';
export const FIELD_TYPES = {
  JSON: 'JSON',
  HTML: 'HTML',
  MARKDOWN: 'MARKDOWN',
};
export const METADATA_TYPES = {
  STRING: 'String',
  DATE: 'Date',
  COLLECTION: 'Collection',
  NUMBER: 'Number',
  BOOLEAN: 'Boolean',
  MAP: 'Map',
};
export const METADATA_SPECIALS = {
  ID: 'ID',
  EXTERNAL_ID: 'EXTERNAL_ID',
  EXTENSION: 'EXTENSION',
  URL: 'URL',
  REFERENCE: 'REFERENCE',
  ENTITY_TYPE_INDICATOR: 'ENTITY_TYPE_INDICATOR',
  ENTITY_TYPE_SPECIFIC: 'ENTITY_TYPE_SPECIFIC',
  MULTI_VALUE: 'MULTI_VALUE',
};

export const STATIC_CONSTRAINTS = {
  LIMITED_DATE: 'LIMITED_DATE',
  UNIQUE_KEYS: 'UNIQUE_KEYS',
};
export const VALIDATION_TYPES = {
  SIZE: 'Size',
  LENGTH: 'Length',
  PATTERN: 'Pattern',
  URL: 'URL',
  NOT_NULL: 'NotNull',
  NOT_BLANK: 'NotBlank',
  DATE_FORMAT: 'DateFormat',
  ...STATIC_CONSTRAINTS, // Constraints we are not receiving from backend but hardcoded in normalizer
};
