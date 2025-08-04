import {
  BioStatusEnum,
  BlockTypeEnum,
  ContentTypeEnum,
  EnumType,
  IEnumProps,
  ISelectMenuItem,
  MergeEntitySubTypeEnum,
  MergeEntityTypeEnum,
  MergeStatusEnum,
  OdfRuleEnum,
  RuleModeEnum,
  ScopeTypeEnum,
  SectionTypeEnum,
  SourceTypeEnum,
  TextAlignmentEnum,
  TextStyleEnum,
} from 'models';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import {
  amber,
  blue,
  green,
  grey,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@mui/material/colors';
import BedroomChildOutlined from '@mui/icons-material/BedroomChildOutlined';
import FilterListTwoTone from '@mui/icons-material/FilterListTwoTone';
import FormatListBulletedTwoTone from '@mui/icons-material/FormatListBulletedTwoTone';
import PlaylistAddCheckTwoTone from '@mui/icons-material/PlaylistAddCheckTwoTone';
import GroupWorkTwoTone from '@mui/icons-material/GroupWorkTwoTone';
import BlockTwoTone from '@mui/icons-material/BlockTwoTone';
import CheckCircleTwoTone from '@mui/icons-material/CheckCircleTwoTone';
import PauseCircleTwoTone from '@mui/icons-material/PauseCircleTwoTone';
import SportsKabaddiTwoTone from '@mui/icons-material/SportsKabaddiTwoTone';
import SportsTwoTone from '@mui/icons-material/SportsTwoTone';
import GavelTwoTone from '@mui/icons-material/GavelTwoTone';
import AddTwoTone from '@mui/icons-material/AddTwoTone';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import DeleteForeverTwoTone from '@mui/icons-material/DeleteForeverTwoTone';
import ChangeHistoryTwoTone from '@mui/icons-material/ChangeHistoryTwoTone';
import CommentTwoTone from '@mui/icons-material/CommentTwoTone';
import EmojiNatureTwoTone from '@mui/icons-material/EmojiNatureTwoTone';
import GroupsTwoTone from '@mui/icons-material/GroupsTwoTone';
import PublicTwoTone from '@mui/icons-material/PublicTwoTone';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AcUnit from '@mui/icons-material/AcUnit';
import Adjust from '@mui/icons-material/Adjust';
import CheckCircle from '@mui/icons-material/CheckCircle';
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import EmojiPeople from '@mui/icons-material/EmojiPeople';
import ForwardToInbox from '@mui/icons-material/ForwardToInbox';
import Groups2 from '@mui/icons-material/Groups2';
import Link from '@mui/icons-material/Link';
import PauseCircle from '@mui/icons-material/PauseCircle';
import Pending from '@mui/icons-material/Pending';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import Settings from '@mui/icons-material/Settings';
import StickyNote2 from '@mui/icons-material/StickyNote2';
import StopCircle from '@mui/icons-material/StopCircle';
import WbSunny from '@mui/icons-material/WbSunny';
import DeleteSweepTwoTone from '@mui/icons-material/DeleteSweepTwoTone';
import EditNoteTwoTone from '@mui/icons-material/EditNoteTwoTone';
import FlagCircleTwoTone from '@mui/icons-material/FlagCircleTwoTone';
import HighlightOffTwoTone from '@mui/icons-material/HighlightOffTwoTone';
import MarkEmailReadTwoTone from '@mui/icons-material/MarkEmailReadTwoTone';
import MoveUpTwoTone from '@mui/icons-material/MoveUpTwoTone';
import ReportProblemTwoTone from '@mui/icons-material/ReportProblemTwoTone';
import VerifiedUserTwoTone from '@mui/icons-material/VerifiedUserTwoTone';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import ScheduleTwoTone from '@mui/icons-material/ScheduleTwoTone';
import HourglassEmptyTwoTone from '@mui/icons-material/HourglassEmptyTwoTone';
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import RuleTwoTone from '@mui/icons-material/RuleTwoTone';
import TitleTwoTone from '@mui/icons-material/TitleTwoTone';
import CodeTwoTone from '@mui/icons-material/CodeTwoTone';
import LabelTwoTone from '@mui/icons-material/LabelTwoTone';
import TableChartTwoTone from '@mui/icons-material/TableChartTwoTone';
import RepeatTwoTone from '@mui/icons-material/RepeatTwoTone';
import PersonTwoTone from '@mui/icons-material/PersonTwoTone';
import DoNotDisturbTwoTone from '@mui/icons-material/DoNotDisturbTwoTone';
import HourglassTopTwoTone from '@mui/icons-material/HourglassTopTwoTone';
import SyncAltTwoTone from '@mui/icons-material/SyncAltTwoTone';
import UpdateTwoTone from '@mui/icons-material/UpdateTwoTone';
import BuildCircleTwoTone from '@mui/icons-material/BuildCircleTwoTone';
import FlagTwoTone from '@mui/icons-material/FlagTwoTone';
import PublishedWithChangesTwoTone from '@mui/icons-material/PublishedWithChangesTwoTone';
import SettingsTwoTone from '@mui/icons-material/SettingsTwoTone';
import PlayArrowTwoTone from '@mui/icons-material/PlayArrowTwoTone';
import ErrorTwoTone from '@mui/icons-material/ErrorTwoTone';
import WarningAmberTwoTone from '@mui/icons-material/WarningAmberTwoTone';
import NotesTwoTone from '@mui/icons-material/NotesTwoTone';
import DataUsageTwoTone from '@mui/icons-material/DataUsageTwoTone';
import AssignmentTwoTone from '@mui/icons-material/AssignmentTwoTone';
import AssignmentReturnedTwoTone from '@mui/icons-material/AssignmentReturnedTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import GridViewTwoTone from '@mui/icons-material/GridViewTwoTone';
import InsertDriveFileTwoTone from '@mui/icons-material/InsertDriveFileTwoTone';
import DataArrayTwoTone from '@mui/icons-material/DataArrayTwoTone';
import DesignServicesTwoTone from '@mui/icons-material/DesignServicesTwoTone';
import BugReportTwoTone from '@mui/icons-material/BugReportTwoTone';
import LocalShippingTwoTone from '@mui/icons-material/LocalShippingTwoTone';
import EmojiEventsTwoTone from '@mui/icons-material/EmojiEventsTwoTone';
import FormatListNumberedTwoTone from '@mui/icons-material/FormatListNumberedTwoTone';
import HistoryTwoTone from '@mui/icons-material/HistoryTwoTone';
import StarRateTwoTone from '@mui/icons-material/StarRateTwoTone';
import WorkspacePremiumTwoTone from '@mui/icons-material/WorkspacePremiumTwoTone';
import EmojiSymbolsTwoTone from '@mui/icons-material/EmojiSymbolsTwoTone';
import PeopleTwoTone from '@mui/icons-material/PeopleTwoTone';
import LiveTvTwoTone from '@mui/icons-material/LiveTvTwoTone';
import StarTwoTone from '@mui/icons-material/StarTwoTone';
import DataSaverOffTwoTone from '@mui/icons-material/DataSaverOffTwoTone';
import ApiTwoTone from '@mui/icons-material/ApiTwoTone';
import WebTwoTone from '@mui/icons-material/WebTwoTone';
import PictureAsPdfTwoTone from '@mui/icons-material/PictureAsPdfTwoTone';
import MoreHorizTwoTone from '@mui/icons-material/MoreHorizTwoTone';
import FormatAlignLeftTwoTone from '@mui/icons-material/FormatAlignLeftTwoTone';
import FormatAlignRightTwoTone from '@mui/icons-material/FormatAlignRightTwoTone';
import FormatAlignCenterTwoTone from '@mui/icons-material/FormatAlignCenterTwoTone';
import VerticalAlignTopTwoTone from '@mui/icons-material/VerticalAlignTopTwoTone';
import ClearTwoTone from '@mui/icons-material/ClearTwoTone';
import FormatColorTextTwoTone from '@mui/icons-material/FormatColorTextTwoTone';
import FormatBoldTwoTone from '@mui/icons-material/FormatBoldTwoTone';
import FormatUnderlinedTwoTone from '@mui/icons-material/FormatUnderlinedTwoTone';
import FormatItalicTwoTone from '@mui/icons-material/FormatItalicTwoTone';
import FormatStrikethroughTwoTone from '@mui/icons-material/FormatStrikethroughTwoTone';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import TextSnippetTwoTone from '@mui/icons-material/TextSnippetTwoTone';
import PlayCircleTwoTone from '@mui/icons-material/PlayCircleTwoTone';
import AdjustOutlined from '@mui/icons-material/AdjustOutlined';
import PendingOutlined from '@mui/icons-material/PendingOutlined';
import FileDownloadDoneOutlined from '@mui/icons-material/FileDownloadDoneOutlined';
import TextFieldsTwoTone from '@mui/icons-material/TextFieldsTwoTone';
import SubtitlesTwoTone from '@mui/icons-material/SubtitlesTwoTone';
import ArticleTwoTone from '@mui/icons-material/ArticleTwoTone';
import VerticalAlignBottomTwoTone from '@mui/icons-material/VerticalAlignBottomTwoTone';

export const TYPE_STATUSES = {
  Manual: 'Manual',
  Auto: 'Auto',
};
export const useEnums = () => {
  const { t } = useTranslation();
  const MergeType: IEnumProps[] = [
    { text: t('general.manual'), code: 'Manual', id: 0, icon: EmojiPeople, color: grey[800] },
    { text: 'Auto', code: 'Auto', id: 1, icon: Settings, color: grey[800] },
  ];
  const IndividualParticipantType: IEnumProps[] = useMemo(
    () => [
      { text: t('general.athlete'), code: 'ATHLETE', id: 2, icon: DirectionsRun, color: grey[800] },
      {
        text: t('general.technicalOfficial'),
        code: 'TECHNICAL_OFFICIAL',
        id: 3,
        icon: PeopleAlt,
        color: grey[800],
      },
      {
        text: t('general.teamOfficial'),
        code: 'TEAM_OFFICIAL',
        id: 4,
        icon: PeopleAlt,
        color: grey[800],
      },
    ],
    []
  );
  const ParticipantType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.individual'),
        code: 'INDIVIDUAL',
        id: 0,
        icon: AccountCircle,
        color: orange[500],
      },
      { text: t('general.team'), code: 'TEAM', id: 2, icon: Groups2, color: orange[500] },
    ],
    []
  );
  const IngestType: IEnumProps[] = useMemo(
    () => [
      { text: 'ODF', code: 'ODF', id: 0, icon: StickyNote2, color: orange[500] },
      { text: 'USDF', code: 'USDF', id: 2, icon: StickyNote2, color: grey[800] },
    ],
    []
  );
  const Season: IEnumProps[] = useMemo(
    () => [
      { text: t('general.summer'), code: 'Summer', id: 0, icon: WbSunny, color: orange[500] },
      { text: t('general.winter'), code: 'Winter', id: 2, icon: AcUnit, color: blue[500] },
    ],
    []
  );
  const MergeEntitySubType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.person'),
        code: MergeEntitySubTypeEnum.Person,
        id: 2,
        icon: AccountCircle,
        color: grey[800],
      },
      {
        text: t('general.horse'),
        code: MergeEntitySubTypeEnum.Horse,
        id: 1,
        icon: BedroomChildOutlined,
        color: grey[800],
      },
    ],
    [t]
  );
  const MergeEntityType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.individual'),
        code: MergeEntityTypeEnum.Individual,
        id: 0,
        color: grey[800],
      },
      { text: t('general.horse'), code: MergeEntityTypeEnum.Horse, id: 1, color: grey[800] },
      { text: t('general.team'), code: MergeEntityTypeEnum.Team, id: 2, color: grey[800] },
      {
        text: t('general.organisation'),
        code: MergeEntityTypeEnum.Organization,
        id: 3,
        color: grey[800],
      },
      { text: t('general.venue'), code: MergeEntityTypeEnum.Venue, id: 4, color: grey[800] },
    ],
    [t]
  );

  const WorkflowState: IEnumProps[] = useMemo(
    () => [
      { text: t('status.pending'), code: 'TODO', id: 0, icon: Pending, color: blue[300] },
      { text: t('status.done'), code: 'DONE', id: 1, icon: CheckCircle, color: green[500] },
      {
        text: t('status.in-progress'),
        code: 'IN_PROGRESS',
        id: 2,
        icon: DirectionsRun,
        color: blue[800],
      },
      { text: t('status.resolved'), code: 'RESOLVED', id: 3, icon: CheckCircle, color: green[500] },
      {
        text: t('status.notified'),
        code: 'NOTIFIED',
        id: 4,
        icon: ForwardToInbox,
        color: blue[800],
      },
    ],
    []
  );
  const ConflictStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.conflict'),
        code: 'CONFLICT',
        id: 0,
        icon: CancelOutlined,
        color: red[500],
      },
      {
        text: t('status.ok'),
        code: 'NO_CONFLICT',
        id: 1,
        icon: CheckCircleOutlined,
        color: green[500],
      },
      { text: t('status.mismatch'), code: 'DIFF', id: 2, icon: CancelOutlined, color: orange[500] },
      {
        text: t('status.data-missing'),
        code: 'DATA_MISSING',
        id: 3,
        icon: PendingOutlined,
        color: orange[500],
      },
      {
        text: t('status.review-needed'),
        code: 'REVIEW_NEEDED',
        id: 4,
        icon: AdjustOutlined,
        color: orange[500],
      },
    ],
    []
  );

  const MergeStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.ready'),
        code: MergeStatusEnum.Done,
        id: 1,
        icon: CheckCircleOutlined,
        color: green[500],
      },
      {
        text: t('status.active'),
        code: MergeStatusEnum.Active,
        id: 0,
        icon: PauseCircleOutline,
        color: orange[800],
      },
      {
        text: t('status.inactive'),
        code: MergeStatusEnum.Inactive,
        id: 0,
        icon: RemoveCircleOutline,
        color: grey[800],
      },
      {
        text: t('status.pending'),
        code: MergeStatusEnum.Pending,
        id: 2,
        icon: PendingOutlined,
        color: orange[500],
      },
      {
        text: t('status.awaiting-confirmation'),
        code: MergeStatusEnum.PendingConfirmation,
        id: 5,
        icon: PendingOutlined,
        color: orange[500],
      },
      {
        text: 'Merge Ready',
        code: MergeStatusEnum.ActivePrevious,
        id: 4,
        icon: CheckCircleOutlined,
        color: green[500],
      },
    ],
    []
  );

  const ComparisonStatus: IEnumProps[] = useMemo(
    () => [
      { text: 'Match', code: 'MATCH', id: 1, color: grey[800] },
      { text: 'Full Match', code: 'FULL_MATCH', id: 2, color: grey[800] },
      { text: 'Found In Source', code: 'FOUND_IN_SOURCE', id: 3, color: grey[800] },
      { text: 'Found In Target', code: 'FOUND_IN_TARGET', id: 4, color: grey[800] },
    ],
    []
  );
  const DocumentType: IEnumProps[] = useMemo(
    () =>
      [
        { text: 'DT_BIO_PAR', code: 'DT_BIO_PAR', id: 1, color: grey[800] },
        { text: 'DT_BIO_TEA', code: 'DT_BIO_TEA', id: 2, color: grey[800] },
        { text: 'DT_BRACKETS', code: 'DT_BRACKETS', id: 3, color: grey[800] },
        { text: 'DT_CONFIG', code: 'DT_CONFIG', id: 4, color: grey[800] },
        { text: 'DT_CUMULATIVE_RESULT', code: 'DT_CUMULATIVE_RESULT', id: 5, color: grey[800] },
        { text: 'DT_CURRENT', code: 'DT_CURRENT', id: 6, color: grey[800] },
        { text: 'DT_IMAGE', code: 'DT_IMAGE', id: 7, color: grey[800] },
        { text: 'DT_LOCAL_OFF', code: 'DT_LOCAL_OFF', id: 8, color: grey[800] },
        { text: 'DT_LOCAL_ON', code: 'DT_LOCAL_ON', id: 8, color: grey[800] },
        { text: 'DT_MEDALLISTS', code: 'DT_MEDALLISTS', id: 9, color: grey[800] },
        { text: 'DT_PARTIC', code: 'DT_PARTIC', id: 10, color: grey[800] },
        { text: 'DT_PARTIC_HORSES', code: 'DT_PARTIC_HORSES', id: 11, color: grey[800] },
        {
          text: 'DT_PARTIC_HORSES_UPDATE',
          code: 'DT_PARTIC_HORSES_UPDATE',
          id: 12,
          color: grey[800],
        },
        { text: 'DT_PARTIC_TEAMS', code: 'DT_PARTIC_TEAMS', id: 13, color: grey[800] },
        {
          text: 'DT_PARTIC_TEAMS_UPDATE',
          code: 'DT_PARTIC_TEAMS_UPDATE',
          id: 14,
          color: grey[800],
        },
        { text: 'DT_PARTIC_UPDATE', code: 'DT_PARTIC_UPDATE', id: 15, color: grey[800] },
        { text: 'DT_PDF', code: 'DT_PDF', id: 16, color: grey[800] },
        { text: 'DT_PHASE_RESULT', code: 'DT_PHASE_RESULT', id: 17, color: grey[800] },
        { text: 'DT_PIC', code: 'DT_PIC', id: 18, color: grey[800] },
        { text: 'DT_PLAY_BY_PLAY', code: 'DT_PLAY_BY_PLAY', id: 19, color: grey[800] },
        { text: 'DT_POOL_STANDING', code: 'DT_POOL_STANDING', id: 20, color: grey[800] },
        { text: 'DT_RANKING', code: 'DT_RANKING', id: 21, color: grey[800] },
        { text: 'DT_RECORD', code: 'DT_RECORD', id: 22, color: grey[800] },
        { text: 'DT_RESULT', code: 'DT_RESULT', id: 23, color: grey[800] },
        { text: 'DT_RESULT_ANALYSIS', code: 'DT_RESULT_ANALYSIS', id: 24, color: grey[800] },
        { text: 'DT_SCHEDULE', code: 'DT_SCHEDULE', id: 25, color: grey[800] },
        { text: 'DT_SCHEDULE_UPDATE', code: 'DT_SCHEDULE_UPDATE', id: 26, color: grey[800] },
        { text: 'DT_STATS', code: 'DT_STATS', id: 27, color: grey[800] },
        { text: 'DT_WEATHER', code: 'DT_WEATHER', id: 28, color: grey[800] },
        { text: 'DT_MEDALS', code: 'DT_MEDALS', id: 29, color: grey[800] },
        {
          text: 'DT_MEDALLISTS_DISCIPLINE',
          code: 'DT_MEDALLISTS_DISCIPLINE',
          id: 29,
          color: grey[800],
        },
        { text: 'DT_FED_RANKING', code: 'DT_FED_RANKING', id: 30, color: grey[800] },
        { text: 'DT_ENTRIES', code: 'DT_ENTRIES', id: 31, color: grey[800] },
      ].sort((a, b) => a.code.localeCompare(b.code)),
    []
  );

  const IngestResultStatus: IEnumProps[] = useMemo(
    () =>
      [
        { text: 'START-LIST', code: 'START_LIST', id: 1, color: grey[800] },
        { text: 'LIVE', code: 'LIVE', id: 2, color: grey[800] },
        { text: 'INTERMEDIATE', code: 'INTERMEDIATE', id: 3, color: grey[800] },
        { text: 'UNCONFIRMED', code: 'UNCONFIRMED', id: 4, color: grey[800] },
        { text: 'UNOFFICIAL', code: 'UNOFFICIAL', id: 5, color: grey[800] },
        { text: 'OFFICIAL', code: 'OFFICIAL', id: 6, color: grey[800] },
        { text: 'PARTIAL', code: 'PARTIAL', id: 7, color: grey[800] },
        { text: 'PROTESTED', code: 'PROTESTED', id: 8, color: grey[800] },
        { text: 'PROVISIONAL', code: 'PROVISIONAL', id: 9, color: grey[800] },
      ].sort((a, b) => a.code.localeCompare(b.code)),
    []
  );
  const UsdfFormat: IEnumProps[] = useMemo(
    () => [
      { text: 'USDF v1.3', code: 'USDF1.3', id: 1, color: grey[800] },
      { text: 'USDF v1.3.2', code: 'USDF1.3.2', id: 2, color: grey[800] },
      { text: 'USDF v1.3.3', code: 'USDF1.3.3', id: 3, color: grey[800] },
      { text: 'USDF v1.4', code: 'USDF1.4', id: 4, color: grey[800] },
      { text: 'USDF v2.0', code: 'USDF2.0', id: 5, color: grey[800] },
    ],
    []
  );
  const UsdfType: IEnumProps[] = useMemo(
    () => [
      { text: 'AWARDS', code: 'AWARDS', id: 1, color: grey[800] },
      { text: 'COMPETITION', code: 'COMPETITION', id: 2, color: grey[800] },
      { text: 'COMPETITION_BREAKDOWN', code: 'COMPETITION_BREAKDOWN', id: 3, color: grey[800] },
      { text: 'DISCIPLINE', code: 'DISCIPLINE', id: 4, color: grey[800] },
      { text: 'EVENT', code: 'EVENT', id: 5, color: grey[800] },
      { text: 'EVENT_BREAKDOWN', code: 'EVENT_BREAKDOWN', id: 6, color: grey[800] },
      { text: 'EVENT_EXTENDED', code: 'EVENT_EXTENDED', id: 7, color: grey[800] },
      { text: 'INDIVIDUAL_PROFILE', code: 'INDIVIDUAL_PROFILE', id: 8, color: grey[800] },
      { text: 'PHASE', code: 'PHASE', id: 9, color: grey[800] },
      { text: 'STAGE', code: 'STAGE', id: 10, color: grey[800] },
      { text: 'STAGE_BREAKDOWN', code: 'STAGE_BREAKDOWN', id: 11, color: grey[800] },
      { text: 'SUBUNIT', code: 'SUBUNIT', id: 12, color: grey[800] },
      { text: 'TEAM_PROFILE', code: 'TEAM_PROFILE', id: 13, color: grey[800] },
      { text: 'UNIT', code: 'UNIT', id: 14, color: grey[800] },
    ],
    []
  );

  const OdfRule: IEnumProps[] = useMemo(
    () => [
      {
        text: 'Create Stage',
        code: OdfRuleEnum.CreateStage,
        id: 1,
        icon: FlagCircleTwoTone,
        color: blue[500],
      },
      {
        text: 'Link to Stage',
        code: OdfRuleEnum.LinkPhaseToStage,
        id: 2,
        icon: Link,
        color: green[800],
      },
      {
        text: 'Convert to Stage',
        code: OdfRuleEnum.ConvertPhaseToStage,
        id: 3,
        icon: MoveUpTwoTone,
        color: orange[800],
      },
      {
        text: 'Convert to Unit',
        code: OdfRuleEnum.ConvertSubunitToUnit,
        id: 4,
        icon: MoveUpTwoTone,
        color: blue[800],
      },
      {
        text: 'Message Redirect',
        code: OdfRuleEnum.MessageRedirect,
        id: 4,
        icon: MoveUpTwoTone,
        color: blue[800],
      },
      {
        text: 'Hide Unit',
        code: OdfRuleEnum.HideUnit,
        id: 4,
        icon: HighlightOffTwoTone,
        color: orange[500],
      },
      {
        text: 'Hide SubUnit',
        code: OdfRuleEnum.HideSubUnit,
        id: 4,
        icon: HighlightOffTwoTone,
        color: orange[500],
      },
    ],
    []
  );
  const BiographyType: IEnumProps[] = useMemo(
    () => [
      { text: t('general.person'), code: 'Person', id: 0, icon: PeopleTwoTone, color: blue[500] },
      {
        text: t('general.horse'),
        code: 'Horse',
        id: 1,
        icon: EmojiNatureTwoTone,
        color: blue[800],
      },
      { text: t('general.team'), code: 'Team', id: 2, icon: GroupsTwoTone, color: blue[800] },
      { text: 'Noc', code: 'Noc', id: 3, icon: PublicTwoTone, color: green[500] },
    ],
    []
  );
  const AccreditationStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.unavailable'),
        code: 'Unavailable',
        id: 0,
        icon: BlockTwoTone,
        color: red[500],
      },
      {
        text: t('status.active'),
        code: 'Active',
        id: 1,
        icon: CheckCircleTwoTone,
        color: green[500],
      },
      {
        text: t('status.inactive'),
        code: 'Inactive',
        id: 2,
        icon: PauseCircleTwoTone,
        color: orange[500],
      },
    ],
    []
  );

  const BioStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.draft'),
        code: BioStatusEnum.Draft,
        id: 0,
        icon: DesignServicesTwoTone,
        color: orange[800],
      },
      {
        text: t('status.editing'),
        code: BioStatusEnum.Editing,
        id: 2,
        icon: EditNoteTwoTone,
        color: blue[800],
      },
      {
        text: t('status.conflict'),
        code: BioStatusEnum.Conflict,
        id: 2,
        icon: ReportProblemTwoTone,
        color: red[500],
      },
      {
        text: t('status.approved'),
        code: BioStatusEnum.Approved,
        id: 2,
        icon: VerifiedUserTwoTone,
        color: blue[500],
      },
      {
        text: t('status.ready'),
        code: BioStatusEnum.Ready,
        id: 2,
        icon: WorkspacePremiumTwoTone,
        color: green[500],
      },
      {
        text: t('status.delivered'),
        code: BioStatusEnum.Delivered,
        id: 2,
        icon: MarkEmailReadTwoTone,
        color: green[800],
      },
      {
        text: t('status.spiked'),
        code: BioStatusEnum.Spiked,
        id: 2,
        icon: DeleteSweepTwoTone,
        color: grey[800],
      },
    ],
    []
  );

  const PersonType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.athlete'),
        code: 'Athlete',
        id: 0,
        icon: SportsKabaddiTwoTone,
        color: blue[800],
      },
      { text: t('general.coach'), code: 'Coach', id: 1, icon: SportsTwoTone, color: blue[800] },
      { text: t('general.judge'), code: 'Judge', id: 2, icon: GavelTwoTone, color: blue[800] },
    ],
    []
  );
  const BiographyAction: IEnumProps[] = useMemo(
    () => [
      { text: 'Create', code: 'Create', id: 0, icon: AddTwoTone, color: green[500] },
      { text: 'Update', code: 'Update', id: 1, icon: EditTwoTone, color: blue[500] },
      { text: 'Delete', code: 'Delete', id: 2, icon: DeleteForeverTwoTone, color: red[500] },
      {
        text: 'Change Status',
        code: 'ChangeStatus',
        id: 3,
        icon: ChangeHistoryTwoTone,
        color: orange[500],
      },
      { text: 'Comment', code: 'Comment', id: 4, icon: CommentTwoTone, color: blue[800] },
    ],
    []
  );
  const EntityStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.active'),
        code: 'ACTIVE',
        id: 1,
        icon: PlayCircleOutline,
        color: green[500],
      },
      { text: t('status.inactive'), code: 'INACTIVE', id: 2, icon: StopCircle, color: red[500] },
      { text: t('status.disable'), code: 'DISABLE', id: 4, icon: PauseCircle, color: orange[500] },
      { text: 'All', code: 'ALL', id: 8, icon: Adjust, color: blue[500] },
    ],
    []
  );
  const StageType: IEnumProps[] = useMemo(
    () => [
      {
        text: 'Elimination',
        code: 'ELIMINATION',
        id: 0,
        icon: FilterListTwoTone,
        color: orange[500],
      },
      {
        text: 'Brackets',
        code: 'BRACKETS',
        id: 1,
        icon: FormatListBulletedTwoTone,
        color: blue[500],
      },
      {
        text: 'Cumulative',
        code: 'CUMULATIVE',
        id: 2,
        icon: PlaylistAddCheckTwoTone,

        color: blue[800],
      },
      { text: 'Pools', code: 'POOLS', id: 3, icon: GroupWorkTwoTone, color: green[500] },
    ],
    []
  );

  const ReportEntityType: IEnumProps[] = useMemo(
    () => [
      { text: 'Edition', code: 'Edition', id: 0, icon: CancelOutlined, color: blue[800] },
      { text: 'Category', code: 'Category', id: 1, icon: CheckCircleTwoTone, color: blue[800] },
      { text: 'Variation', code: 'Variation', id: 2, icon: CancelOutlined, color: blue[800] },
      { text: 'Section', code: 'Section', id: 3, icon: PendingOutlined, color: blue[800] },
      { text: 'Field', code: 'Field', id: 4, icon: AdjustOutlined, color: blue[800] },
      { text: 'Filter', code: 'Filter', id: 4, icon: AdjustOutlined, color: blue[800] },
      { text: 'Block', code: 'Block', id: 4, icon: AdjustOutlined, color: blue[800] },
    ],
    []
  );

  const DeliveryStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.completed'),
        code: 'Completed',
        id: 0,
        icon: CheckCircleTwoTone,
        color: green[500],
      },
      {
        text: t('status.confirmed'),
        code: 'Confirmed',
        id: 1,
        icon: MarkEmailReadTwoTone,
        color: blue[800],
      },
      { text: t('status.error'), code: 'Error', id: 2, icon: ErrorTwoTone, color: red[500] },
      {
        text: t('status.scheduled'),
        code: 'Scheduled',
        id: 3,
        icon: ScheduleTwoTone,
        color: blue[800],
      },
      {
        text: t('status.delayed'),
        code: 'Delayed',
        id: 4,
        icon: HourglassEmptyTwoTone,
        color: orange[800],
      },
      {
        text: t('status.approved'),
        code: 'Approved',
        id: 5,
        icon: CheckCircleTwoTone,
        color: green[800],
      },
      {
        text: t('status.postponed'),
        code: 'Postponed',
        id: 6,
        icon: PauseCircleTwoTone,
        color: blue[800],
      },
    ],
    []
  );
  const BlockPosition: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.header'),
        code: 'Header',
        id: 0,
        icon: TextFieldsTwoTone,
        color: blue[800],
      },
      {
        text: t('general.subheader'),
        code: 'SubHeader',
        id: 1,
        icon: SubtitlesTwoTone,
        color: blue[800],
      },
      {
        text: t('general.content'),
        code: 'Content',
        id: 2,
        icon: ArticleTwoTone,
        color: blue[800],
      },
      {
        text: t('general.footer'),
        code: 'Footer',
        id: 3,
        icon: VerticalAlignBottomTwoTone,
        color: blue[800],
      },
    ],
    []
  );

  const BlockType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.title'),
        code: BlockTypeEnum.Title,
        id: 0,
        icon: TitleTwoTone,
        color: orange[800],
      },
      {
        text: t('general.subtitle'),
        code: BlockTypeEnum.Subtitle,
        id: 1,
        icon: SubtitlesTwoTone,
        color: orange[800],
      },
      {
        text: t('general.text'),
        code: BlockTypeEnum.Text,
        id: 2,
        icon: TextSnippetTwoTone,
        color: orange[800],
      },
      {
        text: t('general.paragraph'),
        code: BlockTypeEnum.Paragraph,
        id: 3,
        icon: DescriptionTwoTone,
        color: orange[800],
      },
      {
        text: t('general.html'),
        code: BlockTypeEnum.HTML,
        id: 4,
        icon: CodeTwoTone,
        color: orange[800],
      },
    ],
    []
  );

  const ContentType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.text-blocks'),
        code: ContentTypeEnum.TextBlock,
        id: 0,
        icon: TextSnippetTwoTone,
        color: blue[500],
      },
      {
        text: t('general.embed-html'),
        code: ContentTypeEnum.EmbedHtml,
        id: 2,
        icon: CodeTwoTone,
        color: blue[500],
      },
      {
        text: t('general.table'),
        code: ContentTypeEnum.Table,
        id: 3,
        icon: TableChartTwoTone,
        color: blue[500],
      },
      {
        text: t('general.loop-table'),
        code: ContentTypeEnum.LoopTable,
        id: 4,
        icon: RepeatTwoTone,
        color: blue[500],
      },
    ],
    []
  );

  const DataStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.dummy'),
        code: 'Dummy',
        id: 0,
        icon: DoNotDisturbTwoTone,
        color: blue[800],
      },
      { text: t('status.missing'), code: 'Missing', id: 1, icon: RuleTwoTone, color: orange[800] },
      {
        text: t('status.pending'),
        code: 'Pending',
        id: 1,
        icon: HourglassEmptyTwoTone,
        color: orange[500],
      },
      { text: t('status.blocked'), code: 'Blocked', id: 2, icon: BlockTwoTone, color: red[800] },
      {
        text: t('status.partial'),
        code: 'Partial',
        id: 3,
        icon: HourglassTopTwoTone,
        color: blue[800],
      },
      { text: t('status.ready'), code: 'Ready', id: 4, icon: CheckCircleTwoTone, color: blue[500] },
    ],
    []
  );
  const DeliveryType: IEnumProps[] = useMemo(
    () => [
      { text: 'Initial', code: 'Initial', id: 0, icon: PlayArrowTwoTone, color: blue[800] },
      {
        text: 'Intermediate',
        code: 'Intermediate',
        id: 1,
        icon: SyncAltTwoTone,
        color: orange[800],
      },
      {
        text: 'Intermediate Update',
        code: 'IntermediateUpdate',
        id: 2,
        icon: UpdateTwoTone,
        color: orange[800],
      },
      { text: 'Bug Fixing', code: 'BugFixing', id: 3, icon: BugReportTwoTone, color: red[800] },
      {
        text: 'Bug Fixing Update',
        code: 'BugFixingUpdate',
        id: 4,
        icon: BuildCircleTwoTone,
        color: red[800],
      },
      { text: 'Final', code: 'Final', id: 5, icon: FlagTwoTone, color: blue[800] },
      {
        text: 'Final Update',
        code: 'FinalUpdate',
        id: 6,
        icon: PublishedWithChangesTwoTone,
        color: blue[800],
      },
    ],
    []
  );
  const RunMode: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.on-demand'),
        code: 'OnDemand',
        id: 0,
        icon: PlayCircleTwoTone,
        color: blue[500],
      },
      {
        text: t('general.automatic'),
        code: 'Automatic',
        id: 1,
        icon: SettingsTwoTone,
        color: blue[800],
      },
    ],
    []
  );
  const RuleMode: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.manual'),
        code: RuleModeEnum.Manual,
        id: 0,
        icon: PlayCircleTwoTone,
        color: orange[500],
      },
      {
        text: t('general.automatic'),
        code: RuleModeEnum.Auto,
        id: 1,
        icon: SettingsTwoTone,
        color: blue[500],
      },
      {
        text: t('status.disable'),
        code: RuleModeEnum.Ignored,
        id: 1,
        icon: BlockOutlined,
        color: red[500],
      },
    ],
    []
  );

  const ExecutionStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.scheduled'),
        code: 'Schedule',
        id: 0,
        icon: ScheduleTwoTone,
        color: blue[800],
      },
      {
        text: t('status.running'),
        code: 'Running',
        id: 1,
        icon: PlayArrowTwoTone,
        color: blue[500],
      },
      {
        text: t('status.success'),
        code: 'Success',
        id: 2,
        icon: CheckCircleTwoTone,
        color: green[500],
      },
      { text: t('status.error'), code: 'Error', id: 3, icon: ErrorTwoTone, color: red[500] },
      {
        text: t('status.warning'),
        code: 'Warning',
        id: 4,
        icon: WarningAmberTwoTone,
        color: orange[500],
      },
    ],
    []
  );
  const IngestStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.running'),
        code: 'Running',
        id: 0,
        icon: PlayArrowTwoTone,
        color: blue[500],
      },
      {
        text: t('status.success'),
        code: 'Success',
        id: 1,
        icon: CheckCircleTwoTone,
        color: green[500],
      },
      { text: t('status.error'), code: 'Error', id: 2, icon: ErrorTwoTone, color: red[500] },
      {
        text: t('status.warning'),
        code: 'Warning',
        id: 3,
        icon: WarningAmberTwoTone,
        color: orange[500],
      },
    ],
    []
  );
  const NoteType: IEnumProps[] = useMemo(
    () => [
      { text: t('general.general'), code: 'general', id: 0, icon: NotesTwoTone, color: blue[500] },
      { text: t('general.data'), code: 'data', id: 1, icon: DataUsageTwoTone, color: pink[600] },
      {
        text: t('general.requirement'),
        code: 'requirement',
        id: 2,
        icon: AssignmentTwoTone,
        color: blue[800],
      },
      { text: t('status.error'), code: 'error', id: 3, icon: ErrorTwoTone, color: red[500] },
      {
        text: t('status.warning'),
        code: 'warning',
        id: 4,
        icon: WarningAmberTwoTone,
        color: orange[500],
      },
      {
        text: t('common.delivery'),
        code: 'delivery',
        id: 5,
        icon: AssignmentReturnedTwoTone,
        color: green[500],
      },
      {
        text: t('common.information'),
        code: 'information',
        id: 6,
        icon: InfoTwoTone,
        color: blue[800],
      },
    ],
    []
  );
  const ReportParticipantType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.individual'),
        code: 'Individual',
        id: 0,
        icon: PersonTwoTone,
        color: blue[800],
      },
      { text: t('general.team'), code: 'Team', id: 1, icon: GroupsTwoTone, color: blue[500] },
    ],
    [t]
  );
  const FeedFlag: IEnumProps[] = useMemo(
    () => [
      { text: 'Testing (T)', code: 'T', id: 0, color: blue[800] },
      { text: 'Production (P)', code: 'P', id: 1, color: blue[500] },
    ],
    []
  );
  const ReportFormat: IEnumProps[] = useMemo(
    () => [
      { text: 'Xml', code: 'XML', id: 0, icon: DescriptionTwoTone, color: blue[800] },
      { text: 'Csv', code: 'CSV', id: 1, icon: GridViewTwoTone, color: blue[800] },
      { text: 'Excel', code: 'XLS', id: 2, icon: InsertDriveFileTwoTone, color: blue[800] },
      { text: 'Odf', code: 'ODF', id: 3, icon: FormatBoldTwoTone, color: blue[800] },
      { text: 'Json', code: 'JSON', id: 4, icon: DataArrayTwoTone, color: blue[800] },
    ],
    []
  );
  const ReportStatus: IEnumProps[] = useMemo(
    () => [
      {
        text: t('status.draft'),
        code: 'Draft',
        id: 0,
        icon: DesignServicesTwoTone,
        color: orange[800],
      },
      {
        text: t('status.testing'),
        code: 'Testing',
        id: 1,
        icon: BugReportTwoTone,
        color: orange[500],
      },
      {
        text: t('status.approved'),
        code: 'Approved',
        id: 2,
        icon: CheckCircleTwoTone,
        color: blue[500],
      },
      { text: t('status.error'), code: 'Error', id: 3, icon: ErrorTwoTone, color: red[500] },
      {
        text: t('status.ready'),
        code: 'Ready',
        id: 4,
        icon: CheckCircleTwoTone,
        color: green[500],
      },
      {
        text: t('status.delivered'),
        code: 'Delivered',
        id: 5,
        icon: LocalShippingTwoTone,
        color: green[800],
      },
      {
        text: t('status.cancelled'),
        code: 'Cancelled',
        id: 5,
        icon: CancelOutlined,
        color: red[800],
      },
    ],
    []
  );
  const ReportType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.medals'),
        code: 'Medals',
        id: 0,
        icon: EmojiEventsTwoTone,
        color: blue[800],
      },
      {
        text: t('general.placing'),
        code: 'Placing',
        id: 1,
        icon: FormatListNumberedTwoTone,
        color: blue[800],
      },
      {
        text: t('general.historicalResults'),
        code: 'HistoricalResult',
        id: 2,
        icon: HistoryTwoTone,
        color: blue[800],
      },
      {
        text: t('general.ranking'),
        code: 'Ranking',
        id: 3,
        icon: StarRateTwoTone,
        color: blue[800],
      },
      {
        text: t('general.records'),
        code: 'Record',
        id: 4,
        icon: WorkspacePremiumTwoTone,
        color: blue[800],
      },
      {
        text: t('general.achievements'),
        code: 'Achievements',
        id: 5,
        icon: EmojiSymbolsTwoTone,
        color: blue[800],
      },
      {
        text: t('general.biographies'),
        code: 'Biography',
        id: 6,
        icon: PersonTwoTone,
        color: blue[800],
      },
      {
        text: t('general.head-to-head'),
        code: 'H2H',
        id: 7,
        icon: PeopleTwoTone,
        color: blue[800],
      },
      {
        text: t('general.live-head-to-head'),
        code: 'H2HLive',
        id: 8,
        icon: LiveTvTwoTone,
        color: blue[800],
      },
      {
        text: t('general.live-start-list'),
        code: 'StarList',
        id: 9,
        icon: StarTwoTone,
        color: blue[800],
      },
      { text: t('common.unknown'), code: 'Unknown', id: 9, icon: StarTwoTone, color: blue[800] },
    ],
    []
  );

  const SectionType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.header'),
        code: SectionTypeEnum.Header,
        id: 0,
        icon: TextFieldsTwoTone,
        color: blue[800],
      },
      {
        text: t('general.subheader'),
        code: SectionTypeEnum.SubHeader,
        id: 1,
        icon: SubtitlesTwoTone,
        color: blue[800],
      },
      {
        text: t('general.content'),
        code: SectionTypeEnum.Content,
        id: 2,
        icon: ArticleTwoTone,
        color: blue[800],
      },
      {
        text: t('general.footer'),
        code: SectionTypeEnum.Footer,
        id: 3,
        icon: VerticalAlignBottomTwoTone,
        color: blue[800],
      },
      {
        text: t('general.legend'),
        code: SectionTypeEnum.Legend,
        id: 4,
        icon: LabelTwoTone,
        color: blue[800],
      },
    ],
    []
  );

  const SourceCategory: IEnumProps[] = useMemo(
    () => [
      { text: 'USDM', code: 'USDM', id: 0, icon: DataSaverOffTwoTone, color: blue[800] },
      { text: 'Federation API', code: 'FederationApi', id: 1, icon: ApiTwoTone, color: blue[800] },
      { text: 'Public API', code: 'PublicApi', id: 2, icon: PublicTwoTone, color: blue[800] },
      { text: 'Web Scrapping', code: 'WebScrapping', id: 3, icon: WebTwoTone, color: blue[800] },
      { text: 'PDF', code: 'PDF', id: 4, icon: PictureAsPdfTwoTone, color: blue[800] },
      { text: 'Excel', code: 'Excel', id: 5, icon: InsertDriveFileTwoTone, color: blue[800] },
      { text: 'CSV', code: 'CSV', id: 6, icon: GridViewTwoTone, color: blue[800] },
      { text: 'Other', code: 'Other', id: 7, icon: MoreHorizTwoTone, color: blue[800] },
    ],
    []
  );

  const SourceType: IEnumProps[] = useMemo(
    () => [
      {
        text: 'Table',
        code: SourceTypeEnum.Table,
        id: 0,
        icon: TableChartTwoTone,
        color: blue[800],
      },
      { text: 'Api', code: SourceTypeEnum.Api, id: 1, icon: ApiTwoTone, color: blue[800] },
    ],
    []
  );

  const TextAlignment: IEnumProps[] = useMemo(
    () => [
      { text: 'None', code: TextAlignmentEnum.None, id: 0, icon: ClearTwoTone, color: blue[800] },
      {
        text: 'Right',
        code: TextAlignmentEnum.Right,
        id: 1,
        icon: FormatAlignRightTwoTone,
        color: blue[800],
      },
      {
        text: 'Left',
        code: TextAlignmentEnum.Left,
        id: 2,
        icon: FormatAlignLeftTwoTone,
        color: blue[800],
      },
      {
        text: 'Top',
        code: TextAlignmentEnum.Top,
        id: 3,
        icon: VerticalAlignTopTwoTone,
        color: blue[800],
      },
      {
        text: 'Bottom',
        code: TextAlignmentEnum.Bottom,
        id: 4,
        icon: VerticalAlignBottomTwoTone,
        color: blue[800],
      },
      {
        text: 'Center',
        code: TextAlignmentEnum.Center,
        id: 5,
        icon: FormatAlignCenterTwoTone,
        color: blue[800],
      },
      {
        text: 'Middle',
        code: TextAlignmentEnum.Middle,
        id: 5,
        icon: FormatAlignCenterTwoTone,
        color: blue[800],
      },
    ],
    []
  );

  const TextStyle: IEnumProps[] = useMemo(
    () => [
      {
        text: 'Normal',
        code: TextStyleEnum.Normal,
        id: 0,
        icon: FormatColorTextTwoTone,
        color: blue[800],
      },
      { text: 'Bold', code: TextStyleEnum.Bold, id: 1, icon: FormatBoldTwoTone, color: blue[800] },
      {
        text: 'Underline',
        code: TextStyleEnum.Underline,
        id: 2,
        icon: FormatUnderlinedTwoTone,
        color: blue[800],
      },
      {
        text: 'Italic',
        code: TextStyleEnum.Italic,
        id: 3,
        icon: FormatItalicTwoTone,
        color: blue[800],
      },
      {
        text: 'Stroke',
        code: TextStyleEnum.Stroke,
        id: 4,
        icon: FormatStrikethroughTwoTone,
        color: blue[800],
      },
      { text: 'Title', code: TextStyleEnum.Title, id: 5, icon: TitleTwoTone, color: green[800] },
      {
        text: 'Subtitle',
        code: TextStyleEnum.Subtitle,
        id: 6,
        icon: SubtitlesTwoTone,
        color: blue[800],
      },
      {
        text: 'Caption',
        code: TextStyleEnum.Caption,
        id: 7,
        icon: TextSnippetTwoTone,
        color: blue[800],
      },
    ],
    []
  );

  const DisplayFormat: IEnumProps[] = useMemo(
    () => [
      { text: 'None', code: 'NONE', id: 0, color: blue[800] },
      { text: 'Integer', code: 'Integer', id: 1, color: blue[800] },
      { text: 'Numeric NoDecimals', code: 'NumericNoDecimals', id: 2, color: blue[800] },
      { text: 'Numeric 2-Decimals', code: 'Numeric2Decimals', id: 3, color: blue[800] },
      { text: 'Numeric 3=Decimals', code: 'Numeric3Decimals', id: 4, color: blue[800] },
      { text: 'DateTime', code: 'DateTime', id: 5, color: blue[800] },
      { text: 'Date', code: 'Date', id: 6, color: blue[800] },
      { text: 'YYYY', code: 'Year', id: 7, color: blue[800] },
      { text: 'MMM YYYY', code: 'MonthYear', id: 7, color: blue[800] },
      { text: 'Time', code: 'TimeTime', id: 8, color: blue[800] },
      { text: 'Time with Milliseconds', code: 'TimeMilliseconds', id: 9, color: blue[800] },
      { text: 'Time (,)Milliseconds', code: 'TimeDecimalsTimeDecimals', id: 10, color: blue[800] },
    ],
    []
  );

  const IngestSource: IEnumProps[] = useMemo(
    () => [
      { text: 'UWW', code: 'UWW', id: 0, color: blue[500] },
      { text: 'FIVB', code: 'FIVB', id: 1, color: blue[500] },
      { text: 'ITF', code: 'ITF', id: 2, color: blue[800] },
      { text: 'IBF', code: 'IBF', id: 3, color: orange[500] },
      { text: 'ITTF', code: 'ITTF', id: 4, color: green[500] },
      { text: 'WT', code: 'WT', id: 5, color: green[800] },
      { text: 'FEI', code: 'FEI', id: 6, color: blue[800] },
      { text: 'BWF', code: 'BWF', id: 7, color: orange[500] },
      { text: 'WA', code: 'WA', id: 8, color: green[500] },
      { text: 'FIBA', code: 'FIBA', id: 9, color: blue[800] },
      { text: 'IFSC', code: 'IFSC', id: 10, color: blue[500] },
      { text: 'UCI', code: 'UCI', id: 11, color: blue[800] },
      { text: 'WS', code: 'WS', id: 12, color: orange[500] },
      { text: 'ICF', code: 'ICF', id: 13, color: green[500] },
      { text: 'WTR', code: 'WTR', id: 14, color: blue[800] },
      { text: 'FIFA', code: 'FIFA', id: 15, color: blue[500] },
      { text: 'IHF', code: 'IHF', id: 16, color: blue[800] },
      { text: 'IGF', code: 'IGF', id: 17, color: blue[800] },
      { text: 'UIPM', code: 'UIPM', id: 18, color: green[800] },
      { text: 'FINA', code: 'FINA', id: 19, color: green[500] },
      { text: 'FIH', code: 'FIH', id: 20, color: blue[800] },
      { text: 'WR', code: 'WR', id: 21, color: blue[500] },
      { text: 'IWF', code: 'IWF', id: 22, color: blue[800] },
      { text: 'ISSF', code: 'ISSF', id: 23, color: orange[500] },
      { text: 'IAAF', code: 'IAAF', id: 24, color: green[500] },
      { text: 'FISA', code: 'FISA', id: 25, color: blue[800] },
      { text: 'FIS', code: 'FIS', id: 26, color: blue[500] },
      { text: 'ISMF', code: 'ISMF', id: 27, color: orange[500] },
      { text: 'SDW', code: 'SDW', id: 28, color: blue[800] },
      { text: 'HORD', code: 'HORD', id: 29, color: blue[500] },
      { text: 'OG2024', code: 'OG2024', id: 30, color: blue[800] },
      { text: 'OG2026', code: 'OG2026', id: 31, color: green[500] },
      { text: 'None', code: 'NONE', id: 32, color: red[500] },
    ],
    []
  );
  const ScopeType: IEnumProps[] = useMemo(
    () => [
      {
        text: t('general.results'),
        code: ScopeTypeEnum.Results,
        id: 0,
        icon: FileDownloadDoneOutlined,
        color: blue[800],
      },
      {
        text: t('general.ranking'),
        code: ScopeTypeEnum.Ranking,
        id: 1,
        icon: FileDownloadDoneOutlined,
        color: orange[800],
      },
      {
        text: t('general.medallists'),
        code: ScopeTypeEnum.Medallists,
        id: 2,
        icon: WorkspacePremiumOutlined,
        color: pink[600],
      },
      {
        text: t('general.team-members'),
        code: ScopeTypeEnum.TeamMembers,
        id: 3,
        icon: FileDownloadDoneOutlined,
        color: green[600],
      },
      {
        text: t('general.pools'),
        code: ScopeTypeEnum.Pools,
        id: 4,
        icon: FileDownloadDoneOutlined,
        color: lime[800],
      },
      {
        text: t('general.results-breakdown'),
        code: ScopeTypeEnum.ResultsBreakdown,
        id: 5,
        icon: FileDownloadDoneOutlined,
        color: blue[800],
      },
      {
        text: t('general.seasonal-standings'),
        code: ScopeTypeEnum.SeasonalStandings,
        id: 6,
        icon: FileDownloadDoneOutlined,
        color: teal[800],
      },
      {
        text: t('general.seasonal-rankings'),
        code: ScopeTypeEnum.SeasonalRankings,
        id: 7,
        icon: FileDownloadDoneOutlined,
        color: purple[800],
      },
      {
        text: t('general.overall-standings'),
        code: ScopeTypeEnum.OverallStandings,
        id: 8,
        icon: FileDownloadDoneOutlined,
        color: amber[800],
      },
      {
        text: 'Relay',
        code: ScopeTypeEnum.Relay,
        id: 9,
        icon: FileDownloadDoneOutlined,
        color: blue[800],
      },
    ],
    []
  );

  const FieldSettings: IEnumProps[] = useMemo(
    () => [
      { text: 'Hide Header', code: 'HideHeader', id: 0, color: red[500] },
      { text: 'Allow Empty Headers', code: 'AllowEmptyHeaders', id: 1, color: orange[500] },
      { text: 'Hide Empty Columns', code: 'HideEmptyColumns', id: 2, color: blue[800] },
      { text: 'First Row As Header', code: 'FirstRowAsHeader', id: 3, color: blue[500] },
      { text: 'Merge Previous By Key', code: 'MergePreviousByKey', id: 4, color: blue[800] },
      { text: 'Merge Equal Header', code: 'MergeEqualHeader', id: 5, color: green[500] },
      { text: 'Include Summary', code: 'IncludeSummary', id: 6, color: green[800] },
      { text: 'Display Zeros', code: 'DisplayZeros', id: 7, color: blue[800] },
    ],
    []
  );
  const EnumMap: { [key in EnumType]?: IEnumProps[] } = useMemo<{
    [key in EnumType]?: IEnumProps[];
  }>(() => {
    return {
      [EnumType.Season]: Season,
      [EnumType.ScopeType]: ScopeType,
      [EnumType.AccreditationStatus]: AccreditationStatus,
      [EnumType.IngestType]: IngestType,
      [EnumType.IndividualParticipantType]: IndividualParticipantType,
      [EnumType.ParticipantType]: ParticipantType,
      [EnumType.MergeEntityType]: MergeEntityType,
      [EnumType.MergeEntitySubType]: MergeEntitySubType,
      [EnumType.MergeType]: MergeType,
      [EnumType.EntityStatus]: EntityStatus,
      [EnumType.MergeStatus]: MergeStatus,
      [EnumType.ConflictStatus]: ConflictStatus,
      [EnumType.ComparisonStatus]: ComparisonStatus,
      [EnumType.WorkflowState]: WorkflowState,
      [EnumType.DocumentType]: DocumentType,
      [EnumType.UsdfFormat]: UsdfFormat,
      [EnumType.UsdfType]: UsdfType,
      [EnumType.IngestResultStatus]: IngestResultStatus,
      [EnumType.BioStatus]: BioStatus,
      [EnumType.PersonType]: PersonType,
      [EnumType.NoteType]: NoteType,
      [EnumType.ReportType]: ReportType,
      [EnumType.ReportFormat]: ReportFormat,
      [EnumType.SourceType]: SourceType,
      [EnumType.SourceCategory]: SourceCategory,
      [EnumType.IngestSource]: IngestSource,
      [EnumType.SectionType]: SectionType,
      [EnumType.ContentType]: ContentType,
      [EnumType.ReportStatus]: ReportStatus,
      [EnumType.DataStatus]: DataStatus,
      [EnumType.BiographyType]: BiographyType,
      [EnumType.BlockPosition]: BlockPosition,
      [EnumType.BlockType]: BlockType,
      [EnumType.TextAlignment]: TextAlignment,
      [EnumType.TextStyle]: TextStyle,
      [EnumType.DisplayFormat]: DisplayFormat,
      [EnumType.BiographyAction]: BiographyAction,
      [EnumType.ReportParticipantType]: ReportParticipantType,
      [EnumType.ExecutionStatus]: ExecutionStatus,
      [EnumType.RunMode]: RunMode,
      [EnumType.DeliveryStatus]: DeliveryStatus,
      [EnumType.FieldSettings]: FieldSettings,
      [EnumType.DeliveryType]: DeliveryType,
      [EnumType.FeedFlag]: FeedFlag,
      [EnumType.OdfRule]: OdfRule,
      [EnumType.StageType]: StageType,
      [EnumType.RuleMode]: RuleMode,
      [EnumType.ReportEntityType]: ReportEntityType,
      [EnumType.IngestStatus]: IngestStatus,
    };
  }, [
    Season,
    ScopeType,
    ReportEntityType,
    IngestStatus,
    AccreditationStatus,
    IngestType,
    IndividualParticipantType,
    ParticipantType,
    MergeEntityType,
    MergeEntitySubType,
    MergeType,
    EntityStatus,
    MergeStatus,
    ConflictStatus,
    ComparisonStatus,
    WorkflowState,
    DocumentType,
    UsdfFormat,
    UsdfType,
    IngestResultStatus,
    BioStatus,
    PersonType,
    NoteType,
    ReportType,
    ReportFormat,
    SourceType,
    SourceCategory,
    IngestSource,
    SectionType,
    ContentType,
    ReportStatus,
    DataStatus,
    BiographyType,
    BlockPosition,
    BlockType,
    TextAlignment,
    TextStyle,
    DisplayFormat,
    BiographyAction,
    ReportParticipantType,
    ExecutionStatus,
    RunMode,
    DeliveryStatus,
    FieldSettings,
    DeliveryType,
    FeedFlag,
    OdfRule,
    StageType,
    RuleMode,
  ]);

  const getEnumOfType = useCallback(
    (type: EnumType): IEnumProps[] => {
      return EnumMap[type] || EntityStatus;
    },
    [EnumMap, EntityStatus]
  );
  const getIdMenuOf = (type: EnumType): ISelectMenuItem[] =>
    getEnumOfType(type).map((e: IEnumProps) => ({ title: e.text, value: e.id.toString() }));

  const getEnumValueOf = useCallback(
    (field: string, type: EnumType): IEnumProps | null => {
      const currentEnum = getEnumOfType(type);
      if (currentEnum) {
        return isPresent(field)
          ? (currentEnum.find(
              (item) =>
                item.code.toUpperCase() === field.toUpperCase() ||
                item.text.toUpperCase() === field.toUpperCase()
            ) ?? null)
          : null;
      }
      return null;
    },
    [getEnumOfType]
  );
  const isPresent = (value: string) => value !== null && value !== undefined;
  const defaultValueOf = useCallback(
    (type: EnumType): IEnumProps => {
      const currentEnum = getEnumOfType(type);
      if (type == EnumType.MergeEntitySubType) return currentEnum[5];
      if (type == EnumType.ReportFormat) return getEnumValueOf('XML', EnumType.ReportFormat)!;
      if (type == EnumType.ReportType) return getEnumValueOf('ACHIEVEMENTS', EnumType.ReportType)!;
      return currentEnum[0];
    },
    [getEnumOfType]
  );
  const defaultTemplateValueOf = (type: EnumType): IEnumProps => defaultValueOf(type);
  const defaultCodeOf = (type: EnumType): string => defaultValueOf(type).code;
  function isIEnumProps(obj: any): obj is IEnumProps {
    return (
      typeof obj === 'object' &&
      'text' in obj &&
      'code' in obj &&
      'id' in obj &&
      'icon' in obj &&
      'color' in obj
    );
  }
  const getEnumValues = useCallback(
    (type: EnumType): IEnumProps[] => getEnumOfType(type),
    [getEnumOfType]
  );

  const getMenuOf = (type: EnumType): ISelectMenuItem[] =>
    getEnumOfType(type).map((e: IEnumProps) => ({
      title: e.text,
      value: e.text.replace(/ /g, ''),
    }));
  const getFlagsValue = (flags: any) => flags.reduce((acc: any, el: any) => acc | el, 0);
  return {
    isIEnumProps,
    defaultCodeOf,
    defaultValueOf,
    defaultTemplateValueOf,
    getEnumValueOf,
    getEnumOfType,
    getEnumValues,
    getIdMenuOf,
    getMenuOf,
    getFlagsValue,
  };
};
