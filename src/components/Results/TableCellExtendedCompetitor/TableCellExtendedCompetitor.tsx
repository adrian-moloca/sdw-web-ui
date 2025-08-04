import { Stack, Typography } from '@mui/material';
import { transformOdfExtensions } from '_helpers';
import get from 'lodash/get';
import { EditionMode, EntityType } from 'models';
import { useDispatch } from 'react-redux';
import { drawerActions } from 'store';
import { RCProps } from 'types/explorer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const ExtendedCompetitorChip: React.FC<RCProps> = ({
  data,
  discipline,
  frames,
}: RCProps) => {
  const extendedInfo = get(data, 'extendedInfo');
  const participantNames = get(data, 'participantNames');
  const miscellaneous =
    transformOdfExtensions(extendedInfo, 'odfExtensions', 'miscellaneous') ??
    transformOdfExtensions(extendedInfo, 'odfEventEntry', 'miscellaneous');
  const stats =
    transformOdfExtensions(data, 'stats', 'odfStatsTournament') ??
    transformOdfExtensions(extendedInfo, 'odfExtensions', 'stats');
  const hasInfo = extendedInfo ?? participantNames ?? miscellaneous ?? stats ?? frames;
  if (hasInfo) {
    return (
      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }} component={'span'}>
        <ExtendedCompetitorText {...{ data, discipline, frames }} />
        <InfoOutlinedIcon sx={{ fontSize: '14px', color: 'primary.dark' }} />
      </Stack>
    );
  }
  return <ExtendedCompetitorText {...{ data, discipline, frames }} />;
};

const ExtendedCompetitorText: React.FC<RCProps> = ({ data, discipline, frames }: RCProps) => {
  const dispatch = useDispatch();
  const name = get(data, 'name');
  const extendedInfo = get(data, 'extendedInfo');
  const participantNames = get(data, 'participantNames');
  const miscellaneous =
    transformOdfExtensions(extendedInfo, 'odfExtensions', 'miscellaneous') ??
    transformOdfExtensions(extendedInfo, 'odfEventEntry', 'miscellaneous');
  const stats =
    transformOdfExtensions(data, 'stats', 'odfStatsTournament') ??
    transformOdfExtensions(extendedInfo, 'odfExtensions', 'stats');
  const hasInfo = extendedInfo ?? participantNames ?? miscellaneous ?? stats ?? frames;
  return (
    <Typography
      variant="body1"
      onClick={() => {
        if (!hasInfo) return;
        dispatch(
          drawerActions.setSelectedItem({
            item: { data, discipline, frames },
            type: EntityType.Participant,
            mode: EditionMode.Create,
          })
        );
      }}
      sx={{
        alignItems: 'center',
        cursor: hasInfo ? 'pointer' : 'inherited',
        textDecoration: 'none',
        transition: 'text-decoration-color 0.2s ease-in-out',
        '&:hover': {
          textDecoration: hasInfo ? 'underline' : 'none',
          textDecorationStyle: 'dotted',
          textUnderlineOffset: '4px', // optional: spacing between text and underline
        },
      }}
    >
      {name}
    </Typography>
  );
};
