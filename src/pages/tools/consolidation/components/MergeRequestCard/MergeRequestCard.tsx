import { Divider, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { EntityType, EnumType, TemplateType } from 'models';
import { EnumTemplate, FieldTemplate } from 'components';
import { useModelConfig } from 'hooks';

type Props = {
  data: any;
};

export const MergeRequestCard = ({ data }: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.MergeRequest);

  return (
    <Stack spacing={1} alignItems="center">
      <Typography
        variant="subtitle1"
        component={Link}
        to={`/${config.path}/${data.requestId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textAlign: 'center', lineHeight: 1.2, fontFamily: 'Olympic Headline' }}
      >
        {data.title.split(',').map((item: string, index: number) => (
          <Fragment key={index}>
            {item}
            {index < data.title.split(',').length - 1 && <br />}
          </Fragment>
        ))}
      </Typography>
      <Stack spacing={1} alignItems="center" direction="row">
        <EnumTemplate
          type={EnumType.MergeStatus}
          value={data.status}
          withText={true}
          size="small"
        />
        <Divider orientation="vertical" flexItem />
        <EnumTemplate
          type={EnumType.ConflictStatus}
          value={data.conflictStatus}
          withText={true}
          size="small"
        />
      </Stack>
      <FieldTemplate
        type={TemplateType.DateTime}
        value={data.createdTs}
        withText={true}
        size="xs"
      />
    </Stack>
  );
};
