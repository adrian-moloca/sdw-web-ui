import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MainCard } from 'components/cards/MainCard';
import {
  EditionMode,
  IConfigProps,
  IDisplayBoxProps,
  IQueryProps,
  MetadataModel,
  QueryFilterValue,
} from 'models';
import { IParameter, IToolbarPanelProps, IViewPanelTabProps } from 'types/views';
import Grid from '@mui/material/Grid';
import { hasInfoPanel } from 'utils/views';
import { DisplayPanel, InfoPanel, ViewForm } from 'components/views';
import { t } from 'i18next';
import baseConfig from 'baseConfig';
import get from 'lodash/get';
import React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ButtonTabPrimary } from 'components/datagrid';

interface Props<T> {
  element: any;
  setup: any;
  name: string;
  dataSource?: IQueryProps;
  metadata?: { [key: string]: MetadataModel };
  config: IConfigProps;
  displayBoxes: IDisplayBoxProps[];
  tags?: Array<QueryFilterValue>;
  toolbar?: IToolbarPanelProps<T>[];
  editionMode: EditionMode;
  showEditButton: boolean;
  showDetail: boolean;
  tabs?: IViewPanelTabProps<T>[];
  subcomponent?: IViewPanelTabProps<T>;
  handleEditionMode: (mode: EditionMode) => void;
  handleShowHideDetail: () => void;
  handleOnClickEdit: () => void;
}
export const ViewLayout: React.FC<Props<any>> = ({
  element,
  setup,
  config,
  name,
  tags,
  tabs,
  subcomponent,
  toolbar,
  metadata,
  editionMode,
  showDetail,
  displayBoxes,
  showEditButton,
  dataSource,
  handleEditionMode,
  handleShowHideDetail,
  handleOnClickEdit,
}) => {
  const hasTabs = tabs?.some((tab) => !tab.condition || tab.condition(element));
  const hasSubcomponent =
    subcomponent && (!subcomponent.condition || subcomponent.condition(element));
  const hasInfo = hasInfoPanel(config, element);

  const noTabs = tabs?.filter((tab) => !tab.condition || tab.condition(element)).length ?? 0;
  const theme = useTheme();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const gridSpacing = matchDownSM ? baseConfig.gridSpacing - 1 : baseConfig.gridSpacing;

  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getParameter = (): IParameter => ({
    id: get(element, 'id') ?? '',
    display: get(element, config.displayAccessor) ?? '',
    type: config.type,
  });

  const renderMainContent = () => (
    <Grid size={12}>
      {editionMode === EditionMode.Detail ? (
        <DisplayPanel
          element={element}
          setup={setup}
          name={name}
          showDetail={showDetail}
          showEditButton={showEditButton}
          displayBoxes={displayBoxes}
          toolbar={toolbar}
          config={config}
          editionMode={editionMode}
          handleShowHideDetail={handleShowHideDetail}
          handleOnClickEdit={handleOnClickEdit}
        />
      ) : (
        <ViewForm
          element={element}
          setup={setup}
          name={name}
          tags={tags}
          metadata={metadata}
          config={config}
          dataSource={dataSource}
          editionMode={editionMode}
          handleEditionMode={handleEditionMode}
        />
      )}
    </Grid>
  );

  const renderInfoPanel = () =>
    hasInfo && (
      <Grid size={12}>
        <MainCard border={false} title={t('common.information')}>
          <InfoPanel data={element} metadata={metadata} config={config} />
        </MainCard>
      </Grid>
    );

  if (!hasSubcomponent && !hasTabs) {
    return (
      <Grid container spacing={gridSpacing}>
        {renderMainContent()}
        {renderInfoPanel()}
      </Grid>
    );
  }

  if (hasSubcomponent) {
    return (
      <Grid container spacing={gridSpacing}>
        {renderMainContent()}
        {renderInfoPanel()}
        <Grid size={12}>
          <subcomponent.component
            data={element}
            key="subCom"
            parameter={getParameter()}
            parameters={subcomponent.parameters?.map((param) => ({
              value: get(element, param.accessor),
              name: param.name,
            }))}
            readOnly={subcomponent.readOnly?.(element)}
          />
        </Grid>
      </Grid>
    );
  }

  if (noTabs === 1 && !hasInfo) {
    return (
      <Grid container spacing={gridSpacing}>
        {renderMainContent()}
        <Grid size={12}>
          {tabs
            ?.filter((tab) => !tab.condition || tab.condition(element))
            .map((tab, i) => (
              <MainCard
                key={i}
                title={tab.title}
                boxShadow
                border={false}
                elevation={0}
                divider={false}
              >
                <tab.component
                  data={element}
                  parameter={getParameter()}
                  parameters={tab.parameters?.map((param) => ({
                    value: get(element, param.accessor),
                    name: param.name,
                  }))}
                  readOnly={tab.readOnly?.(element)}
                />
              </MainCard>
            ))}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      {renderMainContent()}
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label={t('general.rounds')}>
              {tabs?.map((tab, i) => (
                <ButtonTabPrimary key={i} label={tab.title} value={i} />
              ))}
              {hasInfo && <ButtonTabPrimary label={t('common.information')} value={50} />}
            </TabList>
          </Box>
          {tabs
            ?.filter((tab) => !tab.condition || tab.condition(element))
            .map((tab, i) => (
              <TabPanel key={i} value={i} sx={{ px: 0, pt: theme.spacing(2) }}>
                <tab.component
                  data={element}
                  parameter={getParameter()}
                  parameters={tab.parameters?.map((param) => ({
                    value: get(element, param.accessor),
                    name: param.name,
                  }))}
                  readOnly={tab.readOnly?.(element)}
                />
              </TabPanel>
            ))}
          {hasInfo && (
            <TabPanel value={50} sx={{ px: 0, py: theme.spacing(2) }}>
              <InfoPanel data={element} metadata={metadata} config={config} />
            </TabPanel>
          )}
        </TabContext>
      </Grid>
    </Grid>
  );
};
