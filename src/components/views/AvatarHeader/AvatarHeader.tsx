import get from 'lodash/get';
import { t } from 'i18next';
import { EntityType, IConfigProps } from 'models';
import { AthleteAvatar } from 'components/AthleteAvatar';
import { AvatarBox } from 'components/AvatarBox';
import { CountryChip } from 'components/CountryChip';
import { useMediaQuery } from '@mui/system';

interface Props {
  element: any;
  config: IConfigProps;
  size?: string;
}
export const AvatarHeader = ({ element, config, size }: Props) => {
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const sizePerson = size ?? (matchDownSM ? '9rem' : '10rem');
  const sizeTeam = size ?? (matchDownSM ? '8rem' : '9rem');
  const displayName = get(element, config.displayAccessor) ?? t('common.unknown');

  const getFirstImage = (images: string): string => {
    return images.indexOf(';') >= 0 ? images.split(';')[0] : images;
  };

  const renderAthleteAvatar = (size: string, alt: string, src?: string) => (
    <AthleteAvatar size={size} alt={alt} src={src} />
  );

  const renderCountryAvatar = (code: string, alt: string, size: string) => (
    <CountryChip code={code} title={alt} sizeNumber={size} hideTitle={true} />
  );

  const renderAvatarBox = (size: 'large' | 'xlarge', image?: string, isoCode?: string) => (
    <AvatarBox size={size} variant="rounded" text={displayName} image={image} isoCode={isoCode} />
  );

  switch (config.type) {
    case EntityType.Person:
    case EntityType.PersonBiography:
    case EntityType.Participant:
      return element.profileImages
        ? renderAthleteAvatar(sizePerson, displayName, getFirstImage(element.profileImages))
        : renderAthleteAvatar(sizePerson, displayName);

    case EntityType.Team:
    case EntityType.TeamBiography:
      if (element.profileImages) {
        return renderAthleteAvatar(sizePerson, displayName, getFirstImage(element.profileImages));
      }
      if (element.nationality) {
        return renderCountryAvatar(element.nationality, displayName, sizeTeam);
      }
      return renderAthleteAvatar(sizeTeam, displayName);

    case EntityType.Competition:
      if (element.logo) {
        return renderAvatarBox('large', element.logo);
      }
      if (element.country) {
        return renderAvatarBox('large', undefined, element.country);
      }
      return null;
    case EntityType.Noc:
    case EntityType.NocBiography:
    case EntityType.Organization:
      return element.country ? renderAvatarBox('xlarge', undefined, element.country) : null;
    case EntityType.Discipline:
    case EntityType.Event:
    default:
      return null;
  }
};
