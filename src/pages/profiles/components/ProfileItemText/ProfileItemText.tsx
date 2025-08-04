import { ListItem, ListItemText } from '@mui/material';
import { containsHtmlTags, isNullOrEmpty, stripHtmlTags } from '_helpers';

type Props = { title?: string; value?: string; lengthControl?: boolean; boldTitle?: boolean };

export const ProfileItemText = (props: Props) => {
  if (!props.title) return null;
  if (isNullOrEmpty(props.title)) return null;

  const title = props.title;
  if (props.lengthControl === true && title.length > 40) return null;

  const hasBoldTitle = props.boldTitle === true;
  const isHtml = typeof title === 'string' && containsHtmlTags(title);

  return (
    <ListItem sx={{ py: 0, alignItems: 'flex-start' }}>
      <ListItemText
        primary={props.value}
        sx={{
          textAlign: 'left',
          color: 'text.secondary',
          margin: 0,
          fontWeight: hasBoldTitle ? 'bold!important' : 'normal',
        }}
      />
      <ListItemText
        primary={isHtml ? stripHtmlTags(title) : title}
        sx={{ textAlign: 'right', margin: 0 }}
      />
    </ListItem>
  );
};
