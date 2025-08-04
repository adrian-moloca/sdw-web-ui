import { Stack, Typography } from '@mui/material';
import {
  CompetitionChip,
  CountryChip,
  DisciplineChip,
  OrganisationChip,
  TypographyLink,
} from 'components';
import get from 'lodash/get';
import { ColumnData, EntityType } from 'models';
import { MedalNumberDisplay } from '../MedalNumberDisplay';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';
import { calculateAge, formatAthleteName, formatMasterCode, humanize } from '_helpers';
import useAppRoutes from 'hooks/useAppRoutes';
import dayjs from 'dayjs';
import { t } from 'i18next';

export const getStatsGridHeight = (dataContent: any[]) => {
  const calculatedHeight =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  return calculatedHeight < 780 ? undefined : 780;
};
const buildRecordTypeName = (row: any) => {
  const code = get(row, 'type.code');
  const gender =
    get(row, 'participationGender') == 'PGEN$F' ? t('common.female') : t('common.male');
  const parseCode = formatMasterCode(code)
    .replace(formatMasterCode(row.discipline.code), '')
    .replaceAll('-', '')
    .trim();
  return `${gender} ${get(row, 'event.title')} (${parseCode})`;
};
export const statsValueGetter = (col: ColumnData, row: any) => {
  switch (col.dataKey) {
    case 'noc':
      return get(row, 'organisation.name');
    case 'countryOfBirth':
      return get(row, 'countryOfBirth') ?? get(row, 'nationality');
    case 'nocs':
    case 'organisationCodes':
      return get(row, col.dataKey)
        ?.map((n: any) => n.code)
        .join(', ');
    case 'disciplineCodes':
      return get(row, 'disciplineCodes')
        ?.map((n: any) => n)
        ?.join(', ');
    case 'disciplines':
      return get(row, 'disciplines')
        ?.map((n: any) => n.code)
        .join(', ');
    case 'roles':
      return get(row, 'roles')
        ?.map((n: any) => humanize(n))
        .join(', ');
    case 'discipline':
      return get(row, 'discipline.title');
    case 'competition':
      return get(row, 'competitionTitle');
    case 'competitionCategories':
      return get(row, 'competitionCategories')
        ?.filter((n: any) => n.code !== 'CCAT$OLYMPIC_GAMES')
        ?.map((n: any) => humanize(formatMasterCode(n.code)))
        .join(', ');
    case 'current':
      return get(row, col.dataKey) ? t('common.yes') : t('common.no');
    case 'organisation':
      return get(row, 'organisation.country');
    case 'gender':
    case 'participationGender':
      return get(row, col.dataKey) == 'PGEN$F' ? t('common.female') : t('common.male');
    case 'continent':
      return get(row, 'organisation.continent');
    case 'rank':
      return get(row, 'rank');
    case 'athlete':
      return formatAthleteName(row);
    case 'participant':
      return get(row, 'participationName');
    case 'recordType': {
      const title = get(row, 'type.title');
      const code = get(row, 'type.code');
      if (!title) return buildRecordTypeName(row);
      if (title !== code) {
        return title.replace(get(row, 'discipline.title'), '').trim();
      }
      return buildRecordTypeName(row);
    }
    case 'age':
      return calculateAge(row);
    case 'dateOfBirth':
    case 'dateOfDeath':
      return get(row, col.dataKey)
        ? dayjs(get(row, col.dataKey)).format(baseConfig.generalDateFormat).toUpperCase()
        : '-';
    case 'recordDate':
    case 'startDate':
    case 'finishDate':
      return get(row, col.dataKey)
        ? dayjs(get(row, col.dataKey)).format(baseConfig.dayDateFormat).toUpperCase()
        : '-';
    case 'ageRange':
      return `${get(row, 'ageAtFirstCompetition')} - ${get(row, 'ageAtLastCompetition')}`;
    case 'yearRange':
      return `${get(row, 'fromYear')} - ${get(row, 'toYear')}`;
    case 'dateRange':
      return `${dayjs(get(row, 'minStartDate')).format('YYYY')} - ${dayjs(get(row, 'maxStartDate')).format('YYYY')}`;
    case 'golden-number':
      return get(row, 'golden') ?? '-';
    case 'silver-number':
      return get(row, 'silver') ?? '-';
    case 'bronze-number':
      return get(row, 'bronze') ?? '-';
    case 'total-number':
      return get(row, 'total') ?? '-';
    default:
      return get(row, col.dataKey) ?? '-';
  }
};

export const statsValueRender = (column: ColumnData, params: GridRenderCellParams) => {
  const { getDetailRoute } = useAppRoutes();

  switch (column.dataKey) {
    case 'competition':
      return <CompetitionChip data={params.row} extended={false} />;
    case 'competitionItem':
      return <CompetitionChip data={{ competition: params.row }} extended={false} />;
    case 'organisation':
      return (
        <OrganisationChip data={get(params.row, 'organisation')} extended={false} variant="body1" />
      );
    case 'countryOfBirth':
    case 'country':
      return (
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <CountryChip code={params.value} hideTitle={true} size={'small'} typoSize="body1" />
          <Typography variant="body1">{formatMasterCode(params.value)}</Typography>
        </Stack>
      );
    case 'nocs':
    case 'organisationCodes':
      return (
        <Stack>
          {get(params.row, column.dataKey)?.map((n: any, index: number) => (
            <OrganisationChip key={n.code + index} data={n} extended={false} variant="body1" />
          ))}
        </Stack>
      );
    case 'disciplineCodes':
      return (
        <Stack>
          {get(params.row, 'disciplineCodes')?.map((n: string) => (
            <DisciplineChip key={n} code={n} hideTitle={false} sizeNumber={18} />
          ))}
        </Stack>
      );
    case 'discipline':
      return (
        <DisciplineChip
          code={get(params.row, 'discipline.code')}
          title={get(params.row, 'discipline.title')}
          hideTitle={false}
          sizeNumber={18}
        />
      );
    case 'disciplines':
      return (
        <Stack>
          {get(params.row, 'disciplineCodes')?.map((n: any) => (
            <DisciplineChip
              key={n.code}
              code={n.code}
              title={n.title}
              hideTitle={false}
              sizeNumber={18}
            />
          ))}
        </Stack>
      );
    case 'golden':
      return (
        <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'golden'} size={18} />
      );
    case 'athlete':
      return (
        <TypographyLink
          value={params.value}
          route={getDetailRoute(EntityType.Person, params.row.id)}
        />
      );
    case 'noc':
      return (
        <TypographyLink
          value={params.value}
          route={getDetailRoute(EntityType.Noc, params.row.organisation.id)}
        />
      );
    case 'participant': {
      const participantType = params.row.participationId?.startsWith('IND')
        ? EntityType.Person
        : EntityType.Team;
      return (
        <TypographyLink
          value={params.value}
          route={
            params.row.participationId
              ? getDetailRoute(participantType, params.row.participationId)
              : undefined
          }
        />
      );
    }
    case 'silver':
      return (
        <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'silver'} size={18} />
      );
    case 'bronze':
      return (
        <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'bronze'} size={18} />
      );
    case 'total':
      return (
        <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'total'} size={18} />
      );
    default:
      return <Typography>{params.value}</Typography>;
  }
};
