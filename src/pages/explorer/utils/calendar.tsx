import { Box, Typography } from '@mui/material';
import { GridCellParams, GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import { customGridClasses, DisciplineChip } from 'components';
import { CalendarCell } from '../components';

export function getAllCalendarDates(disciplines: any[]): string[] {
  const allDates = new Set<string>();

  disciplines.forEach((d) => {
    let current = dayjs(d.startDate);
    const end = dayjs(d.finishDate);

    while (current.isBefore(end) || current.isSame(end)) {
      allDates.add(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
  });

  return Array.from(allDates).sort((a, b) => a.localeCompare(b));
}
export function generateCalendarColumns(
  dates: string[],
  route: string,
  hoveredRowIndex: GridRowId | null,
  hoveredField: string | null,
  onHover: (rowIndex: GridRowId | null, field: string | null) => void
): GridColDef[] {
  const base: GridColDef[] = [
    {
      field: 'discipline',
      headerName: '',
      width: 240,
      flex: 1,
      renderCell: (params) => (
        <DisciplineChip
          id={params.value.id}
          route={`${route}#disciplineId="${params.value.id}"&section=0`}
          code={params.value.code}
          hideTitle={false}
          sizeNumber={26}
          title={params.value.title}
        />
      ),
    },
  ];

  const dateColumns: GridColDef[] = dates.map((date) => ({
    field: date,
    headerName: date,
    renderHeader: () => renderHeader(date),
    width: 15,
    renderCell: (params: GridRenderCellParams) => <CalendarCell data={params} onHover={onHover} />,
    sortable: false,
    cellClassName: (params: GridCellParams) => {
      const isHoveredRow = hoveredRowIndex === params.id;
      const isHoveredCol = hoveredField === params.field;
      return [
        isHoveredRow ? customGridClasses.hoveredRow : '',
        isHoveredCol ? customGridClasses.hoveredCol : '',
      ].join(' ');
    },
  }));

  return [...base, ...dateColumns];
}
function renderHeader(dateStr: string) {
  const date = dayjs(dateStr);
  return (
    <Box textAlign="center">
      <Typography variant="body1" fontWeight="bold" lineHeight={1.2}>
        {date.date()}
      </Typography>
      <Typography variant="body2" lineHeight={1} color="text.secondary">
        {date.format('ddd')}
      </Typography>
    </Box>
  );
}
export function generateCalendarRows(disciplines: any[], dates: string[]) {
  return disciplines.map((d, index) => {
    const row: any = {
      order: index + 1,
      discipline: d.discipline,
    };

    dates.forEach((date) => {
      const element = d.elements.find((x: any) => x.date === date);
      row[date] = element;
    });

    return row;
  });
}
