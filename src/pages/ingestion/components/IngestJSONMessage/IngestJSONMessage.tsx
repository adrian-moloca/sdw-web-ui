import { IconButton } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { t } from 'i18next';
import { MainCard } from 'components';

type Props = {
  data?: string;
  id: string;
};

export const IngestJSONMessage = (props: Props) => {
  if (!props.data) return null;

  const downloadJson = async () => {
    const blob = new Blob([JSON.stringify(props.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openJsonInNewTab = async () => {
    const jsonContent = JSON.stringify(props.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert(t('message.popup-blocked'));
    }
  };

  return (
    <MainCard
      boxShadow={false}
      border={false}
      divider={false}
      content={false}
      headerSX={{ py: 0 }}
      size="small"
      title="USDF JSON File"
      contentSX={{ paddingTop: 0 }}
      secondary={
        <>
          <IconButton size="small" onClick={openJsonInNewTab}>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton size="small" onClick={downloadJson}>
            <FileDownloadOutlinedIcon />
          </IconButton>
        </>
      }
    >
      <PerfectScrollbar style={{ maxHeight: 640, overflowX: 'hidden' }}>
        <JsonView
          data={JSON.parse(props.data)}
          shouldExpandNode={allExpanded}
          style={defaultStyles}
        />
      </PerfectScrollbar>
    </MainCard>
  );
};
