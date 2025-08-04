import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { t } from 'i18next';
import { CodeBlock, MainCard } from 'components';
import { parseMixedJsonXml } from './utils';
import { JsonErrorViewer } from './JsonErrorViewer';

type Props = {
  id: string;
  data?: string;
};

export const IngestXMLMessage = (props: Props) => {
  if (!props.data) return null;
  const formatData = parseMixedJsonXml(props.data);
  const downloadXml = async () => {
    const blob = new Blob([formatData.formattedXml ?? ''], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.id}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainCard
      headerSX={{ pb: 0 }}
      contentSX={{ pt: 0 }}
      secondary={
        <Button
          variant="outlined"
          size="small"
          onClick={downloadXml}
          startIcon={<FileDownloadOutlinedIcon />}
        >
          {t('actions.buttonDownload')}
        </Button>
      }
    >
      <JsonErrorViewer json={formatData.json} />
      <CodeBlock
        code={formatData.formattedXml ?? ''}
        language="xml"
        theme="solarized-light"
        showLineNumbers
      />
    </MainCard>
  );
};
