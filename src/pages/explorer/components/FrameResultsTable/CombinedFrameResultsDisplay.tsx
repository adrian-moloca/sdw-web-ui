import { Box, Typography, useTheme } from '@mui/material';
import { formatMasterCode } from '_helpers';
import { MainCard } from 'components';
import { useFrames } from 'hooks';
import get from 'lodash/get';

type Props = {
  data: Array<any>;
  discipline: string;
};

export const CombinedFrameResultsDisplay = ({ data, discipline }: Props) => {
  const { getFrameTitle, preferredValue, shouldShowFrames } = useFrames();
  const theme = useTheme();
  if (!data) return null;
  if (data.length == 0) return null;
  if (!shouldShowFrames(discipline)) return null;
  const hasFrames = data.some((row) => get(row, 'frameBracket') !== undefined);
  if (!hasFrames) return null;

  const valuesList = data.map((c) => get(c, 'frameBracket.brackets') ?? []);
  const totalValuesList = data.map((c) => get(c, 'frameBracket.splitBrackets') ?? []);

  const maxCount =
    Math.max(...valuesList.map((list) => list.length)) === 0
      ? Math.max(...totalValuesList.map((list) => list.length))
      : Math.max(...valuesList.map((list) => list.length));
  if (valuesList.some((l) => l.length > 6) && totalValuesList.some((l) => l.length > 6)) {
    return null;
  }
  if (maxCount > 6) {
    return null;
  }
  return (
    <Box display="flex" justifyContent="center" gap={1}>
      {Array.from({ length: maxCount }).map((_, i) => {
        const values = data.map((competitor) => {
          const formatFrames = get(competitor, 'frameBracket.brackets') ?? [];
          const frame = formatFrames[i];
          return formatMasterCode(frame?.value ?? '-');
        });
        const totalValues = data.map((competitor) => {
          const formatFrames = get(competitor, 'frameBracket.splitBrackets') ?? [];
          const frame = formatFrames[i];
          return formatMasterCode(frame?.value ?? '-');
        });
        const hasValues = values.some((v) => v !== '-');
        const hasTotalValues = totalValues.some((v) => v !== '-');

        return (
          <MainCard
            key={`Q${i + 1}`}
            divider={true}
            elevation={1}
            border={false}
            dividerColor={theme.palette.text.secondary}
            headerSX={{
              bgcolor: theme.palette.background.default,
              borderRadius: 1,
              px: 2,
              pb: 1,
              pt: 2,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
            title={
              <Typography variant="body2" lineHeight={1.1} fontWeight={600}>
                {getFrameTitle(i, discipline)}
              </Typography>
            }
            content={false}
          >
            <Box sx={{ py: 1, px: 1 }}>
              {hasValues && preferredValue(i, discipline) === 'value' && (
                <Typography variant="body2" lineHeight={1.2}>
                  {values.join(' - ')}
                </Typography>
              )}
              {hasTotalValues && preferredValue(i, discipline) === 'totalValue' && (
                <Typography variant="body2" lineHeight={1.2}>
                  {totalValues.join(' - ')}{' '}
                </Typography>
              )}
            </Box>
          </MainCard>
        );
      })}
    </Box>
  );
};
