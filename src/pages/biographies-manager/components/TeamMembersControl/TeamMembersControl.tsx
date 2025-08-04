import {
  Alert,
  Badge,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { EnumTemplate } from 'components';
import { EntityType, EnumType } from 'models';
import WorkspacesTwoToneIcon from '@mui/icons-material/WorkspacesTwoTone';
import { t } from 'i18next';
import { PersonSelector } from '../PersonSelector';
import { SectionCard } from 'components/cards/SectionCard';

type Props = {
  type: EntityType;
  data: any;
};

export const TeamMembersControl = (props: Props): React.ReactElement | null => {
  const theme = useTheme();

  if (props.type != EntityType.TeamBiography) return null;
  const noMembers = props.data?.teamMembers?.length ?? 0;

  const renderTeamMembers = () => {
    if (noMembers === 0) {
      return (
        <Alert severity="info">
          {t('message.notDataAvailable').replace('{0}', t('general.members').toLowerCase())}
        </Alert>
      );
    }

    return (
      <TableContainer
        component={Box}
        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '4px' }}
      >
        <Table stickyHeader sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '1%' }} />
              <TableCell sx={{ minWidth: '160px', fontWeight: 'bold' }}>
                {t('common.name')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('common.role')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('common.status')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('general.accreditationStatus')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data?.teamMembers?.map((e: any, i: number) => (
              <TableRow key={e.id}>
                <TableCell sx={{ verticalAlign: 'baseline' }} component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'baseline' }}>{e.person.displayName}</TableCell>
                <TableCell sx={{ verticalAlign: 'baseline' }}>
                  <EnumTemplate
                    type={EnumType.PersonType}
                    value={e.person.personType}
                    withText={true}
                  />
                </TableCell>
                <TableCell sx={{ verticalAlign: 'baseline' }}>
                  <EnumTemplate type={EnumType.BioStatus} value={e.person.status} withText={true} />
                </TableCell>
                <TableCell sx={{ verticalAlign: 'baseline' }}>
                  <EnumTemplate
                    type={EnumType.AccreditationStatus}
                    value={e.person.accreditationStatus}
                    withText={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Grid size={12}>
      <SectionCard
        avatar={
          <Badge color="primary" badgeContent={noMembers} showZero>
            <WorkspacesTwoToneIcon />
          </Badge>
        }
        title={t('general.members')}
        defaultExpanded={noMembers > 0}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <PersonSelector {...props} />
          </Grid>
          <Grid size={12}>{renderTeamMembers()}</Grid>
        </Grid>
      </SectionCard>
    </Grid>
  );
};
