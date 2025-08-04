import { EntityType } from 'models';
import { BiographyCreationWizard } from '../components';

const PersonBiographyCreatePage = () => {
  return <BiographyCreationWizard type={EntityType.PersonBiography} />;
};

export default PersonBiographyCreatePage;
