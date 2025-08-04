import { Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { formatAthleteName, formatMasterCode } from '_helpers';
import { AwardChip, CountryChip, DisciplineChip, TypographyLink } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import { t } from 'i18next';
import get from 'lodash/get';
import { EntityType } from 'models';

export const buildExtractorColumns = (): GridColDef[] => {
  const { getDetailRoute } = useAppRoutes();
  const columns: GridColDef[] = [
    {
      field: 'nocCode',
      headerName: t('general.noc'),
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <CountryChip
          code={params.value}
          title={formatMasterCode(params.value)}
          hideTitle={false}
          size={'small'}
        />
      ),
    },
    {
      field: 'participationName',
      headerName: t('general.participant'),
      width: 320,
      valueGetter: (_value, row) => formatAthleteName(row),
      renderCell: (params: GridRenderCellParams) => {
        const id = get(params.row, 'individualId') ?? get(params.row, 'teamId');
        return (
          <TypographyLink
            value={params.value}
            typoSize="body1"
            route={getDetailRoute(id?.startsWith('IND') ? EntityType.Person : EntityType.Team, id)}
          />
        );
      },
    },
    {
      field: 'sportCode',
      headerName: t('general.sport'),
      width: 180,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.row.sport}</Typography>,
    },
    {
      field: 'disciplineCode',
      headerName: t('general.discipline'),
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <DisciplineChip
          code={params.value}
          title={params.row.discipline}
          hideTitle={false}
          sizeNumber={21}
        />
      ),
    },
    {
      field: 'eventTypeCode',
      headerName: t('general.event'),
      width: 400,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.row.eventType}</Typography>,
    },
    {
      field: 'eventGenderCode',
      headerName: t('general.eventGender'),
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{params.row.eventGender}</Typography>
      ),
    },
    {
      field: 'phaseTypeCode',
      headerName: t('general.phase'),
      width: 280,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.row.phase}</Typography>,
    },
    {
      field: 'roundCode',
      headerName: t('general.round'),
      width: 180,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.row.round}</Typography>,
    },
    {
      field: 'unit',
      headerName: t('general.unit'),
      width: 280,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.row.unit}</Typography>,
    },
    {
      field: 'rank',
      headerName: t('general.rank'),
      width: 80,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'result',
      headerName: t('general.result'),
      width: 130,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'irmCode',
      headerName: t('general.irm'),
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{formatMasterCode(params.row.irmCode)}</Typography>
      ),
    },
    {
      field: 'award',
      headerName: t('general.award'),
      width: 80,
      renderCell: (params: GridRenderCellParams) => <AwardChip data={params.row} />,
    },
    {
      field: 'nocContinentCode',
      headerName: t('general.continent'),
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{params.row.nocContinent}</Typography>
      ),
    },
    {
      field: 'competition',
      headerName: t('general.competition'),
      width: 260,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{params.row.competition}</Typography>
      ),
    },
    {
      field: 'country',
      headerName: t('general.country'),
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <CountryChip
          code={params.row.competitionCountryCode}
          title={params.row.competitionCountry}
          hideTitle={false}
          size={'small'}
        />
      ),
    },
    { field: 'city', headerName: t('general.city'), width: 180 },
  ];
  return columns;
};
