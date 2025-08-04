import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import {
  useGridApiContext,
  useGridSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowIdsSelector,
} from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import get from 'lodash/get';
import React from 'react';
type Props = {
  row: any;
};
export const DetailPanelToggle: React.FC<Props> = ({ row }) => {
  const apiRef = useGridApiContext();
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const isExpanded = expandedRowIds.has(row.id);
  const hasParticipants = get(row, 'participants')?.length > 0;
  const hasFrameResults = get(row, 'frameTable') != undefined;
  const hasExtendedInformation = get(row, 'result.extensions') != undefined;
  const hasDetail =
    (hasParticipants || hasFrameResults || hasExtendedInformation) &&
    React.isValidElement(contentCache[row.id]);

  return (
    <IconButton
      size="small"
      tabIndex={-1}
      disabled={!hasDetail}
      sx={{ p: '0!important' }}
      aria-label={isExpanded ? t('actions.close') : t('actions.open')}
    >
      <ArrowDropDownIcon
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          fontSize: '20px',
          transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
        })}
      />
    </IconButton>
  );
};
