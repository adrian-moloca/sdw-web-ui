import get from 'lodash/get';
import { JudgeScoringCard } from './JudgeScoringCard';

type Props = {
  data: any;
};
export const ExtendedJudgeScoring = ({ data }: Props) => {
  const judgeCriteria = get(data, 'result.extensions.judgeCriteria');
  const judgeScore = get(data, 'result.extensions.judgeScore');

  if (!judgeCriteria && !judgeScore) return null;
  return (
    <>
      {judgeCriteria && (judgeCriteria.judges.length > 0 || judgeCriteria.rounds.length > 0) && (
        <JudgeScoringCard data={judgeCriteria} />
      )}
      {judgeScore && (judgeScore.judges.length > 0 || judgeScore.rounds.length > 0) && (
        <JudgeScoringCard data={judgeScore} />
      )}
    </>
  );
};
