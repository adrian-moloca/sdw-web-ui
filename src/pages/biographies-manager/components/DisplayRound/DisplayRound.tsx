import {
  Avatar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import get from 'lodash/get';
import Grid from '@mui/material/Grid';
import { CountryChip, MainCard } from 'components';
import { apiConfig } from 'config/app.config';
import LandscapeTwoToneIcon from '@mui/icons-material/LandscapeTwoTone';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import { DisplayResult } from '../DisplayResult';

export function DisplayRound(props: Readonly<{ data: any; opponent1: any; opponent2: any }>) {
  const theme = useTheme();

  const value1 = get(props.opponent1, 'team') ?? get(props.opponent1, 'participationName');
  const value2 = get(props.opponent2, 'team') ?? get(props.opponent2, 'participationName');

  const disciplineCode = props.data.disciplineCode.split('-')[0];

  return (
    <Grid size={12}>
      <MainCard
        size="small"
        avatar={
          <Avatar
            variant="square"
            sx={{ height: '50px', width: '50px' }}
            src={apiConfig.disciplinesIconEndPoint.replace('{0}', disciplineCode)}
          />
        }
        title={props.data.competitionTitle}
        subHeader={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {props.data.competitionCategories.map((e: string) => (
              <Chip size="small" key={e} variant="filled" label={e} />
            ))}
            {props.data.competitionStartDate && (
              <Typography>{`${props.data.competitionStartDate} to ${props.data.competitionEndDate}`}</Typography>
            )}
            {!props.data.competitionStartDate && props.data.competitionYear && (
              <Typography>{props.data.competitionYear}</Typography>
            )}
            {props.data.courtType && (
              <Chip
                variant="outlined"
                icon={<LandscapeTwoToneIcon />}
                label={`${props.data.courtSurface} (${props.data.courtType})`}
                sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: '300', py: 0 }}
              />
            )}
          </Stack>
        }
        secondary={
          <Chip
            variant="outlined"
            icon={<LocationOnTwoToneIcon />}
            label={`${props.data.competitionRegion}, ${props.data.competitionCountry}`}
            sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: '300', py: 0 }}
          />
        }
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} sx={{ border: 'unset' }}>
                <span style={{ marginRight: 2 }}>{props.data.eventName}</span>
                <span>{` | ${props.data.eventGender} | `}</span>
                {props.data.eventType && props.data.eventType.indexOf('$') < 0 && (
                  <span style={{ marginRight: 4 }}>{`${props.data.eventType} | `}</span>
                )}
                <span>{props.data.round}</span>
              </TableCell>
              <TableCell sx={{ textAlign: 'right', width: '35%', border: 'unset' }}>
                {props.data.eventDate}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ textAlign: 'right', width: '40%', border: 'unset' }}>
                <Stack
                  direction={'row'}
                  spacing={1}
                  sx={
                    props.data.winnerOpponentId === props.opponent1.id
                      ? {
                          justifyContent: 'flex-end',
                          border: `1px solid ${theme.palette.success.main}`,
                          paddingRight: 0.5,
                          py: 1,
                        }
                      : props.data.winnerOpponentId === 'TIE'
                        ? {
                            justifyContent: 'flex-end',
                            border: `1px solid ${theme.palette.primary.main}`,
                            paddingRight: 0.5,
                            py: 1,
                          }
                        : {
                            justifyContent: 'flex-end',
                            border: `1px solid ${theme.palette.secondary.light}`,
                            paddingRight: 0.5,
                            py: 1,
                          }
                  }
                >
                  {props.data.winnerOpponentId === props.opponent1.id && (
                    <Chip
                      icon={<EmojiEventsTwoToneIcon />}
                      size="small"
                      color="success"
                      label="WIN"
                    />
                  )}
                  {!props.data.winnerOpponentId && (
                    <Chip size="small" color="primary" label="TIE" />
                  )}
                  <Typography>{value1}</Typography>
                  <CountryChip
                    code={get(props.opponent1, 'organisationCode')}
                    size="small"
                    hideTitle={false}
                  />
                </Stack>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  width: '20%',
                  border: 'unset',
                  fontFamily: 'Olympic Headline',
                  fontSize: '1.2rem',
                }}
              >
                <DisplayResult
                  data={props.data.result}
                  code={props.data.resultCode}
                  theme={theme}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'left', width: '40%', border: 'unset' }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={
                    props.data.winnerOpponentId === props.opponent2.id
                      ? {
                          justifyContent: 'flex-start',
                          border: `1px solid ${theme.palette.success.main}`,
                          paddingLeft: 0.5,
                          py: 1,
                        }
                      : props.data.winnerOpponentId === 'TIE'
                        ? {
                            justifyContent: 'flex-start',
                            border: `1px solid ${theme.palette.primary.main}`,
                            paddingLeft: 0.5,
                            py: 1,
                          }
                        : {
                            justifyContent: 'flex-start',
                            border: `1px solid ${theme.palette.secondary.light}`,
                            paddingLeft: 0.5,
                            py: 1,
                          }
                  }
                >
                  <CountryChip
                    code={get(props.opponent2, 'organisationCode')}
                    size="small"
                    hideTitle={false}
                  />
                  <Typography>{value2}</Typography>
                  {props.data.winnerOpponentId === props.opponent2.id && (
                    <Chip
                      icon={<EmojiEventsTwoToneIcon />}
                      size="small"
                      color="success"
                      label="WIN"
                    />
                  )}
                  {props.data.winnerOpponentId === 'TIE' && (
                    <Chip size="small" color="primary" label="TIE" />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </MainCard>
    </Grid>
  );
}
