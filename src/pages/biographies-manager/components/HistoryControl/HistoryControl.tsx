import { Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { EntityType, EnumType, useEnums } from 'models';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import ScheduleTwoTone from '@mui/icons-material/ScheduleTwoTone';
import { SectionCard } from 'components/cards/SectionCard';

type Props = {
  type: EntityType;
  data: any;
};

export const HistoryControl = (props: Props): React.ReactElement | null => {
  const apiService = useApiService();
  const { getEnumValueOf } = useEnums();

  const notHistory = ![
    EntityType.PersonBiography,
    EntityType.HorseBiography,
    EntityType.TeamBiography,
    EntityType.NocBiography,
  ].includes(props.type);

  const url = `${appConfig.biographiesManagerEndPoint}/shared/${props.data.id}/history`;

  const { data, isLoading } = useQuery({
    queryKey: [`${props.data.id}_history`],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
    enabled: !notHistory,
  });

  if (notHistory) return null;

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  if (!data?.data?.length) return null;

  return (
    <Grid size={12}>
      <SectionCard
        avatar={
          <Badge color="primary" badgeContent={data?.data?.length} showZero>
            <ScheduleTwoTone />
          </Badge>
        }
        title="History"
        defaultExpanded={false}
      >
        <List dense tabIndex={0}>
          {data?.data?.map((x: any, index: number) => {
            const action = getEnumValueOf(x.action, EnumType.BiographyAction);
            const Icon = action?.icon;

            return (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: action?.color,
                      '&:hover': {
                        //you want this to be the same as the backgroundColor above
                        backgroundColor: action?.color,
                        color: 'white',
                      },
                    }}
                  >
                    {Icon && <Icon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${action?.text.toUpperCase()} by ${x.updatedBy}`}
                  secondary={dayjs(x.Ts).format('dddd, Do MMMM YYYY, h:mm:ss A')}
                />
              </ListItem>
            );
          })}
        </List>
      </SectionCard>
    </Grid>
  );
};
