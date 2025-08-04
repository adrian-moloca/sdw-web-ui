import { useDispatch } from 'react-redux';
import { Stack, Typography } from '@mui/material';
import { MainCard, OrganisationAvatar } from 'components';
import { drawerActions } from 'store';
import { EditionMode, EntityType } from 'models';
import { formatMasterCode } from '_helpers';

type Props = {
  data: any;
  discipline: string;
};

export const CompetitorNode = ({ data, discipline }: Props) => {
  const dispatch = useDispatch();

  return (
    <MainCard
      content={false}
      border={false}
      divider={false}
      title={
        <Stack direction={'row'} alignItems="center" justifyContent="space-between" width="100%">
          <Typography textAlign="left" lineHeight={1.1}>
            {data.participationName ?? data.name}
          </Typography>
          <Typography textAlign="left" lineHeight={1.1}>
            {data.result.value ?? formatMasterCode(data.result.irm)}
          </Typography>
        </Stack>
      }
      avatar={<OrganisationAvatar data={data} size="medium" />}
      onClick={() =>
        dispatch(
          drawerActions.setSelectedItem({
            item: { data, discipline },
            type: EntityType.Competitor,
            mode: EditionMode.Detail,
          })
        )
      }
    />
  );
};
