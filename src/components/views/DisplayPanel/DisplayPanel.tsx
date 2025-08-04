import { CardContent, TableContainer, TableBody, Table } from '@mui/material';
import { MainCard } from 'components/cards/MainCard';
import { DisplayBox } from 'components/DisplayBox';
import { TemplateType, DataType, IConfigProps, IDisplayBoxProps, EditionMode } from 'models';
import { SubHeader, AvatarHeader, IngestInfo } from 'components/views';
import get from 'lodash/get';
import { IToolbarPanelProps } from 'types/views';

interface Props {
  element: any;
  setup: any;
  name: string;
  showDetail: boolean;
  showEditButton: boolean;
  displayBoxes: IDisplayBoxProps[];
  toolbar?: IToolbarPanelProps<any>[];
  config: IConfigProps;
  editionMode: EditionMode;
  handleShowHideDetail: () => void;
  handleOnClickEdit: () => void;
}
export const DisplayPanel = ({
  element,
  showDetail,
  displayBoxes,
  showEditButton,
  toolbar,
  config,
}: Props) => {
  if (!showDetail) {
    return <SubHeader element={element} config={config} />;
  }

  const showButtons = showEditButton || toolbar !== undefined;

  const computedRoute = (box: any) => {
    let route = '';
    if (box.route) {
      if (box.template !== TemplateType.RouteDirect) {
        route = `/${box.route}/${get(element, `${box.field}.id`)}`;
      } else {
        route = `/${box.route}/${get(element, box.field)}`;
      }
    }
    return route;
  };

  return (
    <MainCard
      boxShadow={false}
      border={false}
      divider={false}
      avatar={<AvatarHeader element={element} config={config} />}
      subHeader={<SubHeader element={element} config={config} />}
      sx={{ width: '100%' }}
    >
      <CardContent
        sx={{
          paddingBottom: !showButtons ? '0' : '0!important',
          paddingTop: 0,
          px: 0,
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableBody>
              {displayBoxes.map((box, i) => (
                <DisplayBox
                  {...box}
                  key={`${box.route}-${i}`}
                  value={
                    box.route && box.template != TemplateType.RouteDirect
                      ? (get(element, `${box.field}.title`) ??
                        get(element, `${box.field}.name`) ??
                        get(element, `${box.field}.id`))
                      : get(element, box.field)
                  }
                  icon={box.icon}
                  route={computedRoute(box)}
                  type={box.type ?? DataType.String}
                />
              ))}
              <IngestInfo element={element} />
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </MainCard>
  );
};
