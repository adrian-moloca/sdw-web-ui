import { CountryChip } from 'components/CountryChip';
import get from 'lodash/get';

interface OAProps {
  data: any;
  size: 'medium' | 'large';
}
export const OrganisationAvatar: React.FC<OAProps> = ({ data, size }: OAProps) => {
  const code = get(data, 'organisation.country');
  return <CountryChip code={code} size={size} hideTitle={true} />;
};
