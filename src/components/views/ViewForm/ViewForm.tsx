import { MainCard } from 'components/cards/MainCard';
import { EditionMode, IConfigProps, IQueryProps, MetadataModel, QueryFilterValue } from 'models';
import {
  EditConsolidationPanel,
  EditMergeConsolidationPanel,
} from 'pages/tools/consolidation/components';
import { data } from 'react-router-dom';

interface Props {
  element: any;
  setup: any;
  name: string;
  dataSource?: IQueryProps;
  metadata?: { [key: string]: MetadataModel };
  config: IConfigProps;
  tags?: Array<QueryFilterValue>;
  editionMode: EditionMode;
  handleEditionMode: (mode: EditionMode) => void;
}
export const ViewForm: React.FC<Props> = ({
  element,
  setup,
  config,
  name,
  tags,
  metadata,
  dataSource,
  handleEditionMode,
}: Props) => {
  return (
    <MainCard
      boxShadow={false}
      border={false}
      divider={false}
      headerSX={{ p: 0 }}
      content={false}
      sx={{ width: '100%' }}
    >
      <>
        {setup.data.enabled === true ? (
          <EditConsolidationPanel
            id={element.id}
            name={name}
            config={config}
            data={data}
            metadata={metadata}
            fieldSetup={setup.data}
            onCallback={() => handleEditionMode(EditionMode.Detail)}
          />
        ) : (
          <EditMergeConsolidationPanel
            id={element.id}
            name={name}
            config={config}
            data={data}
            dataSource={dataSource}
            tags={tags}
            metadata={metadata}
            fieldSetup={setup.data}
            onCallback={() => handleEditionMode(EditionMode.Detail)}
          />
        )}
      </>
    </MainCard>
  );
};
