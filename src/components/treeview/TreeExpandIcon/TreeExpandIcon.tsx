import * as React from 'react';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';

export function TreeExpandIcon(props: React.PropsWithoutRef<typeof AddBoxTwoToneIcon>) {
  return <AddBoxTwoToneIcon {...props} sx={{ opacity: 0.8 }} />;
}
