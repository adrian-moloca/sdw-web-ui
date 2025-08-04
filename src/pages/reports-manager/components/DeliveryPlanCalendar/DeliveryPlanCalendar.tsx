import dayjs from 'dayjs';
import useApiService from 'hooks/useApiService';
import { EntityType, EnumType, useEnums } from 'models';
import { useModelConfig, useStoreCache } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { useColorScheme, useTheme } from '@mui/material';
import { MainCard } from 'components/cards/MainCard';

type Props = {
  type: EntityType;
};

export const DeliveryPlanCalendar = (props: Props) => {
  const { getDataSourceUrl, getConfig } = useModelConfig();
  const { getEnumValueOf } = useEnums();
  const { managerSetup, dataInfo } = useStoreCache();
  const theme = useTheme();
  const { mode } = useColorScheme();

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];

  const config = getConfig(props.type);
  const apiService = useApiService();
  const url = getDataSourceUrl(props.type);

  const variables = {
    enablePagination: true,
    rows: 1000,
    start: 0,
    editionId: managerSetup.currentEdition?.id,
  };

  const { data, isLoading } = useQuery({
    queryKey: [`${config.entityName}_index`],
    queryFn: () => apiService.filter(url, variables),
  });

  const events: Array<any> = isLoading
    ? []
    : data.content.map((e: any) => {
        const type = getEnumValueOf(e.type, EnumType.DeliveryType);
        const color =
          e.rate < 30
            ? theme.palette.error.main
            : e.rate < 50
              ? theme.palette.warning.main
              : theme.palette.primary.main;
        const codes = e.scope
          ?.map((x: string) => {
            const value = dataInfo.categories.find((y: any) => y.id == x || y.code == x);
            return value?.code;
          })
          .join(', ');

        return {
          id: e.id,
          title: `${type?.text}: ${codes}`,
          allDay: true,
          start: e.deliveryDate
            ? dayjs(e.deliveryDate).toISOString()
            : dayjs(e.scheduleDate).add(1, 'hour').toISOString(),
          color,
          extendedProps: { ...e, description: `${type?.text}: ${codes}` },
        };
      });

  events.push({
    title: managerSetup.currentEdition?.name,
    allDay: true,
    start: dayjs(managerSetup.currentEdition?.startDate).toISOString(),
    end: dayjs(managerSetup.currentEdition?.finishDate).toISOString(),
    color: theme.palette.primary.main,
    extendedProps: {
      scheduleDate: managerSetup.currentEdition?.startDate,
      rate: managerSetup.rate,
      dataRate: managerSetup.dataRate,
      status: 'Scheduled',
    },
  });

  return (
    <MainCard
      size="small"
      title="Calendar View"
      divider={false}
      expandable={true}
      headerSX={{ backgroundColor: color }}
    ></MainCard>
  );
};
