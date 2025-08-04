import orderBy from 'lodash/orderBy';
import type { Participant, PhaseBrackets } from 'types/explorer';
import { Edge } from '@xyflow/react';

export const getGap = (phaseIndex: number): number => {
  switch (phaseIndex) {
    case 0:
      return 50;
    case 1:
      return 100;
    case 2:
      return 200;
    case 3:
      return 300;
    case 4:
      return 400;
    case 5:
      return 500;
    case 6:
      return 600;
    default:
      return phaseIndex * 100;
  }
};

export const getYOffsetInitial = (phaseIndex: number): number => {
  switch (phaseIndex) {
    case 0:
      return 0;
    case 1:
      return 25;
    case 2:
      return 75;
    case 3:
      return 175;
    case 4:
      return 175;
    case 5:
      return 500;
    default:
      return 25 + phaseIndex * 50;
  }
};

export const isFinalPhase = (phase: any): boolean => {
  return (
    phase.round === 'RTYP$REPF' ||
    phase.round === 'RTYP$BF' ||
    phase.round === 'RTYP$F' ||
    phase.round?.includes('FINAL')
  );
};

export const orderCompetitors = (structure: PhaseBrackets, referencePhaseId: string): any[] => {
  const mapData = structure.competitors.map((competitor: any) => {
    const participantId = competitor.participantId;
    const edgeMap = structure.mappings.find(
      (map: Participant) =>
        map.phaseId === referencePhaseId &&
        [map.opponentId1, map.opponentId2].includes(participantId)
    );

    return { ...competitor, mapOrder: edgeMap?.order ?? competitor.order };
  });

  return orderBy(mapData, 'mapOrder');
};

export const getPhaseCompetitorStructure = (phase: any, mappings: Participant[]): PhaseBrackets => {
  const result: PhaseBrackets = {
    mappings,
    competitors: [],
  };

  const phaseId = phase.id;
  const orderedUnits = orderBy(phase.units, 'order');

  orderedUnits.forEach((unit: any) => {
    const competitors = unit.teams ?? unit.athletes;
    if (!competitors || competitors.length < 2) return;

    result.mappings.push({
      phaseId,
      opponentId1: competitors[0].participantId,
      opponentId2: competitors[1].participantId,
      order: unit.order,
    });

    competitors.forEach((competitor: any) => {
      result.competitors.push({ ...competitor, unitId: unit.id, uniOrder: unit.order, unit });
    });
  });

  return result;
};

export const getCompetitorEdges = (
  structure: PhaseBrackets,
  competitor: any,
  currentPhaseId: string,
  previousPhaseIds: string[]
): Edge[] => {
  if (previousPhaseIds.length === 0) return [];

  const edges: Edge[] = [];
  const participantId = competitor.participantId;
  const nodeId = `${participantId}-${currentPhaseId}`;

  const result = previousPhaseIds
    .map((phaseId) => ({
      previousPhaseId: phaseId,
      edgeMap: structure.mappings.find(
        (map: Participant) =>
          map.phaseId === phaseId && [map.opponentId1, map.opponentId2].includes(participantId)
      ),
    }))
    .find((entry) => entry.edgeMap !== undefined);

  if (result?.edgeMap == null) return edges;

  const { previousPhaseId, edgeMap } = result;

  edges.push({
    id: `e-${edgeMap.opponentId1}-${previousPhaseId}-${nodeId}`,
    source: `${edgeMap.opponentId1}-${previousPhaseId}`,
    target: nodeId,
    type: 'step',
  });
  edges.push({
    id: `e-${edgeMap.opponentId2}-${previousPhaseId}-${nodeId}`,
    source: `${edgeMap.opponentId2}-${previousPhaseId}`,
    target: nodeId,
    type: 'step',
  });

  return edges;
};

export const mergePhaseMappings = (
  existingMappings: Participant[],
  newMappings: Participant[]
): Participant[] => {
  const mergedMap = new Map<string, Participant>();

  [...existingMappings, ...newMappings].forEach((mapping) => {
    const key = `${mapping.phaseId}-${mapping.opponentId1}-${mapping.opponentId2}-${mapping.order}`;

    if (!mergedMap.has(key)) {
      mergedMap.set(key, mapping);
    }
  });

  return Array.from(mergedMap.values());
};
