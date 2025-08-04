import { Stack, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { StripedDataGridBase } from 'components';
import baseConfig from 'baseConfig';
import { GridColDef } from '@mui/x-data-grid-pro';
import { CodeNameType, CriteriaItem, JudgeCriteriaData } from './type';
import { uniq } from 'lodash';

type Props = {
  data: JudgeCriteriaData;
  category?: CodeNameType;
};
interface RowItem {
  id: string;
  round: string;
  score?: string;
  averageScore?: string;
  rank?: string;
  [key: string]: any; // Allows for dynamic properties like round.code
}
export const JudgeScoringTable = ({ data, category }: Props) => {
  const theme = useTheme();
  if (!data) return null;
  const criteria = category
    ? data.criteria.filter((x) => x.category === category.code)
    : data.criteria;

  const criteriaRoundCodes = uniq(criteria.map((x) => x.round));
  const rounds = data.rounds.filter((x) => criteriaRoundCodes.includes(x.code));
  const columns: GridColDef[] = [
    { field: 'round', headerName: t('general.round'), minWidth: 80, sortable: false, flex: 1 },
  ];
  if (rounds.some((x) => x.rank))
    columns.push({
      field: 'rank',
      headerName: t('general.rank'),
      width: 60,
      sortable: false,
    });
  if (rounds.some((x) => x.score))
    columns.push({
      field: 'score',
      headerName: t('general.totalScore'),
      width: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
    });
  if (rounds.some((x) => x.averageScore))
    columns.push({
      field: 'averageScore',
      headerName: t('general.average'),
      width: 80,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
    });
  if (rounds.some((x) => x.arrive))
    columns.push({
      field: 'arrive',
      headerName: t('general.arrive'),
      width: 70,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
    });
  if (rounds.some((x) => x.goe))
    columns.push({
      field: 'goe',
      headerName: t('general.goe'),
      width: 70,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
    });
  columns.push(
    ...data.judges.map(
      (judge: CodeNameType) =>
        ({
          field: judge.code,
          headerName: judge.title,
          width: 90,
          sortable: false,
          align: 'right',
          headerAlign: 'right',
          renderCell: ({ value, row }) => {
            const discarded = row[`${judge.code}_Discarded`];
            return (
              <>
                {discarded === 'Y' ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {value}
                  </Typography>
                ) : (
                  <Typography variant="body2">{value}</Typography>
                )}
              </>
            );
          },
        }) as GridColDef
    )
  );

  const rows = rounds.map((round: CodeNameType) => {
    const item: RowItem = {
      id: round.code,
      round: round.title,
      score: round.score,
      rank: round.rank,
      averageScore: round.averageScore,
      arrive: round.arrive,
      goe: round.goe,
    };
    criteria.forEach((e: CriteriaItem) => {
      item[e.judge] = e.score;
    });
    criteria.forEach((e: CriteriaItem) => {
      item[`${e.judge}_Discarded`] = e.discarded;
    });
    return item;
  });
  return (
    <Stack sx={{ mb: 2, mt: 1 }}>
      {category && (
        <Typography variant="body1" fontWeight={500} textAlign={'left'}>
          {category.title}
        </Typography>
      )}
      <StripedDataGridBase
        rows={rows}
        fontSize={theme.typography.body2.fontSize}
        getRowId={(row) => row.id}
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        density="compact"
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        rowHeight={baseConfig.defaultRowHeight ?? 40}
        hideFooter
      />
    </Stack>
  );
};
