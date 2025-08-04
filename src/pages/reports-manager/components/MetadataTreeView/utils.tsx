import { Stack, Typography } from '@mui/material';
import { CustomTreeItem, EnumTemplate } from 'components';
import { EnumType } from 'models';

const renderBlocks = (blocks: any[]) => {
  return blocks.map((item) => (
    <CustomTreeItem
      key={item.id}
      itemId={item.id}
      label={
        <Stack alignItems="left" direction="row" spacing={1}>
          <EnumTemplate value={item.type} type={EnumType.BlockType} withText={true} />
        </Stack>
      }
    />
  ));
};

const renderTitle = (data: any) => {
  if (data.dataSource?.displayName) {
    return (
      <Stack direction="row" alignItems="center">
        <EnumTemplate value={data.type} type={EnumType.ContentType} withText={true} />
        <Typography variant="body1" fontWeight="bold">
          {data.dataSource?.displayName}
        </Typography>
      </Stack>
    );
  }

  return <EnumTemplate value={data.type} type={EnumType.ContentType} withText={true} />;
};

export const renderSections = (events: any[]) => {
  return events.map((event) => (
    <CustomTreeItem key={event.id} itemId={event.id} label={renderTitle(event)}>
      {event.blocks && event.blocks.length > 0 && renderBlocks(event.blocks)}
    </CustomTreeItem>
  ));
};
