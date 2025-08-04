import { TableCell, TableRow } from '@mui/material';

export const DisplayWinField = (props: { data: any; opponent1: any; opponent2: any }) => {
  const totalRounds = props.data?.length ?? 0;

  const totalWins1 =
    props.data.filter((x: any) => x.winnerOpponentId === props.opponent1.id)?.length ?? 0;
  const totalWins1Percent = totalRounds > 0 ? Math.round((totalWins1 / totalRounds) * 100) : 0;

  const totalWins2 =
    props.data.filter((x: any) => x.winnerOpponentId === props.opponent2.id)?.length ?? 0;
  const totalWins2Percent = totalRounds > 0 ? Math.round((totalWins2 / totalRounds) * 100) : 0;

  return (
    <TableRow>
      <TableCell
        sx={{ textAlign: 'right', width: '35%' }}
      >{`${totalWins1Percent}% (${totalWins1}/${totalRounds})`}</TableCell>
      <TableCell
        sx={{
          textAlign: 'center',
          width: '30%',
          fontFamily: 'Olympic Headline',
          fontSize: '1.2rem',
        }}
      >
        {'Total Wins'}
      </TableCell>
      <TableCell
        sx={{ textAlign: 'left', width: '35%' }}
      >{`${totalWins2Percent}% (${totalWins2}/${totalRounds})`}</TableCell>
    </TableRow>
  );
};
