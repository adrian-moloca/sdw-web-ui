import React, { ElementType } from 'react';
import { EntityType, EnumType, IMetaType, MasterData, MetadataModel, TemplateType } from 'models';
import {
  buildTemplateColumn,
  buildMasterDataColumn,
  buildRouteColumn,
  buildNameColumn,
  buildEnumColumn,
  buildDateColumn,
  buildExtractDisciplineColumn,
  buildCountryColumn,
  buildSourcesColumn,
  buildAthleteColumn,
  buildTemplateStatusColumn,
  buildTemplateRoleColumn,
  buildQueryStatusColumn,
  buildDropDownColumn,
  buildLodashColumn,
  buildNumericColumn,
  buildScopeColumn,
  buildProgressColumn,
  buildCompetitionCategories,
  buildEnumListColumn,
  buildDropDownDiscipline,
  buildDropDownEdition,
  buildSkippedColumn,
  buildCompetitionsColumn,
} from 'components';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import get from 'lodash/get';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeTwoTone';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import BedroomBabyOutlined from '@mui/icons-material/BedroomBabyOutlined';
import CallMergeOutlined from '@mui/icons-material/CallMergeOutlined';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import MilitaryTechOutlined from '@mui/icons-material/MilitaryTechOutlined';
import SportsKabaddiOutlined from '@mui/icons-material/SportsKabaddiOutlined';
import UpcomingOutlined from '@mui/icons-material/UpcomingOutlined';
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import { useStoreCache } from './useStoreCache';
import baseConfig from 'baseConfig';

