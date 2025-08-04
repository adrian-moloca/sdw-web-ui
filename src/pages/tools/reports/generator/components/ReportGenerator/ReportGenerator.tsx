import { Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useState } from 'react';
import { GenericLoadingPanel, MainCard } from 'components';
import { decodeTittle, decodeSubtitle, validSubCode, validKey } from '../../utils';
import { usePersistedState } from 'hooks';
import appConfig from 'config/app.config';
import {
  ReportBulkGenerator,
  ReportMetadataViewer,
  ReportSelector,
  ReportTreeItem,
  ReportViewer,
} from 'pages/tools/reports/generator/components';

type Props = {
  data: any;
  isLoading: boolean;
};

export const ReportGenerator = (props: Props) => {
  const [expandedItems, setExpandedItems] = usePersistedState<string[]>(
    [],
    `${appConfig.forgeRockRealm}_report_expanded`
  );
  const [selectedItems, setSelectedItems] = usePersistedState<string>(
    '',
    `${appConfig.forgeRockRealm}_report_selected`
  );
  const [selectedText, setSelectedText] = useState<string>('');

  const handleExpandedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    setExpandedItems(itemIds);
  };

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemIds: string | null
  ) => {
    setSelectedItems(itemIds);
    if (event) {
      setSelectedText((event.target as HTMLElement).innerText);
    }
  };

  if (props.isLoading) {
    return <GenericLoadingPanel loading={props.isLoading} />;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <MainCard
          title={props.data.title}
          size="small"
          divider={false}
          headerSX={{ paddingBottom: '0!important' }}
        >
          <SimpleTreeView
            aria-label="reports navigator"
            expandedItems={expandedItems}
            selectedItems={selectedItems}
            onExpandedItemsChange={handleExpandedItemsChange}
            onSelectedItemsChange={handleSelectedItemsChange}
          >
            {props.data.options
              ?.filter((e: any) => e.key !== 'ESL' && e.key !== 'H2H')
              .map((e: any) => (
                <ReportTreeItem key={e.key} data={e} />
              ))}
          </SimpleTreeView>
        </MainCard>
      </Grid>
      <Grid size={8}>
        <MainCard
          boxShadow={true}
          border={true}
          headerSX={{ backgroundColor: 'rgb(248, 250, 252)' }}
          title={decodeTittle(selectedItems, props.data.options)}
          subtitle={decodeSubtitle(selectedItems, selectedText)}
          divider={true}
          content={true}
        >
          {validSubCode(selectedItems) ? (
            <Grid container spacing={1}>
              <Grid size={12}>
                <ReportSelector id={selectedItems} />
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12}>
                <ReportViewer id={selectedItems} />
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12}>
                <ReportMetadataViewer id={selectedItems} />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {validKey(selectedItems) && <ReportBulkGenerator id={selectedItems} />}
            </Grid>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
};
