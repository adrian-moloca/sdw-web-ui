import { useParams } from 'react-router-dom';
import { HeadToHeadDisplay } from '../components';
import { extractValuesFromString } from '../utils/extract-values';

const HeadToHeadDetailsPage = () => {
  const { id } = useParams();
  const params = extractValuesFromString(id ?? '');

  return (
    <HeadToHeadDisplay
      discipline={params.discipline}
      id1={params.id1}
      id2={params.id2}
      gender={params.gender}
    />
  );
};

export default HeadToHeadDetailsPage;
