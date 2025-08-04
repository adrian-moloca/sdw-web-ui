import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import { Entry, MasterData } from 'models';
import { useStoreCache } from 'hooks';

export const filterMedals = (
  data: any[],
  discipline: string | null,
  category: Entry | null,
  competition: string | null
) => {
  let filteredData = discipline ? data.filter((x: any) => x.discipline.title === discipline) : data;

  filteredData = category
    ? filteredData.filter((x: any) => x.competition.categories.includes(category.key))
    : filteredData;

  filteredData = competition
    ? filteredData.filter((x: any) => x.competition.title === competition)
    : filteredData;

  return filteredData;
};

export const getDisciplines = (data: any[]) => {
  const disciplines = orderBy(
    uniq(data.map((item: any) => item.discipline.title)),
    [(c: string) => c],
    ['asc']
  ) as string[];

  return disciplines;
};

export const getCompetitions = (data: any[]) => {
  const competitions = orderBy(
    uniq(data.map((item: any) => item.competition.title)),
    [(c: string) => c],
    ['asc']
  ) as string[];

  return competitions;
};

export const getCategories = (data: any[]) => {
  const { dataInfo } = useStoreCache();

  const flattenedData = data.flatMap((item: any) => item.competition.categories.map((x: any) => x));
  const selectedCategories = uniq(flattenedData);
  const result = dataInfo[MasterData.CompetitionCategory].filter((x) =>
    selectedCategories.includes(x.key)
  );

  return result;
};
