import { TableCell, Typography } from '@mui/material';
import React from 'react';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { EnumType, useEnums } from 'models';
import { HtmlTooltip } from 'components';
import { StructureType } from 'types/ingestion';
import { TableStyledBadge } from '../TableStyledBadge';
interface Props {
  type: StructureType;
  data: any;
  rules: Array<any>;
}

export function RulesBadgeViewer({ data, rules }: Readonly<Props>): React.ReactElement | null {
  const { getEnumValueOf } = useEnums();
  const rule = rules?.find(
    (x: any) => x.code === data.code || x.movePhases?.some((y: any) => y.code === data.code)
  );
  if (!rule) {
    return null;
  }
  const BuildMessage = (): React.ReactElement | undefined => {
    if (rule.code === data.code) {
      const ruleId = rule.id.replace(rule.code, '');
      const text = getEnumValueOf(ruleId, EnumType.OdfRule)?.text;
      return (
        <>
          <Typography color="inherit">{text}</Typography>
          <em>{rule.code}</em>
          <br />
          {rule.type}
        </>
      );
    }
    let nextRule = rule.movePhases.find((x: any) => x.code === data.code);
    if (nextRule) {
      const ruleId = nextRule.id.replace(nextRule.code, '');
      const text = getEnumValueOf(ruleId, EnumType.OdfRule)?.text;
      return (
        <>
          <Typography color="inherit">{text}</Typography>
          <em>{rule.code}</em>
          <br />
          {rule.type}
        </>
      );
    }
    nextRule = rule.moveSubunits.find((x: any) => x.code === data.code);
    if (nextRule) {
      const ruleId = nextRule.id.replace(nextRule.code, '');
      const text = getEnumValueOf(ruleId, EnumType.OdfRule)?.text;
      return (
        <>
          <Typography color="inherit">{text}</Typography>
          <em>{rule.code}</em>
          <br />
          {rule.type}
        </>
      );
    }

    return (
      <>
        <Typography color="inherit">{'Error'}</Typography>
        <em>{'Rules could not be'}</em> <b>{'parsed'}</b>
      </>
    );
  };
  const BuildIcon = (): React.ReactElement | undefined => {
    if (rule.code === data.code) {
      const ruleId = rule.id.replace(rule.code, '');
      const Icon = getEnumValueOf(ruleId, EnumType.OdfRule)?.icon;
      return Icon ? <Icon fontSize="small" /> : undefined;
    }
    let nextRule = rule.movePhases?.find((x: any) => x.code === data.code);
    if (nextRule) {
      const ruleId = nextRule.id.replace(nextRule.code, '');
      const Icon = getEnumValueOf(ruleId, EnumType.OdfRule)?.icon;
      return Icon ? <Icon fontSize="small" /> : undefined;
    }
    nextRule = rule.moveSubunits?.find((x: any) => x.code === data.code);
    if (nextRule) {
      const ruleId = nextRule.id.replace(nextRule.code, '');
      const Icon = getEnumValueOf(ruleId, EnumType.OdfRule)?.icon;
      return Icon ? <Icon fontSize="small" /> : undefined;
    }

    return <SettingsTwoToneIcon fontSize="small" />;
  };
  return (
    <TableCell>
      <HtmlTooltip title={BuildMessage()} placement="left">
        <TableStyledBadge color={'warning'} variant="dot" badgeContent={0}>
          {BuildIcon()}
        </TableStyledBadge>
      </HtmlTooltip>
    </TableCell>
  );
}
