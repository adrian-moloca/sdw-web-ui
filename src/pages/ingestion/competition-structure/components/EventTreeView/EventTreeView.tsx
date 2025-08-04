import { Button, useTheme } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { extractAllCodes } from '../../utils/structure';
import { renderEvents } from '../../utils/treeview';
import { MainCard } from 'components/cards/MainCard';

type Props = {
  data: any;
  expandedItems: string[];
  onExpandChange: (expandedItems: string[]) => void;
};

export const EventTreeView = ({ data, expandedItems, onExpandChange }: Props) => {
  const theme = useTheme();
  const codes = extractAllCodes(data);
  const handleExpandedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    onExpandChange(itemIds);
  };
  const handleExpandClick = () => {
    if (expandedItems.length === 0) {
      onExpandChange(codes);
    } else onExpandChange([]);
  };
  return (
    <MainCard
      size="small"
      divider={false}
      content={false}
      border={false}
      title={
        <Button size="small" variant="outlined" color="secondary" onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      }
    >
      <SimpleTreeView
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
        id="code"
      >
        {data.events && data.events.length > 0 && renderEvents(data.events, theme)}
      </SimpleTreeView>
    </MainCard>
  );
};
