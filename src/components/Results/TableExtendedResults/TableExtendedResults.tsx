import get from 'lodash/get';
import { transformOdfExtensions } from '_helpers';
import React from 'react';
import { OdfSchemaExtendedResults, OdfExtendedResults } from 'components';

export function TableExtendedResults(
  param: Readonly<{ data: any; discipline: string }>
): React.ReactElement | null {
  const extendedInfo = get(param.data, 'result.extendedInfo');
  const odfData = transformOdfExtensions(extendedInfo, 'odfExtensions', 'extended');
  if (odfData) {
    return <OdfExtendedResults data={odfData} discipline={param.discipline} />;
  }
  const schemaData = transformOdfExtensions(extendedInfo, 'extendedResult');
  if (schemaData) {
    return <OdfSchemaExtendedResults data={schemaData} discipline={param.discipline} />;
  }
  return null;
}
