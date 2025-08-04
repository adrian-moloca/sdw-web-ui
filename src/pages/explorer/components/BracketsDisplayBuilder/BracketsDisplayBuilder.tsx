import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Node, Edge, Position } from '@xyflow/react';
import groupBy from 'lodash/groupBy';
import appConfig from 'config/app.config';
import type { IParameter } from 'types/views';
import type { Participant } from 'types/explorer';
import useApiService from 'hooks/useApiService';
import { ErrorPanel, GenericLoadingPanel, MainCard } from 'components';
import {
  getGap,
  getPhaseCompetitorStructure,
  getYOffsetInitial,
  getCompetitorEdges,
  isFinalPhase,
  orderCompetitors,
  mergePhaseMappings,
} from '../../utils/brackets';
import { ROUNDS } from 'constants/explorer';
import { BracketsFlow } from '../BracketsFlow';
import { CompetitorNode } from '../CompetitorNode';
import { PhaseNode } from '../PhaseNode';
import { UnitNode } from '../UnitNode';
import { useTheme } from '@mui/material';

type Props = {
  parameter: IParameter;
  discipline: string;
};

export const BracketsDisplayBuilder = ({ discipline, parameter }: Props) => {
  const apiService = useApiService();
  const url = `${appConfig.apiEndPoint}${appConfig.EVENT_EXTENDED.replace('{0}', parameter.id ?? '')}`;
  const theme = useTheme();
  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  const generateNodesAndEdges = useCallback((data: any, discipline: string) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let initialCompetitors = 0;
    const mappings: Participant[] = [];
    const previousPhaseIds: string[] = [];
    let xOffset = 0;

    data.forEach((stage: any) => {
      if (!stage.phases || stage.phases.length == 0) return;

      const referencePhaseId = stage.phases[0].id;
      const lastPhaseId = stage.phases[stage.phases.length - 1].id;
      let phaseIndex = 0;

      stage.phases.forEach((phase: any) => {
        const phaseId = phase.id;
        let yOffset = getYOffsetInitial(phaseIndex);
        const yCompetitorGap = getGap(phaseIndex);
        const phaseStructure = getPhaseCompetitorStructure(phase, mappings);

        if (phaseStructure.competitors.length == 0) return;

        if (phaseIndex === 0) {
          initialCompetitors = phaseStructure.competitors.length;
        }

        phaseIndex++;
        nodes.push({
          id: phaseId,
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
          width: 300,
          data: { label: <PhaseNode data={phase} /> },
          position: { x: xOffset, y: 0 },
          style: { borderWidth: 0, padding: 0 },
        });
        yOffset += 40;

        const finalPhase = isFinalPhase(phase) || phaseId == lastPhaseId;
        if (finalPhase) {
          const groupedUnit = groupBy(phaseStructure.competitors, 'unitId');

          Object.keys(groupedUnit).forEach((group: any) => {
            const competitors = groupedUnit[group];
            nodes.push({
              id: group,
              targetPosition: Position.Left,
              sourcePosition: Position.Right,
              width: 400,
              data: { label: <UnitNode data={competitors[0].unit} /> },
              position: { x: xOffset, y: yOffset - 35 },
              style: { borderColor: theme.palette.divider, borderWidth: 0, padding: 0 },
            });
            competitors.forEach((competitor: any, competitorIndex: number) => {
              const participantId = competitor.participantId;
              const nodeId = `${participantId}-${phaseId}`;
              nodes.push({
                id: nodeId,
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
                width: 300,
                data: { label: <CompetitorNode data={competitor} discipline={discipline} /> },
                position: { x: xOffset, y: yOffset },
                style: { borderColor: theme.palette.divider, borderWidth: 1, padding: 0 },
              });
              const indexForWinner =
                competitor.frameBracket?.winner === true
                  ? competitorIndex
                  : competitorIndex == 0
                    ? 1
                    : 0;
              const indexForLoser = indexForWinner === 0 ? 1 : 0;
              if (competitor.frameBracket?.winner) {
                const winnerNodeId = `${participantId}-${phaseId}-winner`;
                const loserNodeId = `${competitors[indexForLoser]?.participantId}-${phaseId}`;
                const winnerOffset = indexForWinner == 0 ? 25 : -25;

                nodes.push({
                  id: winnerNodeId,
                  targetPosition: Position.Left,
                  sourcePosition: Position.Right,
                  width: 300,
                  data: { label: <CompetitorNode data={competitor} discipline={discipline} /> },
                  position: { x: xOffset + 350, y: yOffset + winnerOffset },
                  style: { borderColor: theme.palette.divider, borderWidth: 2, padding: 0 },
                });

                edges.push({
                  id: `e-${winnerNodeId}`,
                  source: nodeId,
                  target: winnerNodeId,
                  type: 'step',
                });

                edges.push({
                  id: `e-${loserNodeId}`,
                  source: loserNodeId,
                  target: winnerNodeId,
                  type: 'step',
                });
              }
              yOffset += 50;
            });
            yOffset += initialCompetitors * 10 + 10;
          });
          phaseStructure.competitors.forEach((competitor) =>
            getCompetitorEdges(phaseStructure, competitor, phaseId, previousPhaseIds).forEach(
              (edge: any) => edges.push(edge)
            )
          );
        } else {
          orderCompetitors(phaseStructure, referencePhaseId).forEach((competitor: any) => {
            const participantId = competitor.participantId;
            const nodeId = `${participantId}-${phaseId}`;

            nodes.push({
              id: nodeId,
              targetPosition: Position.Left,
              sourcePosition: Position.Right,
              width: 300,
              data: { label: <CompetitorNode data={competitor} discipline={discipline} /> },
              position: { x: xOffset, y: yOffset },
              style: { borderColor: theme.palette.divider, borderWidth: 1, padding: 0 },
            });

            yOffset += finalPhase ? 50 : yCompetitorGap;
            getCompetitorEdges(phaseStructure, competitor, phaseId, previousPhaseIds).forEach(
              (edge: any) => edges.push(edge)
            );
          });
        }
        mergePhaseMappings(mappings, phaseStructure.mappings);
        previousPhaseIds.unshift(phaseId);
        xOffset += 350;
      });
    });

    return { nodes, edges };
  }, []);

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const event = data.body.competition.disciplines[0].events[0];
  const stages = event.stages.filter((x: any) => x.type === ROUNDS.BRACKETS_TYPE);
  const { nodes, edges } = generateNodesAndEdges(stages, discipline);

  return (
    <MainCard>
      <BracketsFlow nodes={nodes} edges={edges} />
    </MainCard>
  );
};
