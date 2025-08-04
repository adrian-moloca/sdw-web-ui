import get from 'lodash/get';
import { getDisciplineCode } from '_helpers';

export const getReportVersion = (data: any): number => {
  return data?.OdfBody._attributes.Version;
};

export const getReportFormat = (
  data: any
): 'competition' | 'individual' | 'horse' | 'team' | 'noc' => {
  const isNotBiography = get(data?.OdfBody, 'Competition.Document');
  const isParticipant = get(data?.OdfBody, 'Competition.ParticipantBiography');
  const isTeam = get(data?.OdfBody, 'Competition.TeamBiography');
  const isHorse = get(data?.OdfBody, 'Competition.HorseBiography');

  if (isNotBiography) return 'competition';
  if (isParticipant) return 'individual';
  if (isTeam) return 'team';
  if (isHorse) return 'horse';

  return 'noc';
};

export const getReportDisciplineCode = (data: any): string => {
  const format = getReportFormat(data);

  switch (format) {
    case 'competition':
      return getDisciplineCode(data.OdfBody?._attributes.DocumentCode);
    case 'individual': {
      const discipline =
        data.OdfBody?.Competition.ParticipantBiography.Discipline._attributes.Code.toString();
      return getDisciplineCode(discipline.substring(0, 3));
    }
    case 'horse': {
      const discipline =
        data.OdfBody?.Competition.HorseBiography.Discipline._attributes.Code.toString();
      return getDisciplineCode(discipline.substring(0, 3));
    }
    case 'team': {
      const discipline =
        data.OdfBody?.Competition.TeamBiography.Discipline._attributes.Code.toString();
      return getDisciplineCode(discipline.substring(0, 3));
    }
    default:
      return 'ATH';
  }
};

export const getReportSubtitle = (data: any): string | undefined => {
  const format = getReportFormat(data);

  switch (format) {
    case 'competition':
      return data?.OdfBody.Competition?.Document.Title._cdata;
    case 'individual':
      return data.OdfBody?.Competition.ParticipantBiography._attributes.ExternalCode;
    case 'horse':
      return data.OdfBody?.Competition.HorseBiography._attributes.ExternalCode;
    case 'team':
      return data.OdfBody?.Competition.TeamBiography._attributes.ExternalCode;
    case 'noc':
      return data.OdfBody?.Competition.Organisation._attributes.ExternalCode;
    default:
      return undefined;
  }
};
