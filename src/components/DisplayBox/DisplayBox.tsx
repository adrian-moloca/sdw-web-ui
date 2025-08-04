import React, { ElementType } from 'react';
import { Box, TableCell, TableRow, Typography, useMediaQuery } from '@mui/material';
import { DataType, EnumType, MetadataModel, TemplateType } from 'models';
import { FieldTemplate, EnumTemplate } from '../templates';
import { formatValue, formatTemplate, hasValue } from 'utils/display-box';

type BoxProps = {
  value: any;
  field?: string;
  title?: string;
  type?: DataType;
  format?: string;
  route?: string;
  icon?: ElementType;
  enum?: EnumType;
  template?: TemplateType;
  metadata?: MetadataModel;
};

const BasicInput = ({
  type,
  value,
  route,
  format,
}: Pick<BoxProps, 'type' | 'value' | 'route' | 'format'>) => {
  if (type && [DataType.Switch, DataType.CheckBox].includes(type)) {
    return <FieldTemplate type={TemplateType.Boolean} value={value} withText={true} />;
  }

  if (route) {
    return <FieldTemplate type={TemplateType.Route} value={value} route={route} withText={true} />;
  }

  return <Typography variant="body1">{formatValue(value, format, type)}</Typography>;
};

const IconInput = ({ type, icon, value }: Pick<BoxProps, 'type' | 'icon' | 'value'>) => {
  if (type && [DataType.Switch, DataType.CheckBox].includes(type)) {
    return <FieldTemplate type={TemplateType.Boolean} value={value} withText={true} />;
  }

  return <FieldTemplate type={TemplateType.TextWithIcon} value={icon} withText={true} />;
};

const BoxContent = ({
  value,
  type,
  template,
  enum: enumTemplate,
  route,
  icon,
  metadata,
  format,
}: BoxProps) => {
  if (type === DataType.AuditInfo) return value;

  if (enumTemplate !== undefined && enumTemplate !== null) {
    return <EnumTemplate type={enumTemplate} value={value} withText={true} />;
  }

  if (template !== undefined && template !== null) {
    const formattedValue = formatTemplate(value, metadata, template);
    const content = (
      <FieldTemplate
        type={template}
        value={formattedValue}
        route={route}
        icon={icon}
        withText={true}
      />
    );
    return template === TemplateType.ExternalIds ? (
      <Box sx={{ width: 600 }}>{content}</Box>
    ) : (
      content
    );
  }

  if (icon) return <IconInput type={type} icon={icon} value={value} />;

  return <BasicInput type={type} value={value} route={route} format={format} />;
};

const DisplayBoxContent = ({
  enum: enumTemplate,
  format,
  icon,
  metadata,
  route,
  template,
  title,
  type,
  value,
}: BoxProps) => {
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  if (!hasValue(value, type, template)) return null;

  return (
    <TableRow>
      <TableCell
        sx={{ width: matchDownSM ? '30%' : '20%', alignContent: 'center', pl: 2, py: 0 }}
        variant="head"
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }} lineHeight={1}>
          {title}
        </Typography>
      </TableCell>
      <TableCell sx={{ alignContent: 'center', py: 0.5 }}>
        <BoxContent
          value={value}
          type={type}
          enum={enumTemplate}
          format={format}
          route={route}
          icon={icon}
          template={template}
          metadata={metadata}
        />
      </TableCell>
    </TableRow>
  );
};

const displayBoxPropsAreEqual = (prev: BoxProps, next: BoxProps) => {
  return (
    prev.field === next.field &&
    prev.value === next.value &&
    prev.title === next.title &&
    prev.type === next.type &&
    prev.enum === next.enum &&
    prev.metadata === next.metadata &&
    prev.template === next.template &&
    prev.icon === next.icon
  );
};

export const DisplayBox = React.memo(DisplayBoxContent, displayBoxPropsAreEqual);
