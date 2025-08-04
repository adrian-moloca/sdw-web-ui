import { Avatar, Button, CardActions, CardContent, Chip, Stack, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { MainCard } from 'components/cards/MainCard';
import { t } from 'i18next';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import ReadMoreOutlined from '@mui/icons-material/ReadMoreOutlined';
import { Feature } from '../Feature';

type Props = {
  dataItem: any;
};

export const DocCard = ({ dataItem }: Props) => {
  const { name, category, link, benefits } = dataItem;
  const theme = useTheme();

  return (
    <MainCard
      title={name}
      size="small"
      divider={true}
      content={false}
      border={false}
      fullHeight
      headerSX={{ py: 1 }}
      avatar={
        <Avatar
          variant="rounded"
          sx={{
            borderColor: theme.palette.divider,
            borderWidth: 1,
            borderStyle: 'solid',
            bgcolor: theme.palette.background.paper,
            color: 'inherit',
          }}
        >
          <InventoryOutlined />
        </Avatar>
      }
      secondary={
        <Chip label={category.toUpperCase()} color="secondary" variant="outlined" size="small" />
      }
    >
      <CardContent>
        <Stack spacing={1} height="100%">
          {benefits.map((benefit: any, i: number) => (
            <Feature title={benefit} key={i} />
          ))}
        </Stack>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={Link}
          to={link}
          variant="outlined"
          disableElevation
          target="_blank"
          rel="noreferrer"
          startIcon={<ReadMoreOutlined />}
        >
          {t('actions.buttonGetStarted')}
        </Button>
      </CardActions>
    </MainCard>
  );
};
