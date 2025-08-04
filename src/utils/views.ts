import { EntityType, IConfigProps } from '../models';
import { Breadcrumb } from '@toolpad/core';
import { t } from 'i18next';
import get from 'lodash/get';
import { ValidInfoEntities } from '../constants/views';
import { useModelConfig } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';

export const getBreadCrumbData = (element: any, config: IConfigProps): Breadcrumb[] => {
  const result: Array<Breadcrumb> = [];
  const { getConfig } = useModelConfig();
  const { baseRoutes } = useAppRoutes();
  if (config.type == EntityType.Report) {
    result.push({ title: config.area, path: '' });
    result.push({ title: t('general.reports'), path: `/${config.path}` });
    result.push({ title: get(element, 'variation.code'), path: '' });
    result.push({ title: get(element, config.displayAccessor), path: '' });
    return result;
  }
  if (config.type == EntityType.DeliveryPlan) {
    result.push({
      title: config.area,
      path: `/${baseRoutes.ReportControlPanel}#page=type%3D${config.entityName}`,
    });
    result.push({ title: config.displayPlural, path: '' });
    result.push({ title: get(element, config.displayAccessor) ?? '', path: '' });
    return result;
  }
  if (config.type == EntityType.ReportVariation) {
    result.push({
      title: config.area,
      path: `/${baseRoutes.ReportControlPanel}#page=type%3D${config.entityName}`,
    });
    result.push({ title: config.displayPlural, path: '' });
    result.push({ title: get(element, config.displayAccessor) ?? '', path: '' });
    return result;
  }
  result.push({ title: config.area, path: '' });
  const competitionConfig = getConfig(EntityType.Competition);
  const disciplineConfig = getConfig(EntityType.Discipline);
  if (config.parentPath && config.parentIdAccessor) {
    const title = config.parentDisplayAccessor
      ? get(element, config.parentDisplayAccessor)
      : get(element, config.parentIdAccessor);
    if (config.type == EntityType.Event) {
      result.push({ title: t('general.competitions'), path: `/${competitionConfig.path}` });
      result.push({
        title: get(element, 'competition.title'),
        path: `/${competitionConfig.path}/${get(element, 'competition.id')}`,
      });
      result.push({
        title,
        path: `/${disciplineConfig.path}/${get(element, 'discipline.id')}`,
      });
    } else if (config.type == EntityType.Discipline) {
      result.push({ title: t('general.competitions'), path: `/${competitionConfig.path}` });
      result.push({
        title,
        path: `/${competitionConfig.path}/${get(element, 'competition.id')}`,
      });
    } else {
      result.push({
        title,
        path: `/${config.parentPath}/${get(element, config.parentIdAccessor)}`,
      });
    }
  } else result.push({ title: config.displayPlural, path: `/${config.path}` });
  if (config.type == EntityType.HeadToHead) {
    result.push({ title: get(element, 'rounds[0].disciplineCode'), path: '' });
  }
  result.push({ title: get(element, config.displayAccessor) ?? config.display, path: '' });
  return result;
};

export const hasInfo = (data: any, config: IConfigProps): boolean => {
  switch (config.type) {
    case EntityType.Person:
    case EntityType.Horse:
      return (
        data.generalBiography ||
        data.competingBiography ||
        data.coachingBiography ||
        data.memorableAchievement ||
        data.clubName ||
        data.summary ||
        data.coach ||
        data.occupation ||
        data.family ||
        data.education ||
        data.hero ||
        data.ambition ||
        data.hobbies ||
        data.injuries ||
        data.milestones ||
        data.officialBiography ||
        data.officialAppointment ||
        data.startedCompeting ||
        get(data, 'extendedInfo')
      );
    case EntityType.Team:
      return (
        data.generalBiography ||
        data.competingBiography ||
        data.biography ||
        data.summary ||
        data.awards ||
        data.training ||
        get(data, 'extendedInfo')
      );
    case EntityType.Competition:
      return (
        data.information ||
        data.extendedInfo ||
        data.mediaInformation ||
        data.travelInformation ||
        data.contact ||
        get(data, 'extendedInfo')
      );
    case EntityType.Event:
      return get(data, 'special') || get(data, 'extendedInfo.summary') || get(data, 'extendedInfo');
    case EntityType.Organization:
      return data.summary || data.generalBiography || data.competingBiography || data.extendedInfo;
    case EntityType.Venue:
      return data.summary || get(data, 'extendedInfo');
    default:
      return get(data, 'extendedInfo');
  }
};

export const hasInfoPanel = (config: IConfigProps, data: any): boolean => {
  if (!data) return false;

  return ValidInfoEntities.includes(config.type) && hasInfo(data, config);
};
