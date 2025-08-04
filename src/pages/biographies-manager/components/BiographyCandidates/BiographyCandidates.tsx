import { useState } from 'react';
import { useModelConfig } from 'hooks';
import { Avatar, Box, Button, Typography, useTheme } from '@mui/material';
import { MainCard } from 'components';
import { t } from 'i18next';
import { AthleteSelector } from '../AthleteSelector';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { EntityType } from 'models';
import { CreateProfile as HorseCreateProfile } from 'pages/profiles/HorseProfile/components';
import { CreateProfile as PersonCreateProfile } from 'pages/profiles/PersonProfile/components';
import { CreateProfile as TeamCreateProfile } from 'pages/profiles/TeamProfile/components';

type Props = {
  type: EntityType;
  candidateType: EntityType;
  disciplines: any;
  slot: 'link' | 'create';
  onCreate: (dataItem: any) => void;
  onSelect: (dataItem: any[]) => void;
};

export const BiographyCandidates = (props: Props) => {
  const { type, candidateType, disciplines, slot, onSelect } = props;
  const { getConfig } = useModelConfig();
  const theme = useTheme();
  const config = getConfig(candidateType);

  const [elements, setElements] = useState<Array<any>>([]);

  if (slot === 'link') {
    return (
      <MainCard
        size="medium"
        avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>2A</Avatar>}
        title={`Select a ${config.display}`}
        divider={false}
        border={false}
        subtitle={t('message.please-select-1-or-more').replace('{0}', config.display)}
      >
        <AthleteSelector
          type={candidateType}
          disciplines={disciplines}
          onSelect={(value: any) =>
            setElements(
              orderBy(
                uniqBy([...elements, ...value], (x) => x.id),
                config.displayAccessor
              )
            )
          }
        />
        <Box sx={{ p: 2 }}>
          {elements.map((item: any) => (
            <Typography key={item.id}>{` • ${item[config.displayAccessor]}`}</Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Button
            disableElevation
            type="submit"
            onClick={() => onSelect(elements)}
            color="primary"
            variant="outlined"
            startIcon={<SaveOutlined />}
            disabled={elements.length === 0}
          >
            {t('actions.buttonSave')}
          </Button>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard
      size="medium"
      avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>2B</Avatar>}
      title={`Create a New ${config.display}`}
      divider={false}
      border={false}
      subtitle={t('message.fill-up-the-minimum-info-to-create').replace('{0}', config.display)}
    >
      <>
        {type === EntityType.TeamBiography && <TeamCreateProfile {...props} />}
        {type === EntityType.PersonBiography && <PersonCreateProfile {...props} />}
        {type === EntityType.HorseBiography && <HorseCreateProfile {...props} />}
      </>
    </MainCard>
  );
};
