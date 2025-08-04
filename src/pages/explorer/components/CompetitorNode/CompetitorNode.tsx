import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { MainCard, OrganisationAvatar } from 'components';
import { drawerActions } from 'store';
import { EditionMode, EntityType } from 'models';

type Props = {
  data: any;
  discipline: string;
};

export const CompetitorNode = ({ data, discipline }: Props) => {
  const dispatch = useDispatch();

  return (
    <MainCard
      content={false}
      headerSX={{ p: 1, height: 40 }}
      border={false}
      divider={false}
      title={
        <Typography textAlign="left" lineHeight={1.1}>
          {data.participationName ?? data.name}
        </Typography>
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
