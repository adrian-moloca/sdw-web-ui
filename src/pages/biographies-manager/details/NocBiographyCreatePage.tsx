import { EntityType } from 'models';
import { BiographyCreationWizard } from '../components';

const NocBiographyCreatePage = () => {
  return <BiographyCreationWizard type={EntityType.NocBiography} />;
};

export default NocBiographyCreatePage;
