import { TableCell, Typography } from '@mui/material';
import DesignServicesOutlined from '@mui/icons-material/DesignServicesOutlined';
import { StructureType } from 'types/ingestion';
import { HtmlTooltip } from 'components';
import { RulesStyledBadge } from '../RulesStyledBadge';

type Props = {
  type: StructureType;
  data: any;
  rules: Array<any>;
};

export const RulesViewerHelper = ({ data, rules }: Props) => {
  const rule = rules?.find(
    (x: any) =>
      x.code === data.code ||
      x.movePhases?.some((y: any) => y.code === data.code) ||
      x.messageRedirects?.some((y: any) => y.code === data.code) ||
      x.moveSubunits?.some((y: any) => y.code === data.code)
  );

  if (!rule) {
    return null;
  }

  const buildMessage = (): React.ReactElement | undefined => {
    if (rule.code === data.code) {
      return (
        <>
          <Typography color="inherit">{rule.displayName}</Typography>
          <em>{rule.code}</em>
          <br />
          {rule.type}
        </>
      );
    }
    let nextRule = rule.movePhases?.find((x: any) => x.code === data.code);
    if (nextRule) {
      return (
        <>
          <Typography color="inherit">{nextRule.displayName}</Typography>
          <em>{nextRule.code}</em>
          <br />
          {nextRule.type}
        </>
      );
    }
    nextRule = rule.messageRedirects?.find((x: any) => x.code === data.code);
    if (nextRule) {
      return (
        <>
          <Typography color="inherit">{nextRule.displayName}</Typography>
          <em>{nextRule.code}</em>
          <br />
          {nextRule.type}
        </>
      );
    }
    nextRule = rule.moveSubunits?.find((x: any) => x.code === data.code);
    if (nextRule) {
      return (
        <>
          <Typography color="inherit">{nextRule.displayName}</Typography>
          <em>{nextRule.code}</em>
          <br />
          {nextRule.type}
        </>
      );
    }

    return (
      <>
        <Typography color="inherit">Error</Typography>
        <em>Rules could not be</em> <b>parsed</b>
      </>
    );
  };

  return (
    <TableCell>
      <HtmlTooltip title={buildMessage()} placement="left">
        <RulesStyledBadge color={'error'} variant="dot" badgeContent={1}>
          <DesignServicesOutlined fontSize="small" color="warning" />
        </RulesStyledBadge>
      </HtmlTooltip>
    </TableCell>
  );
};
