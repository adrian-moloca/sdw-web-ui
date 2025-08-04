import { FC } from 'react';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { EdgeLabel } from 'components/EdgeLabel';

export const EdgeStartEnd: FC<EdgeProps<Edge<{ startLabel: string; endLabel: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        {data?.startLabel && (
          <EdgeLabel
            transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
            label={data.startLabel}
          />
        )}
        {data?.endLabel && (
          <EdgeLabel
            transform={`translate(-100%, -90%) translate(${targetX}px,${targetY}px)`}
            label={data.endLabel}
          />
        )}
      </EdgeLabelRenderer>
    </>
  );
};
