import get from 'lodash/get';

export const hasInfo = (data: any): boolean => {
  const fieldsToCheck = [
    'startedCompeting',
    'reason',
    'ambition',
    'memorableAchievement',
    'milestones',
    'hero',
    'influence',
    'ritual',
    'sportingRelatives',
    'injuries',
    'generalBiography',
    'summary',
    'officialBiography',
    'officialAppointment',
    'coachingBiography',
    'coachingAppointment',
    'coachingWinLoss',
    'training',
    'awards',
  ];
  return fieldsToCheck.some((field) => get(data, field) || get(data, `extendedInfo${field}`));
};

export const hasGeneralInfo = (data: any): boolean => {
  const fieldsToCheck = [
    'nickname',
    'otherNames',
    'previousNames',
    'hand',
    'positionStyle',
    'clubName',
    'nationalTeam',
    'nationalLeague',
    'family',
    'maritalStatus',
    'coach',
    'spokenLanguages',
    'profilePage',
    'education',
    'occupation',
    'hobbies',
    'otherSports',
    'otherRoles',
    'sponsors',
    'favoriteGame',
    'favoriteSong',
  ];

  const extendedOnlyFields = ['familyRelations', 'familyRelations_2'];

  return fieldsToCheck.some(
    (field) =>
      get(data, field) ||
      get(data, `extendedInfo${field}`) ||
      extendedOnlyFields.some((field) => get(data, `extendedInfo${field}`))
  );
};
