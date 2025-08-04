import * as React from 'react';
import DisabledByDefaultTwoToneIcon from '@mui/icons-material/DisabledByDefaultTwoTone';

export function TreeEndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultTwoToneIcon>) {
  return <DisabledByDefaultTwoToneIcon {...props} sx={{ opacity: 0.3 }} />;
}
