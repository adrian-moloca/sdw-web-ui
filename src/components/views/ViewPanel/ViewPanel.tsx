import { ErrorPanel, ViewPageHeader } from 'components';
import { formatAthleteName, getDisciplineDirectCode } from '_helpers';
import { EditionMode, EntityType, ViewType } from 'models';
import React from 'react';
import { useParams } from 'react-router-dom';
import get from 'lodash/get';
import { ViewSkeleton } from 'components/skeletons';
import { useQuery } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import useConsolidation from 'hooks/useConsolidation';
import { getBreadCrumbData } from 'utils/views';
import { PageContainer } from '@toolpad/core';
import { BasicPageHeader } from 'layout/page.layout';
import { t } from 'i18next';
import { IViewPanelProps } from 'types/views';
import { ViewLayout } from 'components/views';
import { useSecurity } from 'hooks';

export function ViewPanel<T>(props: Readonly<IViewPanelProps<T>>): React.ReactElement {
  const apiService = useApiService();

  const { editUrl, hasMerge, hasEdit } = useConsolidation();
  const { canUpdate } = useSecurity(props.config.type, ViewType.View, false);

  const [showDetail, setShowDetail] = React.useState<boolean>(props.expandInfo);
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: [id, 'view', props.config.type, props.tags],
    queryFn: () => apiService.getById(props.config, id ?? '', props.dataSource?.url),
  });

  const url_id = props.config.type === EntityType.Noc ? id?.replace('ORN-', 'NOC-') : id;

  const { data: dataSetup, isLoading: isLoadingSetup } = useQuery({
    queryKey: [id, 'editFields', props.config.type, props.tags],
    queryFn: () => apiService.getById(props.config, url_id ?? '', editUrl),
    enabled: hasEdit(props.config.type),
    refetchOnMount: true,
  });

  const getElement = (): any => {
    if (isLoading || error) return {};
    if (props.config.type === EntityType.MergeRequest) return data;
    if (!data) return {};
    if (Array.isArray(data.data) && data.data.length == 0) return {};
    if (Array.isArray(data.data)) return data?.data[0];
    return data.data;
  };

  const getElementSetup = (): any =>
    isLoadingSetup
      ? { data: null, request: null }
      : { data: dataSetup?.data, request: dataSetup?.request };

  const canEdit = (): boolean =>
    props.config.type === EntityType.Competition ||
    props.config.type === EntityType.Discipline ||
    props.config.type === EntityType.Event
      ? canUpdate
      : hasMerge(props.config.type) && canUpdate;

  const getName = () => {
    if (isLoading || error || !data) return `${props.config.display} ${t('common.unknown')} `;

    const element = getElement();

    if (props.config.type == EntityType.Person) {
      return formatAthleteName(element);
    }

    if (props.config.type == EntityType.Discipline) {
      const title = get(element, 'title') ?? '';
      const code = get(element, 'sportDisciplineId') ?? '';
      return `${title} (${getDisciplineDirectCode(code, title)})`;
    }
    if (props.config.type == EntityType.Event) {
      const title = get(element, 'title') ?? '';
      const discipline = get(element, 'discipline.title') ?? '';
      return `${discipline} ${title}`;
    }
    return get(element, props.config.displayAccessor) ?? t('common.unknown');
  };

  const [editionMode, setEditionMode] = React.useState(EditionMode.Detail);
  const handleEditDefault = () => setEditionMode(EditionMode.Update);
  const handleOnClickEdit = () =>
    props.onClickEdit ? props.onClickEdit(getElement(), handleEditDefault) : handleEditDefault();

  const breadCrumbs = getBreadCrumbData(getElement(), props.config);

  const ViewPageHeaderComponent = React.useCallback(() => {
    return (
      <ViewPageHeader
        canEdit={canEdit()}
        config={props.config}
        title={getName()}
        element={getElement()}
        setup={getElementSetup()}
        breadcrumbs={breadCrumbs}
        toolbar={props.toolbar}
        handleOnClickEdit={handleOnClickEdit}
      />
    );
  }, [props.config, getName, getElement, getElementSetup]);

  if (isLoading)
    return (
      <PageContainer
        maxWidth={'xl'}
        title={''}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
        slotProps={{ header: { title: '', breadcrumbs: breadCrumbs } }}
      >
        <ViewSkeleton />
      </PageContainer>
    );

  if (error)
    return (
      <PageContainer
        maxWidth={'xl'}
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: ViewPageHeaderComponent }}
        slotProps={{ header: { title: getName(), breadcrumbs: breadCrumbs } }}
      >
        <ErrorPanel error={error} />
      </PageContainer>
    );

  if (!data)
    return (
      <PageContainer
        maxWidth={'xl'}
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: ViewPageHeaderComponent }}
        slotProps={{ header: { title: getName(), breadcrumbs: breadCrumbs } }}
      >
        <ErrorPanel error={`Ups! ${props.config.display} not found`} />
      </PageContainer>
    );

  if (props.overrideViewPanel) {
    return (
      <PageContainer
        maxWidth={'xl'}
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: ViewPageHeaderComponent }}
        slotProps={{ header: { title: getName(), breadcrumbs: breadCrumbs } }}
      >
        {props.overrideViewPanel(getElement(), getElementSetup(), props.config.type)}
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      title={getName()}
      breadcrumbs={breadCrumbs}
      slots={{ header: ViewPageHeaderComponent }}
      slotProps={{ header: { title: getName(), breadcrumbs: breadCrumbs } }}
    >
      <ViewLayout
        element={getElement()}
        setup={getElementSetup()}
        name={getName()}
        {...props}
        editionMode={editionMode}
        showEditButton={canEdit() && canUpdate}
        showDetail={showDetail}
        handleEditionMode={(mode: EditionMode) => setEditionMode(mode)}
        handleShowHideDetail={() => setShowDetail(!showDetail)}
        handleOnClickEdit={handleOnClickEdit}
      />
    </PageContainer>
  );
}
