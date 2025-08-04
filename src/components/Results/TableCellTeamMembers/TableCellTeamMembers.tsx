import { Typography } from '@mui/material';
import useAppRoutes from 'hooks/useAppRoutes';
import { FieldTemplate } from 'components/templates';
import { EntityType, TemplateType } from 'models';

export const TeamMembersChip = (param: { data: any; justNames?: boolean }) => {
  const { getDetailRoute } = useAppRoutes();
  if (!param.data || param.data.length == 0) return null;
  if (param.justNames === true)
    return (
      <>
        {param.data?.map((e: any) => (
          <Typography key={e.name} variant="body1">
            {e.name}
          </Typography>
        ))}
      </>
    );
  return (
    <>
      {param.data?.map((e: any, i: number) => (
        <span key={e.id}>
          <FieldTemplate
            key={e.id}
            type={TemplateType.Route}
            value={e.name}
            title={e.name}
            route={getDetailRoute(e.type === 'HORSE' ? EntityType.Horse : EntityType.Person, e.id)}
          />
          {i < param.data.length - 1 && <span>{', '}</span>}
        </span>
      ))}
    </>
  );
};
