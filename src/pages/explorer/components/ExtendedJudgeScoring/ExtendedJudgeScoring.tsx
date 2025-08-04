import get from 'lodash/get';
import { JudgeScoringCard } from './JudgeScoringCard';
import { humanize } from '_helpers';

type Props = {
  data: any;
  title?: string;
};
export const ExtendedJudgeScoring = ({ data }: Props) => {
  const judgeCriteria = get(data, 'result.extensions.judgeCriteria');
  const judgeScore = get(data, 'result.extensions.judgeScore');

  if (!judgeCriteria && !judgeScore) return null;
  return (
    <>
      {judgeCriteria && (judgeCriteria.judges.length > 0 || judgeCriteria.rounds.length > 0) && (
        <JudgeScoringCard data={judgeCriteria} title={humanize(judgeCriteria.type)} />
      )}
      {judgeScore && (judgeScore.judges.length > 0 || judgeScore.rounds.length > 0) && (
        <JudgeScoringCard data={judgeScore} title={humanize(judgeScore.type)} />
      )}
    </>
  );
};
