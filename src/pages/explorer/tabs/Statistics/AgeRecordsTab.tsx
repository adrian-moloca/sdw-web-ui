import { TabContext, TabList, TabPanel } from '@mui/lab';
import { RadioTab } from 'components';
import { useState } from 'react';
import { AgeRecordsViewer } from './AgeRecordsViewer';
import { t } from 'i18next';
import { useTheme } from '@mui/material';

export const AgeRecordsTab: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState('ASC');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        variant="fullWidth"
        sx={{ mt: 1, '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
        indicatorColor={'secondary'}
      >
        <RadioTab
          fontSize={theme.typography.body1.fontSize}
          value={'ASC'}
          label={t('general.youngest-athletes')}
          disableRipple
        />
        <RadioTab
          fontSize={theme.typography.body1.fontSize}
          value={'DESC'}
          label={t('general.oldest-athletes')}
          disableRipple
        />
      </TabList>
      <TabPanel value={'ASC'} sx={{ px: 0 }}>
        <AgeRecordsViewer direction={'ASC'} />
      </TabPanel>
      <TabPanel value={'DESC'} sx={{ px: 0 }}>
        <AgeRecordsViewer direction={'DESC'} />
      </TabPanel>
    </TabContext>
  );
};
