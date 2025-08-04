import { TreeItem } from '@mui/x-tree-view';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import uniqBy from 'lodash/uniqBy';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AppDispatch, dataActions } from 'store';

type Props = {
  data: any;
};

export const ReportTreeItem = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const apiService = useApiService();
  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.data.next.key}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.data.next.key}`],
    queryFn: () => apiService.fetch(url),
  });

  useEffect(() => {
    dispatch(dataActions.setReport(data?.options));
  }, [isLoading, data]);

  return (
    <TreeItem key={props.data.key} itemId={props.data.key} label={props.data.title}>
      {uniqBy(data?.options, 'key').map((e: any, i: number) => (
        <TreeItem key={`${i}_${e.key}`} itemId={e.key} label={e.title} datatype={e.next?.key} />
      ))}
    </TreeItem>
  );
};
