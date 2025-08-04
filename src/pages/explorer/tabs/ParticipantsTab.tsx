import { useState } from 'react';
import { ButtonTab } from 'components';
import type { IPanelTabProps } from 'types/views';
import { t } from 'i18next';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ParticipantsAthleteTab } from './ParticipantsAthleteTab';
import { ParticipantsTeamTab } from './ParticipantsTeamTab';
import { ParticipantsOfficialsTab } from './ParticipantsOfficialsTab';

export const ParticipantsTab = (props: IPanelTabProps) => {
  const [value, setValue] = useState('1');
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label={t('general.participants')} centered>
        <ButtonTab label={t('general.athletes')} value="1" />
        <ButtonTab label={t('general.teams')} value="2" />
        <ButtonTab label={t('general.officials')} value="3" />
      </TabList>
      <TabPanel value="1" sx={{ p: 0 }}>
        <ParticipantsAthleteTab {...props} />
      </TabPanel>
      <TabPanel value="2" sx={{ p: 0 }}>
        <ParticipantsTeamTab {...props} />
      </TabPanel>
      <TabPanel value="3" sx={{ p: 0 }}>
        <ParticipantsOfficialsTab {...props} />
      </TabPanel>
    </TabContext>
  );
};
