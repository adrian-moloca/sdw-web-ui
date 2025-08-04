import { EntityType } from 'models';
import { BiographyCreationWizard } from '../components';

const TeamBiographyCreatePage = () => {
  return <BiographyCreationWizard type={EntityType.TeamBiography} />;
};

export default TeamBiographyCreatePage;
