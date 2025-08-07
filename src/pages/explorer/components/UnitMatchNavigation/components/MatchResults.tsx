import { Box, Grid, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MatchCard } from './MatchCard';
import React, { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { competitionUnitIdAtom } from '../utils';

interface Props {
  data: any[];
}

/**
 * Displays a paginated list of match results as cards, with responsive layout and navigation controls.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {Array<Match>} props.data - The array of match data to display.
 *
 * @remarks
 * - Uses Material-UI's Grid for layout and responsive breakpoints to determine the number of items per page.
 * - Automatically selects the match based on the URL parameter or defaults to the first match.
 * - Provides pagination controls to navigate between pages of matches.
 * - Highlights the selected match card.
 *
 * @example
 * ```tsx
 * <MatchResults data={matchesArray} />
 * ```
 */
export const MatchResults: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const [unitId, setUnit] = useAtom(competitionUnitIdAtom);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = React.useMemo(() => {
    if (isLargeScreen) return 2;
    if (isMediumScreen) return 2;
    if (isSmallScreen) return 1;
    return 1;
  }, [isLargeScreen, isMediumScreen, isSmallScreen]);
  const [currentPage, setCurrentPage] = useState(1);

  let selectedMatchId = unitId;
  if (!selectedMatchId && data.length > 0) {
    selectedMatchId = data[0].id;
  }
  useEffect(() => {
    if (selectedMatchId && data.length > 0 && itemsPerPage > 0) {
      const matchIndex = data.findIndex((match) => match.id === selectedMatchId);
      if (matchIndex !== -1) {
        const pageForSelectedMatch = Math.floor(matchIndex / itemsPerPage) + 1;
        if (pageForSelectedMatch !== currentPage) {
          setCurrentPage(pageForSelectedMatch);
        }
      } else setCurrentPage(1);
    }
    const newTotalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (currentPage === 0 && newTotalPages > 0) {
      setCurrentPage(1);
    } else if (newTotalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedMatchId, itemsPerPage, data.length, unitId]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMatches = data.slice(startIndex, endIndex);
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };
  const showPagination = totalPages > 1;
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;
  return (
    <Grid
      container
      size={12}
      sx={{
        px: isSmallScreen ? theme.spacing(2) : theme.spacing(6),
        pt: isSmallScreen ? theme.spacing(2) : theme.spacing(6),
        pb: isSmallScreen ? theme.spacing(0) : theme.spacing(6),
      }}
    >
      <Grid size={12}>
        <Stack
          direction={isSmallScreen ? 'column' : 'row'}
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          {displayedMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isSelected={match.id === selectedMatchId}
              onClick={(id) => setUnit(id)}
            />
          ))}
        </Stack>
      </Grid>
      {showPagination && (
        <Grid
          size={12}
          spacing={2}
          display={'flex'}
          flexDirection="row"
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography variant="body2">{`Page ${currentPage} of ${totalPages}`}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <IconButton size="small" onClick={handlePrevPage} disabled={isPrevDisabled}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleNextPage} disabled={isNextDisabled}>
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};
