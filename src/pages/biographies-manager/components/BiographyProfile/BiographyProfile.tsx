import { Divider, List, Typography, useColorScheme } from '@mui/material';
import { t } from 'i18next';
import get from 'lodash/get';
import { Link as RouteLink } from 'react-router-dom';
import { EntityType, EnumType, TemplateType } from 'models';
import { useModelConfig } from 'hooks';
import { ProfileItemElement, ProfileItemText } from '../../../profiles';
import { EnumTemplate, FieldTemplate } from 'components';

export const BiographyProfile = (props: { data: any; type: EntityType }) => {
  const { mode } = useColorScheme();
  const { parseEntityType, getConfig } = useModelConfig();

  if (
    ![
      EntityType.PersonBiography,
      EntityType.HorseBiography,
      EntityType.TeamBiography,
      EntityType.NocBiography,
    ].includes(props.type)
  ) {
    return null;
  }

  const config = getConfig(parseEntityType(props.type));

  return (
    <>
      <Divider variant="fullWidth" />
      <List>
        <ProfileItemElement
          value={t('general.sensitive-info')}
          element={
            <FieldTemplate
              value={get(props.data, 'sensitiveInfo')}
              withText={true}
              type={TemplateType.SensitiveInfo}
            />
          }
        />
        {props.type === EntityType.PersonBiography && get(props.data, 'type') && (
          <ProfileItemElement
            value={t('common.role')}
            element={
              <EnumTemplate
                type={EnumType.PersonType}
                value={get(props.data, 'type')}
                withText={true}
              />
            }
          />
        )}
        {get(props.data, 'status') && (
          <ProfileItemElement
            value={t('common.status')}
            element={
              <EnumTemplate
                type={EnumType.BioStatus}
                value={get(props.data, 'status')}
                withText={true}
              />
            }
          />
        )}
        <ProfileItemText
          value={t('general.accreditationId')}
          title={get(props.data, 'accreditationId')}
        />
        {get(props.data, 'accreditationStatus') && (
          <ProfileItemElement
            value="Accreditation"
            element={
              <EnumTemplate
                type={EnumType.AccreditationStatus}
                value={get(props.data, 'accreditationStatus')}
                withText={true}
              />
            }
          />
        )}
        <ProfileItemElement
          value={t('general.linked')}
          element={
            <FieldTemplate
              type={TemplateType.Boolean}
              value={get(props.data, 'innerId') != undefined}
              withText={true}
            />
          }
        />
        {get(props.data, 'innerId') && (
          <ProfileItemElement
            element={
              <Typography
                variant="body1"
                component={RouteLink}
                to={`${config.path}/${get(props.data, 'innerId')}`}
                title={`Click to navigate to the linked ${config.display}`}
                target="_blank"
                rel="noreferrer"
                sx={{ color: mode === 'dark' ? 'white' : 'black' }}
              >
                {`Linked ${config.display}`}
              </Typography>
            }
          />
        )}
      </List>
    </>
  );
};