interface Props {
  getColumns(
    type: EntityType,
    metadata?: { [key: string]: MetadataModel },
    onClick?: (data: any) => void
  ): GridColDef[];
  getIcon(type: EntityType): ElementType;
}
const useDataGridHelper = (): Props => {
  const { dataInfo } = useStoreCache();
  function boolColumn(
    field: string,
    headerName: string,
    width: number | undefined = undefined
  ): GridColDef {
    return {
      field,
      headerName,
      width: width ?? 100,
      type: 'boolean',
      editable: false,
    };
  }
  const defaultColumns = (metadata?: IMetaType): GridColDef[] => [
    buildSourcesColumn('sources', dataInfo.sources, t('common.sources')),
    buildTemplateColumn(
      'externalIds',
      t('common.externalIds'),
      TemplateType.ExpandableTags,
      metadata?.externalIds,
      120
    ),
  ];
  const defaultBioColumns: GridColDef[] = [
    buildEnumColumn('status', t('common.status'), EnumType.BioStatus, 130),
    buildTemplateColumn('completionRate', '%', TemplateType.Number, undefined, 80, true),
    buildTemplateColumn(
      'sensitiveInfo',
      t('general.sensitive-info'),
      TemplateType.SensitiveInfo,
      undefined,
      130,
      true,
      undefined,
      'boolean'
    ),
    buildTemplateColumn('ts', t('common.modifiedOn'), TemplateType.DateTime, undefined, 180, true),
    {
      field: 'accreditationId',
      headerName: t('general.accreditationId'),
      width: 150,
      filterable: true,
    },
    buildEnumColumn(
      'accreditationStatus',
      t('general.accreditationStatus'),
      EnumType.AccreditationStatus,
      160
    ),
    buildTemplateColumn(
      'createdTs',
      t('common.createdOn'),
      TemplateType.DateTime,
      undefined,
      180,
      true
    ),
    { field: 'updatedBy', headerName: t('common.user'), width: 200, filterable: true },
  ];
  const defaultReportColumns: GridColDef[] = [
    buildTemplateColumn('ts', t('common.modifiedOn'), TemplateType.DateTime, undefined, 180),
    { field: 'updatedBy', headerName: t('common.user'), width: 200 },
    boolColumn('inactive', 'Inactive', 80),
  ];
  const columnConfig: Record<EntityType, (metadata?: IMetaType) => GridColDef[]> = {
    [EntityType.Competition]: (metadata?: IMetaType) => [
      {
        field: 'title',
        headerName: t('general.competition'),
        width: 400,
        filterable: metadata?.title?.allowFiltering,
      },
      buildCountryColumn('country', dataInfo[MasterData.Country]),
      { field: 'region', headerName: t('general.region'), width: 260 },
      buildDateColumn(
        'startDate',
        t('general.startDate'),
        170,
        metadata?.startDate,
        baseConfig.dayDateFormat
      ),
      buildDateColumn(
        'finishDate',
        t('general.finishDate'),
        170,
        metadata?.finishDate,
        baseConfig.dayDateFormat
      ),
      { field: 'season', headerName: t('general.season'), width: 90 },
      buildCompetitionCategories('categories', dataInfo[MasterData.CompetitionCategory]),
      ...defaultColumns(metadata),
    ],
    [EntityType.Person]: (metadata?: IMetaType) => [
      buildTemplateColumn(
        'profileImages',
        '',
        TemplateType.Image,
        metadata?.profileImages,
        60,
        true,
        'displayName'
      ),
      buildNameColumn(300),
      { field: 'preferredFamilyName', headerName: t('general.familyName'), width: 230 },
      { field: 'preferredGivenName', headerName: t('general.givenName'), width: 160 },
      buildDateColumn('dateOfBirth', t('common.dateOfBirth'), 120, metadata?.dateOfBirth),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 100),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 200),
      buildCountryColumn(
        'countryOfBirth',
        dataInfo[MasterData.Country],
        t('common.country-of-birth'),
        200
      ),
      { field: 'height', headerName: t('general.height'), width: 100, type: 'number' },
      { field: 'weight', headerName: t('general.weight'), width: 100, type: 'number' },
      buildDateColumn('dateOfDeath', t('common.dateOfDeath'), 120, metadata?.dateOfDeath),
      ...defaultColumns(metadata),
    ],
    [EntityType.PersonBiography]: (metadata?: IMetaType) => [
      buildTemplateColumn(
        'profileImages',
        '',
        TemplateType.Image,
        metadata?.profileImages,
        60,
        true,
        'displayName'
      ),
      buildNameColumn(300),
      {
        field: 'preferredFamilyName',
        headerName: t('general.familyName'),
        width: 200,
        filterable: true,
      },
      {
        field: 'preferredGivenName',
        headerName: t('general.givenName'),
        width: 160,
        filterable: true,
      },
      buildDateColumn('dateOfBirth', t('common.dateOfBirth'), 120, metadata?.dateOfBirth),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 80),
      buildLodashColumn('noc.name', t('general.noc'), 'noc.name', 200),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 200),
      buildCountryColumn(
        'countryOfBirth',
        dataInfo[MasterData.Country],
        t('common.country-of-birth'),
        200
      ),
      buildEnumColumn('type', t('common.role'), EnumType.PersonType, 130),
      buildTemplateColumn(
        'disciplines',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        200
      ),
      ...defaultBioColumns,
    ],
    [EntityType.QualifiedAthlete]: (metadata?: IMetaType) => [
      { field: 'accreditationId', headerName: t('general.accreditationId'), width: 140 },
      buildNameColumn(300, ''),
      { field: 'familyName', headerName: t('general.familyName'), width: 200 },
      { field: 'givenName', headerName: t('general.givenName'), width: 200 },
      buildDateColumn('dateOfBirth', t('common.dateOfBirth'), 110, metadata?.dateOfBirth),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 80),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 200),
      buildCountryColumn(
        'organisation',
        dataInfo[MasterData.Country],
        t('general.organisation'),
        200
      ),
      buildTemplateColumn(
        'disciplineCode',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        220,
        true
      ),
      buildTemplateRoleColumn('role'),
      buildAthleteColumn('innerId'),
      buildAthleteColumn('gdsId'),
      buildTemplateStatusColumn('status'),
      { field: 'function', headerName: t('common.function'), width: 180 },
      buildTemplateColumn('eventTypes', t('general.events'), TemplateType.TextList, undefined, 240),
      { field: 'height', headerName: t('general.height'), width: 100, type: 'number' },
      { field: 'weight', headerName: t('general.weight'), width: 100, type: 'number' },
      { field: 'federationId', headerName: t('general.federationId'), width: 180 },
      buildTemplateColumn(
        'hordIds',
        t('general.hord-ids'),
        TemplateType.Tags,
        metadata?.externalIds,
        400
      ),
      buildTemplateColumn(
        'federationIds',
        t('general.federation-ids'),
        TemplateType.Tags,
        metadata?.externalIds,
        400
      ),
    ],
    [EntityType.QualifiedHorse]: () => [
      { field: 'accreditationId', headerName: t('general.accreditationId'), width: 140 },
      { field: 'name', headerName: t('general.horse'), width: 300 },
      { field: 'yearOfBirth', headerName: t('horse.year-of-birth'), width: 120, filterable: true },
      buildMasterDataColumn('sex', dataInfo[MasterData.HorseGender], t('horse.sex'), 120),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 200),
      buildAthleteColumn('innerId'),
      buildAthleteColumn('gdsId'),
      buildMasterDataColumn('colour', dataInfo[MasterData.HorseColor], t('horse.colour'), 100),
      buildTemplateStatusColumn('status'),
      { field: 'federationId', headerName: t('general.federationId'), width: 180 },
    ],
    [EntityType.QualifiedTeam]: () => [
      { field: 'accreditationId', headerName: t('general.accreditationId'), width: 260 },
      { field: 'name', headerName: t('general.team'), width: 400 },
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 80),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 200),
      buildTemplateColumn(
        'disciplineCode',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        220,
        true
      ),
      buildMasterDataColumn('eventType', dataInfo[MasterData.EventType], t('general.event'), 220),
      buildAthleteColumn('innerId'),
      buildAthleteColumn('gdsId'),
      buildTemplateStatusColumn('status'),
      { field: 'federationId', headerName: t('general.federationId'), width: 180 },
    ],
    [EntityType.Horse]: (metadata?: IMetaType) => [
      { field: 'name', headerName: t('general.horse'), width: 300 },
      buildCountryColumn(
        'countryOfBirth',
        dataInfo[MasterData.Country],
        t('horse.country-of-birth')
      ),
      {
        field: 'yearOfBirth',
        headerName: t('horse.year-of-birth'),
        width: 120,
        filterable: metadata?.yearOfBirth?.allowFiltering ?? false,
      },
      buildMasterDataColumn('sex', dataInfo[MasterData.HorseGender], t('horse.sex'), 125),
      buildMasterDataColumn('colour', dataInfo[MasterData.HorseColor], t('horse.colour'), 125),
      { field: 'passport', headerName: t('horse.passport'), width: 125 },
      ...defaultColumns(metadata),
    ],
    [EntityType.HorseBiography]: () => [
      { field: 'name', headerName: t('general.horse'), width: 300 },
      buildLodashColumn('noc.name', t('general.noc'), 'noc.name', 200),
      buildCountryColumn(
        'countryOfBirth',
        dataInfo[MasterData.Country],
        t('horse.country-of-birth'),
        200
      ),
      { field: 'yearOfBirth', headerName: t('horse.year-of-birth'), width: 120, filterable: true },
      buildMasterDataColumn('sex', dataInfo[MasterData.HorseGender], t('horse.sex'), 125),
      buildMasterDataColumn('colour', dataInfo[MasterData.HorseColor], t('horse.colour'), 125),
      { field: 'passport', headerName: t('horse.passport'), width: 125 },
      ...defaultBioColumns,
    ],
    [EntityType.Team]: (metadata?: IMetaType) => [
      { field: 'name', headerName: t('general.team'), width: 420 },
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 220),
      buildMasterDataColumn('type', dataInfo[MasterData.TeamType], t('common.type'), 160),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 125),
      buildExtractDisciplineColumn(),
      buildMasterDataColumn('eventType', dataInfo[MasterData.EventType], t('general.event'), 230),
      ...defaultColumns(metadata),
    ],
    [EntityType.TeamBiography]: () => [
      { field: 'name', headerName: t('general.team'), width: 380 },
      buildLodashColumn('noc.name', t('general.noc'), 'noc.name', 200),
      buildCountryColumn('nationality', dataInfo[MasterData.Country], t('common.nationality'), 220),
      buildMasterDataColumn('type', dataInfo[MasterData.TeamType], t('common.type'), 160),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 125),
      buildTemplateColumn(
        'discipline',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        220,
        true
      ),
      buildMasterDataColumn('eventType', dataInfo[MasterData.EventType], t('general.event'), 230),
      ...defaultBioColumns,
    ],
    [EntityType.Participant]: (metadata?: IMetaType) => [
      { field: 'participationName', headerName: t('common.name'), width: 380 },
      buildEnumColumn(
        'individualParticipantType',
        t('common.type'),
        EnumType.IndividualParticipantType,
        200
      ),
      buildMasterDataColumn('gender', dataInfo[MasterData.PersonGender], t('common.gender'), 90),
      { field: 'function', headerName: metadata?.function?.displayName, width: 200 },
    ],
    [EntityType.Organization]: (metadata?: IMetaType) => [
      { field: 'name', headerName: t('general.organisation'), width: 380 },
      buildExtractDisciplineColumn(),
      buildMasterDataColumn('sportId', dataInfo[MasterData.Discipline], t('general.sport'), 180),
      buildCountryColumn('country', dataInfo[MasterData.Country], t('common.country'), 320),
      buildMasterDataColumn('type', dataInfo[MasterData.OrganisationType], t('common.type'), 240),
      { field: 'region', headerName: t('general.region'), width: 200 },
      ...defaultColumns(metadata),
    ],
    [EntityType.Noc]: (metadata?: IMetaType) => [
      { field: 'name', headerName: t('general.noc'), width: 300 },
      buildCountryColumn('country', dataInfo[MasterData.Country], t('general.country'), 320),
      { field: 'nocFoundedDate', headerName: t('general.founded'), width: 140 },
      { field: 'iocRecognitionYear', headerName: t('general.ioc-recognition-year'), width: 180 },
      { field: 'president', headerName: t('general.president'), width: 260 },
      { field: 'officialName', headerName: t('noc.official-name'), width: 340 },
      boolColumn('historical', t('general.historical')),
      ...defaultColumns(metadata),
    ],
    [EntityType.NocBiography]: () => [
      { field: 'name', headerName: t('general.noc'), width: 300 },
      buildCountryColumn('country', dataInfo[MasterData.Country], t('general.country'), 320),
      { field: 'nocFoundedDate', headerName: t('general.founded'), width: 140 },
      { field: 'iocRecognitionYear', headerName: t('general.ioc-recognition-year'), width: 180 },
      { field: 'president', headerName: t('general.president'), width: 260 },
      { field: 'officialName', headerName: t('noc.official-name'), width: 340 },
      boolColumn('historical', t('general.historical')),
      ...defaultBioColumns,
    ],
    [EntityType.Discipline]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('general.discipline'), width: 400 },
      buildTemplateColumn(
        'sportDisciplineId',
        t('common.code'),
        TemplateType.MasterData,
        metadata?.sportDisciplineId,
        100
      ),
      { field: 'numberOfEvents', headerName: t('general.events'), width: 100, type: 'number' },
    ],
    [EntityType.Event]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('general.event'), width: 250 },
      buildMasterDataColumn('eventType', dataInfo[MasterData.EventType], t('common.type'), 200),
      buildMasterDataColumn('gender', dataInfo[MasterData.SportGender], t('common.gender'), 100),
      {
        field: 'numberOfCompetitors',
        headerName: t('general.competitors'),
        width: 110,
        type: 'number',
      },
      buildDateColumn('startDate', t('general.startDate'), 110, metadata?.startDate),
      buildDateColumn('finishDate', t('general.finishDate'), 110, metadata?.finishDate),
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
      buildMasterDataColumn(
        'scheduleStatus',
        dataInfo[MasterData.ScheduleStatus],
        t('common.status'),
        125
      ),
    ],
    [EntityType.Stage]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('common.name'), width: 300 },
      buildMasterDataColumn('stageType', dataInfo[MasterData.StageType], t('common.type'), 120),
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
      buildDateColumn('startDate', t('general.startDate'), 110, metadata?.startDate),
      buildDateColumn('finishDate', t('general.finishDate'), 110, metadata?.finishDate),
      buildMasterDataColumn(
        'scheduleStatus',
        dataInfo[MasterData.ScheduleStatus],
        t('common.status'),
        125
      ),
    ],
    [EntityType.Phase]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('common.name'), width: 200 },
      buildMasterDataColumn('type', dataInfo[MasterData.PhaseType], t('common.type'), 100),
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
      { field: 'pool', headerName: t('general.pool'), width: 100 },
      buildDateColumn('startDate', t('general.startDate'), 110, metadata?.startDate),
      buildDateColumn('finishDate', t('general.finishDate'), 110, metadata?.finishDate),
      buildMasterDataColumn(
        'scheduleStatus',
        dataInfo[MasterData.ScheduleStatus],
        t('common.status'),
        125
      ),
    ],
    [EntityType.Unit]: (metadata?: IMetaType) => [
      { field: 'unitNumber', headerName: t('common.code'), width: 80 },
      { field: 'title', headerName: t('common.name'), width: 180 },
      //buildMasterDataColumn('stageType', metadata?.stageType?.displayName ?? '', TemplateType.MasterData, 200, t('common.type),
      buildDateColumn('startDate', t('general.startDate'), 110, metadata?.startDate),
      { field: 'startTime', headerName: t('general.start-time'), width: 110 },
      buildDateColumn('finishDate', t('general.finishDate'), 110, metadata?.finishDate),
      { field: 'finishTime', headerName: t('general.finish-time'), width: 110 },
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
      { field: 'zoneOffset', headerName: t('general.zone-offset'), width: 100 },
      buildMasterDataColumn(
        'scheduleStatus',
        dataInfo[MasterData.ScheduleStatus],
        t('common.status'),
        125
      ),
    ],
    [EntityType.SubUnit]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('common.name'), width: 180 },
      buildDateColumn('startDate', t('general.startDate'), 110, metadata?.startDate),
      { field: 'startTime', headerName: t('general.start-time'), width: 140 },
      buildDateColumn('finishDate', t('general.finishDate'), 110, metadata?.finishDate),
      { field: 'finishTime', headerName: t('general.finish-time'), width: 140 },
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
      { field: 'zoneOffset', headerName: t('general.zone-offset'), width: 100 },
      buildMasterDataColumn(
        'scheduleStatus',
        dataInfo[MasterData.ScheduleStatus],
        t('common.status'),
        125
      ),
    ],
    [EntityType.Official]: (metadata?: IMetaType) => [
      buildTemplateColumn(
        'profileImages',
        '',
        TemplateType.Image,
        metadata?.profileImages,
        60,
        false,
        'participationName'
      ),
      buildRouteColumn(
        'participationName',
        'individualParticipantId',
        t('general.participant'),
        EntityType.Participant,
        260,
        metadata?.participationName
      ),
      { field: 'bib', headerName: 'BIB', width: 90 },
      { field: 'order', headerName: t('general.order'), width: 100, type: 'number' },
    ],
    [EntityType.ScheduleItem]: (metadata?: IMetaType) => [
      { field: 'title', headerName: t('general.schedule'), width: 400 },
      buildMasterDataColumn('type', dataInfo[MasterData.ScheduleType], t('common.type'), 100),
      buildTemplateColumn(
        'startDateTime',
        t('general.startDate'),
        TemplateType.DateTime,
        metadata?.startDate,
        200
      ),
      buildTemplateColumn(
        'finishDateTime',
        t('general.finishDate'),
        TemplateType.DateTime,
        metadata?.finishDate,
        200
      ),
      buildMasterDataColumn('status', dataInfo[MasterData.ScheduleStatus], t('common.status'), 100),
    ],
    [EntityType.Category]: () => [
      { field: 'value', headerName: t('general.category'), width: 340, flex: 1 },
      { field: 'key', headerName: t('common.code'), width: 340 },
      { field: 'languageCode', headerName: t('common.language'), width: 100 },
    ],
    [EntityType.Entry]: () => [
      { field: 'value', headerName: t('general.entry'), width: 380, flex: 1 },
      { field: 'key', headerName: t('common.code'), width: 500 },
      { field: 'languageCode', headerName: t('common.language'), width: 100 },
    ],
    [EntityType.Mapping]: () => [
      { field: 'upstreamKey', headerName: t('common.source'), width: 120 },
      { field: 'from', headerName: t('general.mapping'), width: 300, flex: 1 },
      { field: 'to', headerName: t('general.entry'), width: 400 },
      { field: 'validFrom', headerName: t('common.validFrom'), width: 120 },
      { field: 'validTo', headerName: t('common.validTo'), width: 120 },
    ],
    [EntityType.Translation]: () => [
      { field: 'languageCode', headerName: t('common.language'), width: 100 },
      { field: 'key', headerName: t('general.entry'), width: 400 },
      { field: 'value', headerName: t('general.translation'), width: 340, flex: 1 },
    ],
    [EntityType.MergeRequest]: () => [
      buildEnumColumn('entityType', t('common.type'), EnumType.MergeEntityType, 160),
      { field: 'title', headerName: t('common.name'), width: 460 },
      buildEnumColumn('status', t('common.status'), EnumType.MergeStatus, 220),
      buildEnumColumn('conflictStatus', t('common.error'), EnumType.ConflictStatus, 150),
      buildEnumColumn('entitySubType', t('common.subtype'), EnumType.MergeEntitySubType, 120),
      buildTemplateColumn(
        'ingestOrganisations',
        t('common.sources'),
        TemplateType.Tags,
        undefined,
        320
      ),
      buildEnumColumn('type', t('common.mode'), EnumType.MergeType, 120),
      buildTemplateColumn(
        'createdTs',
        t('common.createdOn'),
        TemplateType.Timestamp,
        undefined,
        280
      ),
      buildTemplateColumn(
        'updatedTs',
        t('common.modifiedOn'),
        TemplateType.Timestamp,
        undefined,
        280
      ),
    ],
    [EntityType.OdfIngest]: () => [
      buildEnumColumn('documentType', t('common.documentType'), EnumType.DocumentType, 320),
      { field: 'documentCode', headerName: t('common.documentCode'), width: 340 },
      buildQueryStatusColumn('errorFlag', t('common.status')),
      buildSkippedColumn('skippedFlag', t('common.skipped')),
      { field: 'documentSubType', headerName: t('common.documentSubType'), width: 160 },
      { field: 'documentSubCode', headerName: t('common.documentSubCode'), width: 180 },
      { field: 'id', headerName: t('common.tag'), width: 400 },
      { field: 'source', headerName: t('common.source'), width: 120 },
      buildTemplateColumn(
        'createdTs',
        t('common.ingestDate'),
        TemplateType.DateTime,
        undefined,
        200
      ),
      { field: 'competitionCode', headerName: t('general.competition'), width: 120 },
      buildEnumColumn('resultStatus', t('general.result-status'), EnumType.IngestResultStatus, 160),
    ],
    [EntityType.UsdfIngest]: () => [
      buildEnumColumn('type', t('common.type'), EnumType.UsdfType, 220),
      buildEnumColumn('format', t('common.format'), EnumType.UsdfFormat, 160),
      { field: 'source', headerName: t('common.source'), width: 180 },
      buildTemplateColumn(
        'errorFlag',
        t('common.status'),
        TemplateType.QueryStatus,
        undefined,
        120
      ),
      { field: 'id', headerName: t('common.tag'), width: 400 },
      buildTemplateColumn(
        'createdTs',
        t('common.ingestDate'),
        TemplateType.DateTime,
        undefined,
        240
      ),
    ],
    [EntityType.HeadToHead]: () => [
      { field: 'disciplineCode', headerName: t('general.discipline'), width: 120 },
      {
        field: 'opponent1',
        headerName: t('general.opponent-1'),
        width: 300,
        renderCell: (params: GridRenderCellParams<any>) =>
          get(params.value, 'team') ?? get(params.value, 'participationName'),
      },
      {
        field: 'opponent2',
        headerName: t('general.opponent-2'),
        width: 300,
        renderCell: (params: GridRenderCellParams<any>) =>
          get(params.value, 'team') ?? get(params.value, 'participationName'),
      },

      { field: 'competitionTitle', headerName: t('general.competition'), width: 400 },
      buildTemplateColumn(
        'competitionStartDate',
        t('common.startDate'),
        TemplateType.Date,
        undefined,
        120
      ),
      { field: 'competitionCountry', headerName: t('general.country'), width: 140 },
      { field: 'eventName', headerName: t('general.event'), width: 320 },
      { field: 'eventGender', headerName: t('common.gender'), width: 100 },
      { field: 'round', headerName: t('general.round'), width: 180 },
      { field: 'result', headerName: t('general.result'), width: 120 },
      { field: 'competitorType', headerName: t('common.type'), width: 120 },
    ],
    [EntityType.Edition]: (metadata?: IMetaType) => [
      { field: 'code', headerName: t('common.code'), width: 100 },
      { field: 'name', headerName: t('common.name'), width: 180 },
      buildEnumColumn('type', t('common.type'), EnumType.Season, 140),
      buildCountryColumn('country', dataInfo[MasterData.Country], t('general.country'), 180),
      {
        field: 'region',
        headerName: metadata?.region?.displayName ?? t('general.region'),
        width: 150,
      },
      buildDateColumn('startDate', t('general.startDate'), 140, metadata?.startDate),
      buildDateColumn('finishDate', t('general.finishDate'), 140, metadata?.finishDate),
      ...defaultReportColumns,
    ],
    [EntityType.DeliveryPlan]: () => [
      buildDropDownColumn('edition.code', t('general.edition'), dataInfo.editions, 100),
      buildEnumColumn('type', t('common.type'), EnumType.DeliveryType, 200),
      buildEnumColumn('status', t('common.deliveryStatus'), EnumType.DeliveryStatus, 140),
      buildScopeColumn('scope', t('common.scope'), dataInfo.categories, 340),
      buildDateColumn('scheduleDate', t('common.scheduleDate'), 140),
      buildDateColumn('deliveryDate', t('common.deliveryDate'), 140),
      buildProgressColumn('rate', t('general.readiness')),
      buildNumericColumn('daysRemaining', '#Days', 70, false),
      buildNumericColumn('workingDaysRemaining', '#W.Days', 80, false),
      buildProgressColumn('dataRate', 'Data %'),
      ...defaultReportColumns,
    ],
    [EntityType.DeliveryDataScope]: () => [
      buildDropDownEdition('edition.code', t('general.edition'), dataInfo.editions, 250),
      buildDropDownDiscipline(
        'disciplineCode',
        t('general.discipline'),
        dataInfo[MasterData.Discipline],
        250
      ),
      buildCompetitionCategories('competitionCategories', dataInfo[MasterData.CompetitionCategory]),
      buildCompetitionCategories(
        'excludedCompetitionCategories',
        dataInfo[MasterData.CompetitionCategory],
        280,
        t('general.excluded-competition-categories')
      ),
      buildDateColumn('startDate', t('common.fromYear'), 100, undefined, 'YYYY'),
      buildDateColumn('finishDate', t('common.toYear'), 100, undefined, 'YYYY'),
      buildEnumListColumn('scope', t('common.scope'), EnumType.ScopeType, 180),
      buildEnumColumn('status', t('common.deliveryStatus'), EnumType.DeliveryStatus, 140),
      buildDateColumn('scheduleDate', t('common.scheduleDate'), 130),
      buildDateColumn('deliveryDate', t('common.deliveryDate'), 130),
      buildProgressColumn('completionRate', t('general.readiness'), 120),
      buildNumericColumn('frequency', t('common.frequency'), 100, true),
      buildNumericColumn('minYearlyOccurrences', t('common.minYearlyOccurrences'), 120, true),
      buildNumericColumn('maxYearlyOccurrences', t('common.maxYearlyOccurrences'), 120, true),
      buildNumericColumn(
        'minEstimatedCompetitions',
        `Min ${t('general.scope-competitions')}`,
        120,
        false
      ),
      buildNumericColumn(
        'maxEstimatedCompetitions',
        `Max ${t('general.scope-competitions')}`,
        120,
        false
      ),
      buildNumericColumn('totalCompetitions', t('general.no-competitions'), 80, true),
      ...defaultReportColumns,
    ],
    [EntityType.ReportCategory]: () => [
      buildDropDownEdition('edition.code', t('general.edition'), dataInfo.editions, 250),
      { field: 'code', headerName: t('common.code'), width: 80 },
      { field: 'name', headerName: t('common.name'), width: 320 },
      buildNumericColumn('index', t('common.index'), 70, true),
      buildEnumColumn('type', t('common.type'), EnumType.ReportType, 180),
      buildEnumColumn('defaultFormat', t('common.format'), EnumType.ReportFormat, 120),
      ...defaultReportColumns,
    ],
    [EntityType.ReportVariation]: () => [
      buildDropDownDiscipline(
        'disciplines',
        t('general.discipline'),
        dataInfo[MasterData.Discipline],
        250
      ),
      { field: 'code', headerName: t('common.code'), width: 80 },
      { field: 'name', headerName: t('common.name'), width: 320 },
      { field: 'subCode', headerName: t('common.subCode'), width: 90 },
      buildEnumColumn('defaultFormat', t('common.format'), EnumType.ReportFormat, 120),
      { field: 'fileName', headerName: t('common.file'), width: 140, filterable: false },
      buildNumericColumn('cutoff', t('general.cutoff'), 90, true),
      buildNumericColumn('lineCutoff', t('general.lineCutoff'), 120, true),
      ...defaultReportColumns,
    ],
    [EntityType.ReportSource]: () => [
      { field: 'displayName', headerName: t('common.name'), width: 200 },
      { field: 'schema', headerName: t('general.schema'), width: 200 },
      { field: 'tableName', headerName: t('general.table'), width: 220 },
      { field: 'url', headerName: t('common.url'), width: 220 },
      buildEnumColumn('type', t('common.type'), EnumType.SourceType, 120),
      buildEnumColumn('category', t('general.category'), EnumType.SourceCategory, 160),
      buildEnumColumn('organization', t('general.organisation'), EnumType.IngestSource, 180),
      ...defaultReportColumns,
    ],
    [EntityType.Report]: (metadata?: IMetaType) => [
      buildLodashColumn('variationCode', t('common.code'), 'variation.code', 90),
      buildLodashColumn('variation', t('general.reportVariation'), 'variation.shortName', 340),
      {
        field: 'displayName',
        headerName: t('common.scope'),
        width: 390,
        filterable: false,
        sortable: false,
      },
      buildEnumColumn('status', t('common.status'), EnumType.ReportStatus, 140),
      buildEnumColumn('statusData', t('common.dataStatus'), EnumType.DataStatus, 125),
      buildEnumColumn('format', t('common.format'), EnumType.ReportFormat, 120),
      buildDateColumn(
        'generatedOn',
        t('common.lastGeneration'),
        160,
        metadata?.startDate,
        baseConfig.dayDateFormat
      ),
      { field: 'generatedBy', headerName: t('common.generatedBy'), width: 200 },
      buildDateColumn('nextDelivery', t('general.nextDelivery'), 140),
      ...defaultReportColumns,
    ],
    [EntityType.BiographyQuota]: () => [
      buildTemplateColumn(
        'disciplineCode',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        250,
        true
      ),
      buildEnumColumn('type', t('common.type'), EnumType.BiographyType, 120),
      buildEnumColumn('subtype', t('common.subtype'), EnumType.PersonType, 120),
      buildNumericColumn('quota', t('general.quota'), 120),
      buildNumericColumn('currentQuota', t('common.current'), 120),
      buildTemplateColumn(
        'editors',
        t('general.editors'),
        TemplateType.TextList,
        undefined,
        250,
        true
      ),
      ...defaultReportColumns,
    ],
    [EntityType.Venue]: (metadata?: IMetaType) => [
      { field: 'name', headerName: t('general.venue'), width: 460 },
      buildCountryColumn('country', dataInfo[MasterData.Country], t('general.country'), 320),
      {
        field: 'region',
        headerName: metadata?.region?.displayName ?? t('general.region'),
        width: 300,
      },
      buildNumericColumn('capacity', t('venue.capacity'), 120),
      buildNumericColumn('totalDays', t('venue.totalDays'), 120, false),
      buildNumericColumn('totalEvents', t('venue.totalEvents'), 120, false),
      buildTemplateColumn(
        'disciplineCodes',
        t('general.discipline'),
        TemplateType.Discipline,
        undefined,
        250,
        false
      ),
      buildDateColumn('minStartDate', t('venue.minStartDate'), 110),
      buildDateColumn('maxFinishDate', t('venue.maxFinishDate'), 110),
      buildCompetitionCategories('competitionCategories', dataInfo[MasterData.CompetitionCategory]),
      buildCompetitionsColumn('competitions'),
      { field: 'dimensions', headerName: t('venue.dimensions'), width: 110 },
      ...defaultColumns(metadata),
      buildRouteColumn(
        'parentVenue.name',
        'parentVenueId',
        t('general.main-location'),
        EntityType.Venue,
        400,
        metadata?.parentVenueId
      ),
    ],
    [EntityType.Record]: (metadata?: IMetaType) => [
      buildRouteColumn(
        'participationName',
        'individualId',
        t('general.participant'),
        EntityType.Person,
        260,
        metadata?.participationName
      ),
      { field: 'resultValue', headerName: t('general.result'), width: 90 },
      { field: 'rank', headerName: t('general.rank'), width: 90, type: 'number' },
      { field: 'recordDate', headerName: t('general.recordDate'), width: 170 },
      boolColumn('equaled', t('general.equaled')),
    ],
    [EntityType.ExtractorParticipant]: () => [],
    [EntityType.Result]: () => [],
    [EntityType.Competitor]: () => [],
    [EntityType.ParticipantCompetition]: () => [],
    [EntityType.DataIngest]: () => [],
    [EntityType.Esl]: () => [],
    [EntityType.Award]: () => [],
    [EntityType.ReportSection]: () => [],
    [EntityType.ReportBlock]: () => [],
    [EntityType.ReportField]: () => [],
    [EntityType.ReportFilter]: () => [],
    [EntityType.ReportDelivery]: () => [],
    [EntityType.CompetitionStructure]: () => [],
    [EntityType.GlobalSetup]: () => [],
    [EntityType.SecurityUser]: () => [],
    [EntityType.SecurityClient]: () => [],
    [EntityType.AccessRequest]: () => [],
    [EntityType.GdsDashboard]: () => [],
  };

  const getColumns = React.useCallback((type: EntityType, metadata?: IMetaType): GridColDef[] => {
    return columnConfig[type] ? columnConfig[type](metadata) : defaultColumns(metadata);
  }, []);

  const getIcon = React.useCallback((type: EntityType): ElementType => {
    switch (type) {
      case EntityType.Competition:
        return EmojiEventsOutlined;
      case EntityType.Team:
        return PeopleAltOutlined;
      case EntityType.Person:
        return PersonOutlined;
      case EntityType.Horse:
        return BedroomBabyOutlined;
      case EntityType.Organization:
        return BusinessOutlined;
      case EntityType.Venue:
        return LocationOnOutlined;
      case EntityType.Event:
        return CalendarMonthOutlined;
      case EntityType.Noc:
        return AccountBalanceOutlined;
      case EntityType.Category:
        return ViewInArOutlined;
      case EntityType.OdfIngest:
        return UpcomingOutlined;
      case EntityType.UsdfIngest:
        return UpcomingOutlined;
      case EntityType.Record:
        return MilitaryTechOutlined;
      case EntityType.MergeRequest:
        return CallMergeOutlined;
      case EntityType.DataIngest:
        return CloudUploadOutlined;
      case EntityType.HeadToHead:
        return SportsKabaddiOutlined;
      case EntityType.PersonBiography:
      case EntityType.HorseBiography:
      case EntityType.TeamBiography:
        return AssignmentIndOutlined;
      case EntityType.CompetitionStructure:
        return AccountTreeOutlined;
      default:
        return AccountCircleOutlined;
    }
  }, []);
  return {
    getColumns,
    getIcon,
  };
};
export default useDataGridHelper;
