import { MetadataModel, TemplateType } from 'models';
import { Divider, Typography, useMediaQuery } from '@mui/material';
import get from 'lodash/get';
import { t } from 'i18next';
import { isJson } from '../../../_helpers';
import { FieldTemplate } from '../../templates';

type BlockProps = {
  data: any;
  field: string;
  metadata?: { [key: string]: MetadataModel };
  title?: string;
};

export const BiographyBlock = (props: BlockProps) => {
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const value = get(props.data, props.field);

  if (!value) return null;

  const title =
    props.title ??
    (props.metadata ? props.metadata[props.field]?.displayName : t('general.biography'));

  if (isJson(value))
    return (
      <>
        <Typography variant={matchDownSM ? 'h5' : 'h4'}>{title}</Typography>
        <FieldTemplate type={TemplateType.Json} value={value} />
        {!matchDownSM && <Divider sx={{ marginTop: 1, marginBottom: 2 }} />}
      </>
    );

  return (
    <>
      <Typography variant={matchDownSM ? 'h5' : 'h4'}>{title}</Typography>
      <Typography variant={'body1'} component={'div'} dangerouslySetInnerHTML={{ __html: value }} />
      {!matchDownSM && <Divider sx={{ marginTop: 1, marginBottom: 2 }} />}
    </>
  );
};
