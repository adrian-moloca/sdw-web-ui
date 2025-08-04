import * as React from 'react';
import IndeterminateCheckBoxTwoToneIcon from '@mui/icons-material/IndeterminateCheckBoxTwoTone';

export function TreeCollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxTwoToneIcon>
) {
  return <IndeterminateCheckBoxTwoToneIcon {...props} sx={{ opacity: 0.8 }} />;
}
