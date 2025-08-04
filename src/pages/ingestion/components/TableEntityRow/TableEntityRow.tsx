import { Collapse, IconButton, Paper, TableBody, TableCell, TableRow } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BorderedTable, FieldTemplate, GenericLoadingPanel } from 'components';
import { TemplateType } from 'models';

type Props = { row: any; id: string; isLoading: boolean; data: Array<any> };

export const TableEntityRow = (props: Props) => {
  const { row } = props;

  const [open, setOpen] = useState(false);

  const data = props.data.filter((x: any) => x.type == row.type);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.id}_entities.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openJsonInNewTab = async () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert(t('message.popup-blocked'));
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            sx={{ p: 0 }}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.total}</TableCell>
        <TableCell>
          <IconButton
            aria-label="view row"
            size="small"
            onClick={openJsonInNewTab}
            disabled={data.length === 0}
            sx={{ p: 0 }}
          >
            <SearchOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="download row"
            size="small"
            onClick={downloadJson}
            disabled={data.length === 0}
            sx={{ p: 0 }}
          >
            <FileDownloadOutlinedIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper sx={{ margin: 1 }} elevation={0}>
              {props.isLoading ? (
                <GenericLoadingPanel loading={props.isLoading} />
              ) : (
                <BorderedTable size="small">
                  <TableBody>
                    {data.map((e: any) => (
                      <TableRow key={e.id}>
                        <TableCell>{e.id}</TableCell>
                        <TableCell>
                          <FieldTemplate value={e.externalIds} type={TemplateType.Tags} size="xs" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </BorderedTable>
              )}
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
