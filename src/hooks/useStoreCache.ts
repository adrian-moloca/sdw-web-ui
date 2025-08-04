import {
  DisplayEntry,
  EntityType,
  Entry,
  MasterData,
  masterDataCategories,
  MasterDataCategory,
  MetadataModel,
} from 'models';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  IManagerSetup,
  IMetadataDataEntity,
  IMetadataState,
  IDataState,
  managerActions,
  metadataActions,
  dataActions,
  RootState,
} from 'store';
import useApiService from './useApiService';
import appConfig from 'config/app.config';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelConfig } from './useModelConfig';
import { useTranslation } from 'react-i18next';
import { formatMasterCode, humanize } from '_helpers';

export type UseStoreCache = {
  metadata: IMetadataState;
  dataInfo: IDataState;
  managerSetup: IManagerSetup;
  getMetadata: (type: EntityType) => { [key: string]: MetadataModel } | undefined;
  handleMetadata: (type: EntityType) => Promise<void>;
  handleHidden: (type: EntityType) => Promise<void>;
  handleManagerSetup: () => Promise<void>;
  handleDataInfo: () => Promise<void>;
  handleMasterDataInfo: () => Promise<void>;
  hasManagerSetup: boolean;
  hasMetadata: (type: EntityType) => boolean;
  getDisciplineEntry: (code: string) => Entry;
  getMasterDataValue: (code: string, category: MasterDataCategory) => Entry;
  getSourceEntry: (code: string) => DisplayEntry;
  getReportCategoryEntry: (code: string) => DisplayEntry;
  clearEditions: () => void;
  clearNocs: () => void;
  clearMetadata: () => void;
  clearReportSetup: () => void;
};
export function useStoreCache(): UseStoreCache {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const metadata = useSelector((x: RootState) => x.metadata);
  const managerSetup = useSelector((x: RootState) => x.manager);
  const dataInfo = useSelector((x: RootState) => x.data);
  const dispatch = useDispatch<AppDispatch>();
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const isEmptyManager = !managerSetup?.currentEdition?.code;
  const checkMetadata = (type: EntityType) => {
    return !hasMetadata(parseEntityType(type), metadata.data);
  };
  const hasMetadata = (type: EntityType, data: Array<IMetadataDataEntity>): boolean =>
    data.filter((e) => e.key == type).length > 0;
  const getMetadata = (
    type: EntityType,
    data: Array<IMetadataDataEntity>
  ): { [key: string]: MetadataModel } | undefined => data.find((e) => e.key == type)?.model;
  const parseEntityType = (type: EntityType): EntityType => {
    let entityType = type;
    if (type == EntityType.PersonBiography || type == EntityType.QualifiedAthlete)
      entityType = EntityType.Person;
    if (type == EntityType.HorseBiography || type == EntityType.QualifiedHorse)
      entityType = EntityType.Horse;
    if (type == EntityType.TeamBiography || type == EntityType.QualifiedTeam)
      entityType = EntityType.Team;
    if (type == EntityType.NocBiography) entityType = EntityType.Noc;
    if (type == EntityType.Edition) entityType = EntityType.Competition;
    return entityType;
  };
  const getInnerMetadata = (type: EntityType) => {
    handleMetadata(type);
    return getMetadata(parseEntityType(type), metadata.data);
  };
  const clearEditions = () => dispatch(dataActions.clearEditions());
  const clearNocs = () => dispatch(dataActions.clearNocs());
  const handleMetadata = useCallback(
    async (type: EntityType): Promise<void> => {
      if (!hasMetadata(parseEntityType(type), metadata.data)) {
        const data = await apiService.getMetadata(parseEntityType(type));
        dispatch(metadataActions.setMetadata({ key: parseEntityType(type), model: data }));
      }
    },
    [hasMetadata]
  );
  const handleHidden = useCallback(
    async (type: EntityType): Promise<void> => {
      if (!metadata.hasHidden) {
        const config = getConfig(parseEntityType(type));
        const data = await apiService.getHidden(config);
        dispatch(metadataActions.setHidden(data.content.map((e) => e.competitionId)));
      }
    },
    [metadata.hasHidden]
  );
  const handleManagerSetup = useCallback(async (): Promise<void> => {
    if (isEmptyManager) {
      const data = await apiService.getManagerSetup();
      dispatch(managerActions.setSetup(data));
    }
  }, [isEmptyManager]);

  const handleDataInfo = useCallback(async (): Promise<void> => {
    if (!dataInfo.editions || dataInfo.editions.length == 0) {
      const editions = await apiService.fetch(`${appConfig.reportManagerEndPoint}/setup/editions`);
      dispatch(dataActions.setEditions(editions));
    }
    if (!dataInfo.categories || dataInfo.categories.length == 0) {
      const categories = await apiService.fetch(
        `${appConfig.reportManagerEndPoint}/setup/categories`
      );
      dispatch(dataActions.setCategories(categories));
    }
    if (!dataInfo.reportSources || dataInfo.reportSources.length == 0) {
      const reportSources = await apiService.fetch(
        `${appConfig.reportManagerEndPoint}/setup/sources`
      );
      dispatch(dataActions.setReportSources(reportSources));
    }
    if (!dataInfo.metaFields || dataInfo.metaFields.length == 0) {
      const metaFields = await apiService.fetch(
        `${appConfig.reportManagerEndPoint}/setup/metadata`
      );
      dispatch(dataActions.setMetaFields(metaFields));
    }
  }, [
    dataInfo.editions,
    dataInfo.sources,
    dataInfo.categories,
    dataInfo.metaFields,
    dataInfo.reportSources,
  ]);
  const handleMasterDataInfo = useCallback(async (): Promise<void> => {
    const config = getConfig(EntityType.Entry);
    const variables: any = {
      enablePagination: true,
      languageCode: i18n.language.toUpperCase(),
      rows: 3000,
      start: 0,
    };
    const url = `${appConfig.masterDataEndPoint}${config.apiNode}/`;
    for (const category of masterDataCategories) {
      if (!dataInfo[category] || dataInfo[category].length === 0) {
        const response = await apiService.getMasterData(`${url}${category}`, variables);
        if (!dataInfo[category] || dataInfo[category].length === 0) {
          dispatch(dataActions.setMasterData({ category, data: response.content }));
        }
      }
    }
    if (!dataInfo.sources || dataInfo.sources.length == 0) {
      const sources = await apiService.fetch(`${appConfig.apiUsdmEndPoint}/common/sources`);
      dispatch(dataActions.setSources(sources));
    }
  }, [dataInfo, i18n.language]);

  const getDisciplineCode = (code: string): Entry => {
    const emptyEntry = { id: '', key: '', categoryKey: MasterData.Discipline, value: '' };
    if (!code) return emptyEntry;
    if (typeof code !== 'string') return emptyEntry;
    if (code.toUpperCase().startsWith('SDC-')) return emptyEntry;
    return (
      dataInfo[MasterData.Discipline].find(
        (y) => code == y.key || `${MasterData.Discipline}${code}` == y.key
      ) ?? emptyEntry
    );
  };

  const getMasterDataValue = (code: string, category: MasterDataCategory): Entry => {
    const emptyEntry = {
      id: '',
      key: code,
      categoryKey: category,
      value: humanize(formatMasterCode(code)),
    };
    if (!code) return emptyEntry;
    if (typeof code !== 'string') return emptyEntry;
    return (
      dataInfo[category]?.find((y) => {
        const key = y.key.toLowerCase();
        const codeLower = code.toLowerCase();
        const categoryLower = category.toLowerCase();
        return (
          key === codeLower ||
          key === `${categoryLower}${codeLower}` ||
          key === `${categoryLower}$${codeLower}`
        );
      }) ?? emptyEntry
    );
  };

  const getSourceEntry = (code: string): DisplayEntry => {
    const emptyEntry = { id: '', code: '', title: '' };
    if (!code) return emptyEntry;
    return dataInfo.sources.find((y) => code == y.code || code == y.id) ?? emptyEntry;
  };
  const getReportCategoryEntry = (code: string): DisplayEntry => {
    const emptyEntry = { id: '', code: '', title: '' };
    if (!code) return emptyEntry;
    return dataInfo.categories.find((y) => code == y.code || code == y.id) ?? emptyEntry;
  };
  const clearMetadata = () => {
    dispatch(metadataActions.clearMetadata());
    dispatch(dataActions.clear());
    navigate('/');
  };

  const clearReportSetup = () => {
    dispatch(managerActions.reset());
    dispatch(dataActions.clear());
    navigate('/');
  };
  return {
    managerSetup,
    dataInfo,
    metadata,
    handleMetadata,
    handleHidden,
    handleManagerSetup,
    handleDataInfo,
    handleMasterDataInfo,
    hasManagerSetup: !isEmptyManager,
    hasMetadata: checkMetadata,
    getMetadata: getInnerMetadata,
    getDisciplineEntry: getDisciplineCode,
    getMasterDataValue: getMasterDataValue,
    getSourceEntry,
    getReportCategoryEntry,
    clearNocs,
    clearEditions,
    clearMetadata,
    clearReportSetup,
  };
}
