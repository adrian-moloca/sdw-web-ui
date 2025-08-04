import { Typography } from '@mui/material';
import { getJson, removeHtmlTags, snakeCaseToWords } from '_helpers';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import React from 'react';
import baseConfig from 'baseConfig';
function splitInLines(valueKey: string) {
  return valueKey.toLowerCase().indexOf('odf') || valueKey.toLowerCase().indexOf('og');
}
export function DisplayValue(valueKey: string, value: string) {
  if (valueKey.toLowerCase() == 'timestamp')
    return (
      <Typography variant="body2" sx={{ marginRight: 0.5 }}>
        {dayjs(value).format(baseConfig.dateTimeDateFormat).toUpperCase()}
      </Typography>
    );
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item: string, i: number) => (
          <div key={`${i}_${valueKey}_${item}`}>{DisplayValue(valueKey, item)}</div>
        ))}
      </>
    );
  } else if (typeof value === 'object') {
    const jsonObject = getJson(value);
    if (!jsonObject) return removeHtmlTags(value);
    return (
      <>
        {Object.keys(jsonObject)
          .filter((x: string) => x !== 'schema' && x !== '$schema')
          .map((key: any, i: number) => (
            <React.Fragment key={`${key}_${i}_${valueKey}`}>
              {splitInLines(valueKey) ? (
                <Typography variant="body2" component={'div'} sx={{ marginRight: 0.5 }}>
                  <span style={{ color: grey[700] }}>{snakeCaseToWords(key)}</span>{' '}
                  {DisplayValue(key, jsonObject[key])}
                </Typography>
              ) : (
                <Typography variant="body2" component={'span'} sx={{ marginRight: 0.5 }}>
                  <span style={{ color: grey[700] }}>{snakeCaseToWords(key)}</span>{' '}
                  {DisplayValue(key, jsonObject[key])}
                </Typography>
              )}
            </React.Fragment>
          ))}
      </>
    );
  }
  return (
    <Typography variant="body2" component={'span'}>
      {removeHtmlTags(value)}
    </Typography>
  );
}
