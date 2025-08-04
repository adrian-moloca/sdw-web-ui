import { CardContent, Table, TableBody, TableContainer } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PageContainer } from '@toolpad/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { t } from 'i18next';
import { useEffect } from 'react';
import sortedUniq from 'lodash/sortedUniq';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import baseConfig from 'baseConfig';
import { DisplayBox, ErrorPanel, MainCard, ViewSkeleton } from 'components';
import appConfig from 'config/app.config';
import {
  DataType,
  EntityType,
  EnumType,
  IConfigProps,
  IDisplayBoxProps,
  MenuFlagEnum,
  MergeEntitySubTypeEnum,
  MergeEntityTypeEnum,
  TemplateType,
} from 'models';
import { getBreadCrumbData } from 'utils/views';
import { MergeRequestControl } from './components';
import { BasicPageHeader } from 'layout/page.layout';
import useApiService from 'hooks/useApiService';
import useAppRoutes from 'hooks/useAppRoutes';
import { useSecurityProfile, useModelConfig, useStoreCache } from 'hooks';
import { formatAthleteName } from '_helpers';

const MergeRequestDetailsPage = () => {
  const { id } = useParams();
  const apiService = useApiService();
  const { checkPermission } = useSecurityProfile();
  const navigate = useNavigate();
  const { getIndexRoute } = useAppRoutes();
  const { getConfig: getModelConfig } = useModelConfig();
  const config = getModelConfig(EntityType.MergeRequest);
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Consolidation);
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: [`${config.entityName}_merge${id}`],
    queryFn: () =>
      apiService.getById(config, id ?? '', `${appConfig.apiEndPoint}${config.apiNode}`),
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
  });

  const isEmpty = (obj: any) => Object.keys(obj).length === 0;

  const getConfig = (): IConfigProps => {
    if (data?.entitySubType === MergeEntitySubTypeEnum.Horse)
      return getModelConfig(EntityType.Horse);
    if (data?.entitySubType === MergeEntitySubTypeEnum.Person)
      return getModelConfig(EntityType.Person);
    switch (data?.entityType) {
      case MergeEntitySubTypeEnum.Person:
      case MergeEntityTypeEnum.Individual:
        return getModelConfig(EntityType.Person);
      case MergeEntityTypeEnum.Horse:
        return getModelConfig(EntityType.Horse);
      case MergeEntityTypeEnum.Organization:
        return getModelConfig(EntityType.Organization);
      case MergeEntityTypeEnum.Team:
        return getModelConfig(EntityType.Team);
      case MergeEntityTypeEnum.Venue:
        return getModelConfig(EntityType.Venue);
      default:
        return getModelConfig(EntityType.Person);
    }
  };

  useEffect(() => {
    handleMetadata(getConfig().type);
  }, [isLoading]);

  const metaData = getMetadata(getConfig().type);
  const displayBoxes: IDisplayBoxProps[] = [
    { field: 'status', title: t('common.status'), enum: EnumType.MergeStatus },
    { field: 'conflictStatus', title: t('common.error'), enum: EnumType.ConflictStatus },
    { field: 'entityType', title: t('common.type'), enum: EnumType.MergeEntityType },
    {
      field: 'entitySubType',
      title: t('common.subtype'),
      enum: EnumType.MergeEntitySubType,
    },
    { field: 'type', title: t('common.mode'), enum: EnumType.MergeType },
    { field: 'ingestOrganisations', title: t('common.sources'), template: TemplateType.Tags },
    { field: 'createdTs', title: t('common.createdOn'), template: TemplateType.Timestamp },
    { field: 'updatedTs', title: t('common.modifiedOn'), template: TemplateType.Timestamp },
  ];

  const getName = () => {
    if (isLoading || error) {
      return t('common.unknown');
    }

    if (data?.entitySubType === MergeEntitySubTypeEnum.Person) {
      if (isEmpty(data.consolidationRecord)) {
        const buildDisplay = data.records.map((x: any) => formatAthleteName(x));
        const uniqueNames = uniq(buildDisplay);
        if (uniqueNames.length > 0) {
          return uniqueNames.join(' | ');
        }

        return t('common.unknown');
      }
      return formatAthleteName(data.consolidationRecord);
    } else if (isEmpty(data.consolidationRecord)) {
      const buildDisplay = data.records.map((x: any) => {
        const value = get(x, getConfig().displayAccessor) ?? '';
        return value;
      });

      const uniqueNames = uniq(buildDisplay);
      if (uniqueNames.length > 0) {
        return uniqueNames.join(' | ');
      }

      return t('common.unknown');
    }
    return get(data, config.displayAccessor) ?? '';
  };

  const breadCrumbs = getBreadCrumbData(data, config);
  if (isLoading) {
    return (
      <PageContainer
        maxWidth="xl"
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ViewSkeleton />
      </PageContainer>
    );
  }
  if (error)
    return (
      <PageContainer
        maxWidth="xl"
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ErrorPanel error={error} />
      </PageContainer>
    );
  if (!data)
    return (
      <PageContainer
        maxWidth="xl"
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ErrorPanel error={`Ups! ${config.display} not found`} />
      </PageContainer>
    );

  const sortedConflicts = sortedUniq(data.conflicts);
  const sortedConflictField = sortedConflicts.map((e: any) => e.attribute);

  let sortedOtherFields = sortedUniq(
    Object.keys(metaData ?? data.records[0]).filter(
      (e) => !sortedConflictField.includes(e) && e != 'id'
    )
  );

  if (getConfig().type === EntityType.Person && metaData) {
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'PERSON'
    );
  } else if (getConfig().type === EntityType.Horse && metaData) {
    // eslint-disable-next-line
    sortedOtherFields = sortedOtherFields.filter(
      (e) => !get(metaData[e], 'entity') || metaData[e].entity === 'HORSE'
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      title={getName()}
      breadcrumbs={breadCrumbs}
      slots={{ header: BasicPageHeader }}
    >
      <Grid container spacing={baseConfig.gridSpacing}>
        <Grid size={12}>
          <MainCard boxShadow={false} border={false}>
            <CardContent sx={{ paddingBottom: '0!important', p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {displayBoxes.map((box, i) => (
                      <DisplayBox
                        {...box}
                        key={`${i}_boxes`}
                        value={get(data, box.field)}
                        icon={box.icon}
                        type={box.type ?? DataType.String}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MergeRequestControl
            id={id!}
            type={getConfig().type}
            onFinish={() => navigate(getIndexRoute(EntityType.MergeRequest))}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MergeRequestDetailsPage;
