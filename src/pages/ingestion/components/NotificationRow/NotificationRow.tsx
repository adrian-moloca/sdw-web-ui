import { IconButton, TableCell, TableRow } from '@mui/material';
import { t } from 'i18next';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

type Props = {
  row: any;
};

export const NotificationRow = (props: Props) => {
  const { row } = props;

  const downloadJson = () => {
    const jsonObject = JSON.parse(row.content);
    const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${row.id}_${row.module}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openJsonInNewTab = async () => {
    const jsonObject = JSON.parse(row.content);
    const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert(t('message.popup-blocked'));
    }
  };

  return (
    <TableRow>
      <TableCell>
        <IconButton aria-label="view row" sx={{ p: 0 }} size="small" onClick={openJsonInNewTab}>
          <SearchOutlinedIcon />
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {row.action}
      </TableCell>
      <TableCell>{row.createdTs}</TableCell>
      <TableCell>{row.module}</TableCell>
      <TableCell>
        <IconButton aria-label="download row" sx={{ p: 0 }} size="small" onClick={downloadJson}>
          <FileDownloadOutlinedIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
