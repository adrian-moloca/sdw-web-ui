import { DisplayEntry } from 'models';
import { StructureTable } from '../Tables/StructureTable';

type Props = {
  data?: Array<any>;
  rules?: any;
  value: DisplayEntry | null;
};

export const StructureViewer = ({ data, rules, value }: Props) => {
  const disciplineCode = value?.code?.substring(0, 3) ?? '';
  const filteredData = data?.find((x: any) => x.code === value?.code);
  const filteredRules = rules?.items?.filter((x: any) => x.code.startsWith(disciplineCode)) ?? [];
  return <StructureTable data={filteredData.events} rules={filteredRules} />;
};
