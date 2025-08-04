import { t } from 'i18next';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { disciplineLabelKeyOverrides } from './configs/frameUtilsByDiscipline';

export type LabelKeyMap = Record<string, string>;
interface Props {
  getLabels: (category: string, isTimeCollection: boolean, discipline: string) => LabelKeyMap;
  useMainLabels: (type: string) => { title: string; icon: OverridableComponent<SvgIconTypeMap> };
}
export function useExtendedInformation(): Props {
  const getLabels = (category: string, isTimeCollection: boolean, discipline: string) => {
    const getValue = () => {
      if (category === 'SPEED') {
        return t('general.maxSpeed');
      } else if (isTimeCollection) {
        return t('general.time');
      }

      return t('general.value');
    };

    const labels: LabelKeyMap = {
      totalValue: t('general.total'),
      total_value: t('general.total'),
      rank: t('general.rank'),
      diff: t('general.diff'),
      value: getValue(),
      value2: category == 'SPEED' ? t('general.minSpeed') : t('general.extra-info'),
      move: t('general.move'),
      arrive: t('general.arrival'),
      attempt: t('general.attempt'),
      penalty: t('general.penalty'),
      dist: t('general.distance'),
      cumulative: t('general.cumulative'),
      arrow_tot: t('general.totalArrows'),
      diam: t('general.diameter'),
      wind: t('general.wind'),
      x: t('general.x-axis'),
      y: t('general.y-axis'),
      RANK_IRM: `${t('general.rank')} IRM`,
      SHOT: t('general.shots'),
      SHOTS: t('general.shots'),
      LAST: t('general.last'),
      SPARE: t('general.spare'),
      SPARE_TOT: `${t('general.total')} ${t('general.spare')}`,
      SPARE_CUM: `${t('general.cumulative')} ${t('general.spare')}`,
      PENALTY_TOT: `${t('general.total')} ${t('general.penalty')}`,
      PENALTY_CUM: `${t('general.cumulative')} ${t('general.penalty')}`,
      PENALTY_TIME: t('general.penalty'),
      DIFF_FAST: t('general.diff-fast'),
      DIFF_FAST_IRM: `${t('general.diff-fast')} IRM`,
      PAIR_DIFF: t('general.pair-diff'),
      ERANK_IRM: t('general.rankEqualed'),
      TEAM_SCORE: t('general.team-score'),
      RECORD_MARK: t('general.record'),
      AFTER_ATTEMPT_RANK: t('general.attempt-rank'),
      AFTER_ATTEMPT_BEST: t('general.attempt-best'),
      AFTER_INTERMEDIATE_RANK: t('general.intermediate-rank'),
      AFTER_INTERMEDIATE_RECORD: t('general.intermediate-record'),
      AFTER_INTERMEDIATE_SORT_ORDER: t('general.rank'),
      STEP: t('general.step'),
      LOST: t('general.lost'),
      RUNWAY_SPEED: t('general.runAwaySpeed'),
      WIND_SPEED: t('general.wind-speed'),
      OFFSET: t('general.offset'),
    };
    const disciplineOverrideKeys = disciplineLabelKeyOverrides[discipline] || {};
    for (const key in disciplineOverrideKeys) {
      if (Object.hasOwn(disciplineOverrideKeys, key)) {
        const overrideTranslationKey = disciplineOverrideKeys[key];
        if (overrideTranslationKey) labels[key] = t(overrideTranslationKey);
      }
    }
    return labels;
  };

  const useMainLabels = (
    type: string
  ): { title: string; icon: OverridableComponent<SvgIconTypeMap> } => {
    switch (type) {
      case 'PROGRESS':
        return {
          title: t('general.progress-at-intermediate-points'),
          icon: LinearScaleOutlinedIcon,
        };
      case 'SPEED':
        return { title: t('general.speed-progress'), icon: BoltOutlinedIcon };
      case 'BIKE':
        return {
          title: t('general.progress-at-intermediate-points'),
          icon: DirectionsBikeOutlinedIcon,
        };
      case 'SWIM':
        return {
          title: t('general.progress-at-intermediate-points'),
          icon: PoolOutlinedIcon,
        };
      case 'RUN':
        return {
          title: t('general.progress-at-intermediate-points'),
          icon: DirectionsRunOutlinedIcon,
        };
      case 'JUDGE_CRITERIA':
      case 'JUDGE':
        return {
          title: t('general.judge-scoring'),
          icon: GavelOutlinedIcon,
        };
      case 'SUMMARY':
        return {
          title: t('general.progress-at-intermediate-points'),
          icon: SportsScoreOutlinedIcon,
        };
      case 'ROUTINE':
        return { title: t('general.points-breakdown'), icon: BallotOutlinedIcon };
      case 'ER':
      case 'ER_EQ':
        return { title: t('general.extended-results'), icon: ScoreboardOutlinedIcon };
      default:
        return { title: t('general.points-breakdown'), icon: AccountTreeOutlinedIcon };
    }
  };
  return {
    getLabels,
    useMainLabels,
  };
}
