import React from 'react';
import { Chip } from '@mui/material';
import WbSunny from '@mui/icons-material/WbSunny';
import AcUnit from '@mui/icons-material/AcUnit';

type Props = { data: any };

const EditionChipBase = (props: Props): React.ReactElement => {
  if (!props.data) return <></>;

  if (props.data?.type === 'summer')
    return (
      <Chip
        icon={<WbSunny fontSize="small" />}
        label={props.data?.code}
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: 16 }}
      />
    );

  return (
    <Chip
      icon={<AcUnit fontSize="small" />}
      label={props.data?.code}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: 16 }}
    />
  );
};

const editionChipAreEqual = (prev: Props, next: Props) => {
  return prev.data.type === next.data.type && prev.data.code === next.data.code;
};

export const EditionChip = React.memo(EditionChipBase, editionChipAreEqual);
