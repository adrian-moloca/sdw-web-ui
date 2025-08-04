import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Node,
  Edge,
  Position,
  EdgeTypes,
  DefaultEdgeOptions,
  MarkerType,
} from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import { useCallback } from 'react';
import useApiService from 'hooks/useApiService';
import { ErrorPanel, GenericLoadingPanel } from 'components';
import type { IPanelTabProps } from 'types/views';
import appConfig from 'config/app.config';
import { EdgeStartEnd } from 'components/EdgeStartEnd';
import { StructureEventNode } from '../StructureEventNode';
import { StructureStageNode } from '../StructureStageNode';
import { StructurePhaseNode } from '../StructurePhaseNode';
import { StructureUnitNode } from '../StructureUnitNode';

const edgeTypes: EdgeTypes = {
  'start-end': EdgeStartEnd,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'start-end',
  markerEnd: { type: MarkerType.ArrowClosed, strokeWidth: 3 },
};

export const EventStructureBuilder = ({ parameter }: IPanelTabProps) => {
  const apiService = useApiService();
  const url = `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', parameter.id ?? '')}`;

  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });
  const generateNodesAndEdges = useCallback(
    (data: any, competitionId: string, disciplineId: string) => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      nodes.push({
        id: data.id,
        width: 300,
        data: {
          label: (
            <StructureEventNode
              data={data}
              competitionId={competitionId}
              disciplineId={disciplineId}
            />
          ),
        },
        sourcePosition: Position.Bottom,
        position: { x: 0, y: 0 },
        style: { borderColor: grey[500], borderWidth: 1, padding: 0 },
      });

      let yOffset = 90;
      data.stages?.forEach((stage: any) => {
        const stageId = stage.id;
        nodes.push({
          id: stageId,
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
          width: 300,
          data: {
            label: <StructureStageNode data={stage} />,
          },
          position: { x: 180, y: yOffset },
          style: { borderColor: grey[500], borderWidth: 1, padding: 0 },
        });
        edges.push({
          id: `e-${data.id}-${stageId}`,
          source: data.id,
          target: stageId,
          type: 'start-end',
        });

        orderBy(stage.phases, 'order').forEach((phase: any) => {
          const phaseId = phase.id;
          nodes.push({
            id: phaseId,
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
            width: 300,
            data: {
              label: (
                <StructurePhaseNode
                  data={phase}
                  competitionId={competitionId}
                  disciplineId={disciplineId}
                  eventId={data.id}
                />
              ),
            },
            position: { x: 550, y: yOffset },
            style: { borderColor: grey[500], borderWidth: 1, padding: 0 },
          });
          edges.push({
            id: `e-${stageId}-${phaseId}`,
            source: stageId,
            target: phaseId,
            type: 'start-end',
          });

          const groupedUnits = groupBy(orderBy(phase.units, 'order'), 'title');
          // eslint-disable-next-line
          Object.entries(groupedUnits).forEach(([_key, units]) => {
            const unitCount = units.length; // Get the number of units in the group
            const firstUnit = units[0]; // Use the first unit as a reference for positioning
            const groupId = `group-${firstUnit.id}`;

            // Create a node for the group
            nodes.push({
              id: groupId,
              targetPosition: Position.Left,
              sourcePosition: Position.Right,
              width: 380,
              data: {
                label: (
                  <StructureUnitNode
                    data={firstUnit}
                    competitionId={competitionId}
                    disciplineId={disciplineId}
                    allData={units} // Pass all units for date calculation
                  />
                ),
              },
              position: { x: 920, y: yOffset },
              style: { borderColor: grey[500], borderWidth: 1, padding: 0 },
            });

            // Create an edge from the phase to the grouped unit node with a label
            edges.push({
              id: `e-${phaseId}-${groupId}`,
              source: phaseId,
              target: groupId,
              type: 'start-end',
              data: { endLabel: unitCount > 1 ? `x ${unitCount}` : null }, // Display the number of units in the edge label
            });

            yOffset += 70;
          });
        });
      });

      return { nodes, edges };
    },
    []
  );
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const event = data.body.competition.disciplines[0].events[0];
  const eCompetitionId = data.body.competition.id;
  const eDisciplineId = data.body.competition.disciplines[0].id;

  const { nodes, edges } = generateNodesAndEdges(event, eCompetitionId, eDisciplineId);
  const noNodes = nodes.length / 4;
  const calculatedHeight = noNodes * 90 + 200;
  const height = calculatedHeight < 900 ? calculatedHeight : 900;

  return (
    <Box height={height}>
      <ReactFlow
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        nodes={nodes}
        edges={edges}
        draggable={false}
        elementsSelectable={false}
        fitView
      />
    </Box>
  );
};
