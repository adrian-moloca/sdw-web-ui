import { Box, Typography } from '@mui/material';

type Props = {
  rule: any;
};

export const BuildRule = ({ rule }: Props) => {
  if (rule === null) return null;

  let index = 1;
  return (
    <Box>
      <Typography
        variant="body1"
        component="div"
        gutterBottom
        dangerouslySetInnerHTML={{
          __html: `📌 <b>${rule.displayName}</b> | ${rule.description}<br/> ➜ <code>${rule.code}</code> | ${rule.type}`,
        }}
      />
      <Box sx={{ pl: 2 }}>
        {rule?.messageRedirects?.map((e: any) => (
          <Typography
            key={e.id}
            variant="body1"
            component="div"
            gutterBottom
            dangerouslySetInnerHTML={{
              __html: `${index++}. ${e.displayName}<br/> ➜ <code>${e.fromCode}</code> <br/> ⬅ <code>${e.code}</code> <br/> ⓘ ${e.type}  |${e.toLevel?.toUpperCase() ?? '-'}`,
            }}
          />
        ))}
        {rule?.movePhases?.map((e: any) => (
          <Typography
            key={e.id}
            variant="body1"
            component="div"
            gutterBottom
            dangerouslySetInnerHTML={{
              __html: `${index++}. ${e.displayName}<br/> ➜ <code>${e.code}</code> <br/> ⓘ ${e.type ?? '-'} | ${e.level?.toUpperCase()}`,
            }}
          />
        ))}
        {rule?.moveSubunits?.map((e: any) => (
          <Typography
            key={e.id}
            variant="body1"
            component="div"
            gutterBottom
            dangerouslySetInnerHTML={{
              __html: `${index++}. ${e.displayName}<br/> ⓘ ${e.code} | ${e.type}`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
