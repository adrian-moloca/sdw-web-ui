import get from 'lodash/get';
import Facebook from '@mui/icons-material/Facebook';
import X from '@mui/icons-material/X';
import Instagram from '@mui/icons-material/Instagram';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import BookOutlined from '@mui/icons-material/BookOutlined';
import { FieldTemplate } from 'components';
import { TemplateType } from 'models';
import { ProfileItemElement } from '../ProfileItemElement';

type Props = {
  data: any;
};

export const BiographySocialMediaBlock = ({ data }: Props) => {
  return (
    <>
      {get(data, 'socialNetworks.facebook') && (
        <ProfileItemElement
          icon={Facebook}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.facebook')}
            />
          }
        />
      )}
      {get(data, 'socialNetworks.facebook_page') && (
        <ProfileItemElement
          icon={Facebook}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.facebook_page')}
            />
          }
        />
      )}
      {get(data, 'socialNetworks.twitter') && (
        <ProfileItemElement
          icon={X}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.twitter')}
            />
          }
        />
      )}
      {get(data, 'socialNetworks.instagram') && (
        <ProfileItemElement
          icon={Instagram}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.instagram')}
            />
          }
        />
      )}
      {get(data, 'socialNetworks.tiktok') && (
        <ProfileItemElement
          icon={PlayCircleOutline}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.tiktok')}
            />
          }
        />
      )}
      {get(data, 'socialNetworks.blog') && (
        <ProfileItemElement
          icon={BookOutlined}
          element={
            <FieldTemplate
              type={TemplateType.SocialMedia}
              value={get(data, 'socialNetworks.blog')}
            />
          }
        />
      )}
    </>
  );
};
