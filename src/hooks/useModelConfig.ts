import { formatMasterCode } from '_helpers';
import appConfig from 'config/app.config';
import { t } from 'i18next';
import { EntityType, IConfigProps, IQueryProps, MasterData, MasterDataCategory } from 'models';
import useModelDefinition from 'models/model.config';
type IMasterDataDisplayProps = Partial<Record<MasterDataCategory, string>>;
interface Props {
  getConfig: (type: EntityType) => IConfigProps;
  getDataSource: (type: EntityType) => IQueryProps;
  getDataSourceSetup: (type: EntityType) => IQueryProps;
  getDataSourceUrl: (type: EntityType) => string;
  parseEntityType: (type: EntityType) => EntityType;
  masterDataDisplay: IMasterDataDisplayProps;
  hasDisciplineRecords: (type: string) => boolean;
}
export function useModelConfig(): Props {
  const { modelConfig } = useModelDefinition();

  const masterDataDisplay: IMasterDataDisplayProps = {
    [MasterData.Country]: t('general.countries'),
    [MasterData.Discipline]: t('general.disciplines'),
    [MasterData.SportGender]: t('general.eventGenders'),
    [MasterData.PersonGender]: t('general.genders'),
    [MasterData.OrganisationType]: t('general.organisations'),
    [MasterData.EventType]: t('general.events'),
    [MasterData.Noc]: t('general.nocs'),
    [MasterData.Function]: t('common.function'),
    [MasterData.CompetitionCategory]: t('general.competitionCategories'),
    [MasterData.RoundType]: t('general.roundTypes'),
    [MasterData.Sport]: t('general.sports'),
    [MasterData.AwardSubClass]: t('general.awards'),
    [MasterData.Continent]: t('general.continent'),
    [MasterData.UnitType]: t('general.unitTypes'),
    [MasterData.RecordType]: t('general.record-types'),
    [MasterData.TeamType]: t('general.teams'),
    [MasterData.StageType]: t('general.stages'),
    [MasterData.PhaseType]: t('general.phases'),
    [MasterData.HorseGender]: t('general.sex'),
    [MasterData.HorseColor]: t('horse.colour'),
    [MasterData.ScheduleStatus]: t('common.status'),
    [MasterData.ScheduleType]: t('general.type'),
  };
  const disciplinesWithRecords: string[] = [
    'SDIS$ARC-O',
    'SDIS$ARC',
    'SDIS$ATH',
    'SDIS$CLB',
    'SDIS$CMA',
    'SDIS$CSP',
    'SDIS$CTR',
    'SDIS$FEN',
    'SDIS$MPN',
    'SDIS$ROW',
    'SDIS$SHO',
    //'SDIS$SJP',
    'SDIS$SPS',
    'SDIS$SSK',
    'SDIS$STK',
    'SDIS$SWM',
    'SDIS$WLF',
  ];
  const hasDisciplineRecords = (type: string) => {
    return (
      disciplinesWithRecords.includes(type) ||
      disciplinesWithRecords.map((x) => formatMasterCode(x)).includes(type)
    );
  };
  const getConfig = (type: EntityType) => {
    return modelConfig[type];
  };
  const getDataSource = (type: EntityType) => {
    const config = getConfig(type);
    return {
      url: getDataSourceUrl(type),
      apiVersion: config?.apiVersion,
      queryKey: config?.apiNode,
    };
  };
  const getDataSourceSetup = (type: EntityType) => {
    const config = getConfig(type);
    if (type == EntityType.NocBiography) {
      return {
        url: `${appConfig.biographiesManagerEndPoint}/shared${config?.apiNode}`,
        apiVersion: config?.apiVersion,
        queryKey: config?.apiNode,
      };
    }
    return {
      url: `${appConfig.reportManagerEndPoint}/setup${config?.apiNode}`,
      apiVersion: config?.apiVersion,
      queryKey: config?.apiNode,
    };
  };
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
  const getDataSourceUrl = (type: EntityType) => {
    const config = getConfig(type);
    if (!config) return '';
    switch (type) {
      case EntityType.Report:
      case EntityType.ReportCategory:
      case EntityType.ReportVariation:
      case EntityType.ReportSection:
      case EntityType.ReportSource:
      case EntityType.ReportBlock:
      case EntityType.ReportField:
      case EntityType.Edition:
      case EntityType.DeliveryPlan:
      case EntityType.ReportDelivery:
      case EntityType.ReportFilter:
      case EntityType.DeliveryDataScope:
        return `${appConfig.reportManagerEndPoint}${config.apiNode}`;
      case EntityType.ExtractorParticipant:
        return `${appConfig.extractorEndPoint}${config.apiNode}/search`;
      case EntityType.PersonBiography:
      case EntityType.HorseBiography:
      case EntityType.TeamBiography:
      case EntityType.NocBiography:
      case EntityType.BiographyQuota:
        return `${appConfig.biographiesManagerEndPoint}${config.apiNode}`;
      case EntityType.OdfIngest:
        return `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_ODF}`;
      case EntityType.UsdfIngest:
        return `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_USDF}`;
      case EntityType.MergeRequest:
        return `${appConfig.apiEndPoint}${config.apiNode}/search`;
      case EntityType.QualifiedAthlete:
      case EntityType.QualifiedHorse:
      case EntityType.QualifiedTeam:
        return `${appConfig.reportEndPoint}${config.apiNode}`;
      default:
        return `${appConfig.apiUsdmEndPoint}${config.apiNode}`;
    }
  };
  return {
    getConfig,
    parseEntityType,
    getDataSource,
    getDataSourceSetup,
    getDataSourceUrl,
    masterDataDisplay,
    hasDisciplineRecords,
  };
}
