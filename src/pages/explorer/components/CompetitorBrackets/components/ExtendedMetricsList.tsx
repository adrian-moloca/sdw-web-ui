import { darken, Stack, Typography, useTheme } from '@mui/material';
import get from 'lodash/get';
import { ExtendedResultMetric } from 'models';
import { olympicsDesignColors } from 'themes/colors';

export const ExtendedMetricsList: React.FC<{
  metrics: any;
  resultDefinitions: ExtendedResultMetric[];
  detailScore?: string;
  textAlign: 'left' | 'right';
}> = ({ metrics, resultDefinitions, textAlign, detailScore }) => {
  const theme = useTheme();
  const isRight = textAlign === 'right';
  return (
    <Stack alignItems={textAlign === 'left' ? 'flex-end' : 'flex-start'}>
      {Object.keys(metrics)
        .filter((key) => !key.startsWith('proper') && !key.startsWith('$'))
        .map((metric, i) => {
          const element = resultDefinitions.find((x) => x.field === metric);
          if (element === undefined) return null;
          return (
            <Typography
              key={i}
              variant="body2"
              lineHeight={1.2}
              color={darken(olympicsDesignColors.base.neutral.white, 0.1)}
            >
              {isRight ? (
                <>
                  {element?.label}{' '}
                  <span style={{ fontSize: theme.typography.body1.fontSize, fontWeight: '500' }}>
                    {get(metrics, metric, '-') ?? '-'}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: theme.typography.body1.fontSize, fontWeight: '500' }}>
                    {get(metrics, metric, '-') ?? '-'}
                  </span>{' '}
                  {element?.label}
                </>
              )}
            </Typography>
          );
        })}
      {detailScore && (
        <Typography
          variant="body2"
          lineHeight={1.2}
          color={darken(olympicsDesignColors.base.neutral.white, 0.1)}
        >
          <span style={{ fontSize: theme.typography.body1.fontSize, fontWeight: '500' }}>
            {detailScore}
          </span>
        </Typography>
      )}
    </Stack>
  );
};
