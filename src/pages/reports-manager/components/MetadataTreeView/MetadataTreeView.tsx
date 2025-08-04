import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { EnumType, IEnumProps, useEnums } from 'models';
import { CustomTreeItem, MainCard } from 'components';
import { extractAllCodes } from '../../utils/metadata-treeview';
import { renderSections } from './utils';

type Props = {
  data: any;
  onSelect: (ids: string | null) => void;
};

export const MetadataTreeView = ({ data, onSelect }: Props) => {
  const { getEnumValues } = useEnums();
  const codes = extractAllCodes(data);
  const [selectedItems, setSelectedItems] = useState<string | null>(null);

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, ids: string | null) => {
    setSelectedItems(ids);
    onSelect(ids);
  };

  return (
    <MainCard size="small" divider={false} content={false} border={false}>
      <SimpleTreeView
        selectedItems={selectedItems}
        onSelectedItemsChange={handleSelectedItemsChange}
        expandedItems={codes}
        //onExpandedItemsChange={handleExpandedItemsChange}
      >
        {getEnumValues(EnumType.SectionType).map((sectionType: IEnumProps) => {
          const currentSections =
            data.sections?.filter(
              (x: any) => x.section.toUpperCase() === sectionType.code.toUpperCase() && !x.inactive
            ) ?? [];
          const Icon = sectionType.icon;

          return (
            <CustomTreeItem
              key={sectionType.code}
              itemId={sectionType.code}
              label={
                <Stack alignItems={'center'} direction={'row'} spacing={1}>
                  {Icon && <Icon fontSize="small" />}
                  <Typography>{sectionType.text}</Typography>
                </Stack>
              }
            >
              {renderSections(currentSections)}
            </CustomTreeItem>
          );
        })}
      </SimpleTreeView>
    </MainCard>
  );
};
