import '@xyflow/react/dist/style.css';
import { Alert, Box, IconButton, Paper, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import { CompetitorStats } from '../CompetitorStats';
import { CombinedFrameResultsTable } from '../FrameResultsTable';
import get from 'lodash/get';
import { CompetitorExtendedResult } from './CompetitorExtendedResult';
import { OfficialsDisplay } from '../OfficialsDisplay';
import { ScoreBracket } from './components/ScoreBracket';
import { BracketHeader } from './components/BracketHeader';

type Props = {
  roundData?: any;
  data: Array<any>;
  frames?: Array<any>;
  discipline: string;
  officials?: Array<any>;
};

export const CompetitorBrackets: React.FC<Props> = ({ roundData, data, discipline, officials }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const hasParticipants = data.some((x) => x.participants != null && x.participants.length > 0);

  if (!data)
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.competitors'))}
      </Alert>
    );

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            background: `linear-gradient(${theme.palette.primary.light},${theme.palette.primary.dark})`,
            px: 2,
            py: 3,
          }}
        >
          <BracketHeader data={roundData} />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {hasParticipants ? (
              <IconButton
                sx={{
                  p: 1,
                  height: 24,
                  width: 24,
                  color: theme.palette.common.white,
                  border: `1px solid ${theme.palette.common.white}`,
                }}
                onClick={() => setOpen(!open)}
                title={open ? t('general.hideTeamMembers') : t('general.showTeamMembers')}
                aria-label={open ? t('general.hideTeamMembers') : t('general.showTeamMembers')}
                size="small"
              >
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            ) : (
              <Box sx={{ height: 20 }} />
            )}
            <ScoreBracket data={data} open={open} discipline={discipline} />
          </Box>
        </Paper>
      </Grid>
      <Grid size={12}>
        <CompetitorStats data={data} />
      </Grid>
      {officials && officials?.length > 0 && (
        <Grid size={12}>
          <OfficialsDisplay data={{ officials }} />
        </Grid>
      )}
      <CombinedFrameResultsTable data={data} discipline={discipline} />
      {data.map((competitor, index) => (
        <CompetitorExtendedResult
          key={index}
          title={competitor.name}
          countryCode={get(competitor, 'organisation.country')}
          data={competitor}
          expandable={false}
        />
      ))}
    </Grid>
  );
};
