import { useEffect, useState } from 'react';
import { Node, Edge, ReactFlow, Controls } from '@xyflow/react';
import { MainCard } from 'components';
import { Box, useTheme } from '@mui/material';
import { BracketCompetitorNode, MatchNode, StageTitleNode } from './StyledNode';
import { BracketData } from './type';

type Props = {
  data: BracketData;
};

const nodeTypes = {
  competitorNode: BracketCompetitorNode,
  matchNode: MatchNode,
  stageTitle: StageTitleNode,
};

// Function to calculate the dynamic height of a match node
const calculateMatchNodeHeight = (numCompetitors: number) => {
  const titleAreaHeight = 30; // Approx height for title and its margin
  const competitorRowHeight = 35; // Approx height for each competitor row including padding/margin
  const nodeVerticalPadding = 16; // 2 * theme.spacing(1) for StyledMatchNode padding

  return titleAreaHeight + numCompetitors * competitorRowHeight + nodeVerticalPadding;
};
export const EventBracketsFlow = ({ data }: Props) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const theme = useTheme();
  useEffect(() => {
    if (data) {
      buildFlow(data.data);
    }
  }, [data]);

  // Function to process the JSON data and build nodes and edges
  const buildFlow = (data: any[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const roundSpacing = 350; // Horizontal spacing between stages
    const yMarginBetweenMatches = 20; // Vertical spacing between match nodes within a stage

    const sortedData = data?.[0].code.startsWith('FNL') ? [...data].reverse() : [...data];
    let previousMatchNodes: Node[] = [];

    // Define padding for the group nodes
    const groupPadding = 20;
    const matchNodeWidth = 250; // Fixed width for match nodes
    const groupWidth = matchNodeWidth + groupPadding * 2; // Group width includes padding
    const titleHeight = 30; // Approximated height for the title node

    // Calculate the maximum height needed for any single match node across all stages
    let maxCalculatedMatchHeight = 0;
    sortedData.forEach((stage) => {
      stage.rounds.forEach((round: { competitors: string | any[] }) => {
        const currentMatchHeight = calculateMatchNodeHeight(round.competitors.length);
        if (currentMatchHeight > maxCalculatedMatchHeight) {
          maxCalculatedMatchHeight = currentMatchHeight;
        }
      });
    });

    // Calculate total height of the bracket to center it vertically
    // This needs to consider the maximum number of matches in any round
    const maxMatchesInAnyRound = Math.max(...sortedData.map((stage) => stage.rounds.length));
    const estimatedMaxGroupHeight =
      maxMatchesInAnyRound * maxCalculatedMatchHeight +
      (maxMatchesInAnyRound - 1) * yMarginBetweenMatches +
      titleHeight +
      groupPadding * 2;
    const totalBracketHeight = estimatedMaxGroupHeight; // Use this to center the whole flow

    sortedData.forEach((stage, stageIndex) => {
      const xPos = stageIndex * roundSpacing;
      const currentMatchNodes: Node[] = [];
      const numMatchesInRound = stage.rounds.length;

      // Calculate the actual height needed for the current group based on its matches
      let currentGroupContentHeight = 0;
      stage.rounds.forEach((round: { competitors: string | any[] }) => {
        currentGroupContentHeight += calculateMatchNodeHeight(round.competitors.length);
      });
      currentGroupContentHeight += (numMatchesInRound - 1) * yMarginBetweenMatches; // Add margins between matches

      const currentGroupHeight = currentGroupContentHeight + titleHeight + groupPadding * 2;

      const groupYPos = (totalBracketHeight - currentGroupHeight) / 2;
      const stageGroupId = `group-${stage.code}`;
      newNodes.push({
        id: stageGroupId,
        type: 'group',
        position: { x: xPos, y: groupYPos },
        data: { label: stage.title },
        draggable: false,
        style: {
          width: groupWidth, // groupWidth is already calculated based on matchNodeWidth + padding
          height: currentGroupHeight,
          borderRadius: '8px',
          border: '1px solid #ddd',
        },
      });

      // Add a title node for the stage, positioned inside the group at the top
      newNodes.push({
        id: `title-${stage.code}`,
        type: 'default',
        position: { x: groupPadding, y: 0 }, // Positioned with top and left padding
        data: { label: stage.title },
        draggable: false,
        selectable: false,
        parentId: stageGroupId,
        style: {
          width: matchNodeWidth, // Title width matches the match node width
          fontWeight: '500',
          textAlign: 'left',
          fontSize: theme.typography.body1.fontSize,
          fontFamily: theme.typography.body1.fontFamily,
          background: 'none',
          border: 'none',
        },
      });

      let currentYOffsetForMatches = groupPadding + titleHeight; // Starting Y for the first match node

      stage.rounds.forEach(
        (round: { unitId: any; competitors: string | any[] }, roundIndex: number) => {
          const matchId = `match-${stage.code}-${round.unitId}`;
          const currentMatchNodeHeight = calculateMatchNodeHeight(round.competitors.length);

          const matchNode: Node = {
            id: matchId,
            type: 'matchNode',
            position: { x: groupPadding, y: currentYOffsetForMatches }, // Positioned with left padding
            data: round as any,
            style: { width: matchNodeWidth, height: currentMatchNodeHeight }, // Set dynamic height
            parentId: stageGroupId,
          };
          newNodes.push(matchNode);
          currentMatchNodes.push(matchNode);

          // Update offset for the next match node
          currentYOffsetForMatches += currentMatchNodeHeight + yMarginBetweenMatches;

          // Connect to previous round winners
          if (stageIndex > 0) {
            const prevNode1 = previousMatchNodes[roundIndex * 2];
            const prevNode2 = previousMatchNodes[roundIndex * 2 + 1];

            if (prevNode1) {
              newEdges.push({
                id: `e-${prevNode1.id}-to-${matchNode.id}`,
                source: prevNode1.id,
                target: matchNode.id,
                type: 'smoothstep',
                animated: true,
              });
            }
            if (prevNode2) {
              newEdges.push({
                id: `e-${prevNode2.id}-to-${matchNode.id}`,
                source: prevNode2.id,
                target: matchNode.id,
                type: 'smoothstep',
                animated: true,
              });
            }
          }
        }
      );
      previousMatchNodes = currentMatchNodes;
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };
  return (
    <MainCard>
      <Box height={900}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          draggable={false}
          elementsSelectable={true}
          fitView
        >
          <Controls />
        </ReactFlow>
      </Box>
    </MainCard>
  );
};
