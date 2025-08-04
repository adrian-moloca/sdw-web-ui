import { Box } from '@mui/system';
import type { IPanelTabProps } from 'types/views';
import { BiographyBlock } from 'components/views';
import { GenericInfo } from 'components';

export const NocTab = (props: IPanelTabProps) => {
  const data = props.data.noc;
  return (
    <Box sx={{ px: 2 }}>
      <BiographyBlock data={props.data} field={'officialName'} />
      <BiographyBlock data={data} field={'generalBiography'} />
      <BiographyBlock data={data} field={'additionalInformation'} />
      <BiographyBlock data={data} field={'website'} title="Website" />
      <BiographyBlock data={data} field={'nocFoundedDate'} />
      <BiographyBlock data={data} field={'iocRecognitionYear'} />
      <BiographyBlock data={data} field={'president'} />
      <BiographyBlock data={data} field={'generalSecretary'} />
      <BiographyBlock data={data} field={'anthemComposer'} />
      <BiographyBlock data={data} field={'anthemTitle'} />
      <BiographyBlock data={data} field={'anthemInducted'} />
      <BiographyBlock data={data} field={'iocExecutiveBoard'} />
      <BiographyBlock data={data} field={'iocMembers'} />
      <BiographyBlock data={data} field={'extendedInfo.iOCHonoraryMember'} />
      <BiographyBlock data={data} field={'competingBiography'} title="Competing Biography" />
      <GenericInfo data={data} />
    </Box>
  );
};
