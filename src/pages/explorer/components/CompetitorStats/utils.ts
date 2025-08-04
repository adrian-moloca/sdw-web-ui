import { StatItem, UnifiedStat } from 'types/explorer';

export const unifyStats = (competitors: any[]): UnifiedStat[] => {
  const map = new Map<string, UnifiedStat>();
  const buildCompetitorStat = (stat: StatItem, competitor: any) => ({
    ...stat,
    id: competitor.id,
    name: competitor.name,
  });

  for (const competitor of competitors) {
    const stats: StatItem[] = competitor?.statsTable?.stats ?? [];

    for (const stat of stats) {
      if (!map.has(stat.field)) {
        map.set(stat.field, {
          code: stat.field,
          competitors: [],
        });
      }

      const unified = map.get(stat.field)!;
      unified.competitors.push(buildCompetitorStat(stat, competitor));
    }
  }

  return Array.from(map.values());
};
