import { MainCard } from 'components/cards/MainCard/MainCard';
import { layout } from 'themes/layout';

interface StatsCardProps {
  title: string;
  secondary?: React.ReactElement;
  subHeader?: React.ReactElement;
  children?: React.ReactElement | React.ReactElement[];
}
export const StatsCard: React.FC<StatsCardProps> = ({ title, secondary, subHeader, children }) => {
  return (
    <MainCard
      title={title}
      divider={false}
      border={true}
      fullHeight
      sx={[
        (theme) => ({
          width: '100%',
          borderRadius: layout.radius.md,
          px: theme.spacing(2),
          py: theme.spacing(2),
          textAlign: 'left',
          backgroundColor: theme.palette.grey[100],
        }),
        (theme) =>
          theme.applyStyles('dark', {
            width: '100%',
            borderRadius: layout.radius.md,
            px: theme.spacing(2),
            py: theme.spacing(2),
            textAlign: 'left',
            backgroundColor: theme.palette.grey[800],
          }),
      ]}
      subHeader={subHeader}
      secondary={secondary}
    >
      {children}
    </MainCard>
  );
};
