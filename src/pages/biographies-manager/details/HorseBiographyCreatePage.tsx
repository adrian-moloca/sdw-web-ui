import { EntityType } from 'models';
import { BiographyCreationWizard } from '../components';

const HorseBiographyCreatePage = () => {
  return <BiographyCreationWizard type={EntityType.HorseBiography} />;
};

export default HorseBiographyCreatePage;
