import { DisplayEntry } from 'models';
import Grid from '@mui/material/Grid';
import groupBy from 'lodash/groupBy';
import { extractAdditionalInfo } from '../../utils/structure';
import { ExpandableRulesCard } from '../ExpandableRulesCard';

type Props = {
  rules?: any;
  data: any;
  value: DisplayEntry | null;
  edition: string;
};

export const RulesViewer = (props: Props) => {
  const { rules } = props;

  if (props.value === null || props.value?.code === null || !rules) {
    return <></>;
  }

  const disciplineCode = props.value?.code?.substring(0, 3) ?? '';
  const dataBase = props.data?.find((x: any) => x.code === props.value?.code);
  const extractedInfo = extractAdditionalInfo(dataBase);
  const getExtendedInfo = (code: string) => extractedInfo.find((e: any) => e.code === code);

  const data = rules?.items?.filter((x: any) => x.code.startsWith(disciplineCode)) ?? [];
  const rows = data.map((dataItem: any) => ({
    ...dataItem,
    extendedInfo: getExtendedInfo(dataItem.code),
    movePhases: dataItem.movePhases?.map((rule: any) => ({
      ...rule,
      extendedInfo: getExtendedInfo(rule.code),
    })),
    moveSubunits: dataItem.moveSubunits?.map((rule: any) => ({
      ...rule,
      extendedInfo: getExtendedInfo(rule.code),
    })),
    resultRedirects: dataItem.resultRedirects?.map((rule: any) => ({
      ...rule,
      extendedInfo: getExtendedInfo(rule.code),
    })),
  }));

  const groupedRows = groupBy(rows, 'displayName');

  return (
    <Grid container spacing={2}>
      {Object.entries(groupedRows).map(([displayName, group]) => (
        <Grid key={displayName} size={12}>
          <ExpandableRulesCard
            type={displayName}
            rows={group}
            data={dataBase}
            disciplineCode={disciplineCode}
            edition={props.edition}
          />
        </Grid>
      ))}
    </Grid>
  );
};
